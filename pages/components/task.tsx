import { useRouter } from "next/router";
import { TaskTemplate } from "./taskTemplate";

export const AllTasksComp = ({ tasks, setTasks }) => {
  const route = useRouter();

  const deleteTask = async (taskId: any) => {
    const response = await fetch(`/api/deleteTask/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("sessionStorage")}`,
      },
    });
    const jsonData = await response.json();

    if (jsonData.message != null) {
      if (jsonData.message == "Invalid token, please login!") {
        localStorage.removeItem("sessionStorage");

        route.push("/login");
      }

      return console.log(jsonData.message);
    }

    setTasks((state: any) =>
      state.filter((x: any) => x?._id != jsonData.taskId)
    );
  };

  const changeStatus = async (taskId: any, status: boolean) => {
    const response = await fetch(`/api/changeStatus/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("sessionStorage")}`,
      },
      body: JSON.stringify({ status }),
    });
    const jsonData = await response.json();

    if (jsonData.message != null) {
      if (jsonData.message == "Invalid token, please login!") {
        localStorage.removeItem("sessionStorage");

        route.push("/login");
      }

      return console.log(jsonData.message);
    }

    setTasks((state: any) =>
      state.map((x: any) => {
        if (x?._id == jsonData.taskId) {
          x.completed = jsonData.status;
        }

        return x;
      })
    );
  };

  return (
    <>
      <h1>Your table with tasks</h1>

      {tasks.length == 0 && <h2>You don't have tasks yet.</h2>}

      <ul>
        {tasks.map((task: any) => (
          <TaskTemplate key={task._id} task={task} setTasks={setTasks} deleteTask={deleteTask} changeStatus={changeStatus} />
        ))}
      </ul>
    </>
  );
};
