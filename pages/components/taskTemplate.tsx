import { useRouter } from "next/router";
import { useState } from "react";
import Task from "../types/taskInterface";
import Joi from "joi";
import styles from "./taskTemplate.module.css";
import useGlobalErrorsHook from "../hooks/useGlobalErrors";

const schema = Joi.object({
  title: Joi.string().min(3).max(32).required(),

  description: Joi.string().min(3).max(300).required(),
});

const TaskTemplate = (props: {
  task: Task;
  setTasks: Function;
  deleteTask: Function;
  changeStatus: Function;
}) => {
  let [errors, setErrors] = useGlobalErrorsHook();
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  const route = useRouter();

  const onChangeHandler = (e: any) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const editTaskHandler = async () => {
    if (!isEdit) {
      setIsEdit(true);
      setData({ title: props.task.title, description: props.task.description });
    } else {
      setIsEdit(false);
      setData({ title: "", description: "" });
    }
  };

  const onEditSubmit = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(data);

    if (validateData?.error?.message == undefined) {
      const response = await fetch("/api/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("sessionStorage")}`,
        },
        body: JSON.stringify({ data: data, taskId: props.task._id }),
      });
      const jsonData = await response.json();

      if (jsonData?.message != null) {
        if (jsonData?.message == "Invalid token, please login!" || jsonData?.message == 'User not found!') {
          localStorage.removeItem("sessionStorage");
          setErrors({ message: jsonData?.message, type: "" });

          route.push("/login");
        }

        return setErrors({ message: jsonData?.message, type: "" });
      }

      props.setTasks((state: any) =>
        state.map((x: any) => {
          if (x._id == props.task._id) {
            x.title = data.title;
            x.description = data.description;
          }

          return x;
        })
      );

      setIsEdit(false);
      setData({ title: "", description: "" });
    } else {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }
  };

  return (
    <>
      <div className={props?.task?.completed ? styles.card : styles.cardA}>
        <div className="card-header"></div>
        <div className="card-body" id={styles.cardBody}>
          {isEdit ? (
            <div>
              <input
                type="text"
                value={data.title}
                className="form-control"
                onChange={onChangeHandler}
                name="title"
                placeholder="Title"
              />
              <textarea
                id={styles.textArea}
                value={data.description}
                className="form-control"
                onChange={onChangeHandler}
                name="description"
                placeholder="Description"
              >
                {data.description}
              </textarea>
              <button className="btn btn-primary" onClick={onEditSubmit}>
                ✓
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsEdit(false)}
              >
                X
              </button>
            </div>
          ) : (
            <>
              <h2 className="card-title">{props.task?.title}</h2>
              <p className="card-text">{props.task?.description}</p>
            </>
          )}
        </div>
        <div className="card-footer" id={styles.cardBody}>
          Status: {props.task?.completed ? "Completed!" : "Incompleted!"}
        </div>

        <div className="btn-group" role="group" id={styles.btns}>
          {!isEdit && (
            <>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    props.changeStatus(props.task?._id, props.task?.completed)
                  }
                >
                  Change status
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => props.deleteTask(props.task._id)}
                >
                  Delete
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => editTaskHandler()}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskTemplate