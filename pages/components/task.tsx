import { useRouter } from "next/router";
import TaskTemplate from "./taskTemplate";
import styles from './taskTemplate.module.css'
import useGlobalErrorsHook from "../hooks/useGlobalErrors";

const AllTasksComp = (props: { tasks: Object[], setTasks: Function }) => {
  const route = useRouter();
  const [errors, setErrors] = useGlobalErrorsHook()

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
      if (jsonData.message == "Invalid token, please login!" || jsonData?.message == 'User not found!') {
        localStorage.removeItem("sessionStorage");
        setErrors({message: jsonData?.message, type: ''})

        route.push("/login");
      }

      return setErrors({message: jsonData?.message, type: ''})
    }

    props.setTasks((state: any) =>
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
      if (jsonData.message == "Invalid token, please login!" || jsonData?.message == 'User not found!') {
        localStorage.removeItem("sessionStorage");
        setErrors({message: jsonData?.message, type: ''})

        route.push("/login");
      }

      return setErrors({message: jsonData?.message, type: ''})
    }

    props.setTasks((state: any) =>
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
      <br />
      {props.tasks.length == 0 && <h2>You don't have tasks yet.</h2>}

      <ul className={styles.allCards}>
        {props.tasks.map((task: any) => (
          <TaskTemplate key={task._id} task={task} setTasks={props.setTasks} deleteTask={deleteTask} changeStatus={changeStatus} />
        ))}
      </ul>
    </>
  );
};

export default AllTasksComp