import { useRouter } from "next/router";
import { useState } from "react";
import { Task } from "../types/taskInterface";
import Joi from "joi";

const schema = Joi.object({
  title: Joi.string().alphanum().min(3).max(16).required(),

  description: Joi.string().min(3).max(16).required(),
});

export const TaskTemplate = (props: {
  task: Task;
  setTasks: Function;
  deleteTask: Function;
  changeStatus: Function;
}) => {
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
    console.log(validateData?.error?.message);

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
        if (jsonData?.message == "Invalid token, please login!") {
          localStorage.removeItem("sessionStorage");

          route.push("/login");
        }

        return console.log(jsonData?.message);
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
    }
  };

  return (
    <>
      <div key={props?.taks?._id} className="card" width='200px'>
        <img className="card-img-top" width='100px' src="https://www.task-tools.com/media/wysiwyg/Image-content/TASK_logo_HR.jpg" alt="Card image" />
        <div className="card-body">
          <h4 className="card-title">John Doe</h4>
          <p className="card-text">Some example text.</p>
          <a href="#" className="btn btn-primary">See Profile</a>
        </div>
      </div>

      <li key={props.task?._id}>
        {isEdit ? (
          <>
            <input
              type="text"
              value={data.title}
              onChange={onChangeHandler}
              name="title"
              placeholder="Title"
            />
            <input
              type="text"
              value={data.description}
              onChange={onChangeHandler}
              name="description"
              placeholder="Description"
            />
            <button onClick={onEditSubmit}>✓</button>
            <button onClick={() => setIsEdit(false)}>X</button>
          </>
        ) : (
          <>
            <h2>{props.task?.title}</h2>
            <p>{props.task?.description}</p>
          </>
        )}
        {!isEdit && (
          <>
            <h3
              onClick={() =>
                props.changeStatus(props.task?._id, props.task?.completed)
              }
            >
              Status:{" "}
              {props.task?.completed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm79 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
              )}
            </h3>

            <div>
              <h3 onClick={() => props.deleteTask(props.task._id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </h3>

              <h3 onClick={() => editTaskHandler()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
              </h3>
            </div>
          </>
        )}
      </li>
    </>
  );
};
