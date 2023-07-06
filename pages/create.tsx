import { useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from "joi";
import styles from "./index.module.css";
import useGlobalErrorsHook from "../hooks/useGlobalErrors";

const schema = Joi.object({
  title: Joi.string().min(3).max(32).required(),

  description: Joi.string().min(3).max(300).required(),
});

export default function Create() {
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  let [_errors, setErrors] = useGlobalErrorsHook();
  const route = useRouter();

  const onChangeHandler = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement

    setData((state) => ({
      ...state,
      [target.name]: target.value,
    }));
  };

  const onSubmitForm = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    let validateData = schema.validate(data);

    if (validateData?.error?.message != undefined) {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }

    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("sessionStorage")}`,
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();

    if (jsonData.message != null) {
      if (
        jsonData.message == "Invalid access token, please login!" ||
        jsonData.message == "User not found!"
      ) {
        localStorage.removeItem("sessionStorage");
        route.push("/login");
      }
      return setErrors({ message: jsonData?.message, type: "" });
    }

    route.push("/");
  };

  return (
    <Layout>
      <main className={styles.main}>
        <h2>Create page</h2>

        <form action="/action_page.php">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={data.title}
              name="title"
              onChange={(e) => onChangeHandler(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className={`form-control ${styles.description}`}
              name="description"
              id="description"
              value={data?.description || ""}
              onChange={(e) => onChangeHandler(e)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-default"
            onClick={(e: React.MouseEvent<HTMLElement>) => onSubmitForm(e)}
          >
            Create
          </button>
        </form>
      </main>
    </Layout>
  );
}
