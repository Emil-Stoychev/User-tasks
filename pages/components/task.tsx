import { useRouter } from "next/router";
import TaskTemplate from "./taskTemplate";
import styles from './taskTemplate.module.css'
import useGlobalErrorsHook from "../../hooks/useGlobalErrors";
import { Task } from "../../lib/types/taskInterface";

const AllTasksComp = (props: { tasks: Task[], setTasks: Function }) => {
  const route = useRouter();
  const [_errors, setErrors] = useGlobalErrorsHook()

  const deleteTask = async (taskId: object | string | undefined) => {
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

    props.setTasks((state: Task[]) =>
      state.filter((x: Task) => x?._id != jsonData.taskId)
    );
  };

  const changeStatus = async (taskId: object | string | undefined, status: boolean) => {
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

    props.setTasks((state: Task[]) =>
      state.map((x: Task) => {
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
      {props.tasks?.length == 0 && <h2>You don't have tasks yet.</h2>}

      <ul className={styles.allCards}>
        {props.tasks?.map((task: Task) => (
          <TaskTemplate key={task._id} task={task} setTasks={props.setTasks} deleteTask={deleteTask} changeStatus={changeStatus} />
        ))}
      </ul>
    </>
  );
};

export default AllTasksComp