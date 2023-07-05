import { useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from "joi";
import styles from "./index.module.css";
import useGlobalErrorsHook from "./hooks/useGlobalErrors";

const schema = Joi.object({
  title: Joi.string().min(3).max(32).required(),

  description: Joi.string().min(3).max(300).required(),
});

export default function Create() {
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  let [errors, setErrors] = useGlobalErrorsHook();
  const route = useRouter();

  const onChangeHandler = (e: any) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(data);
    console.log(validateData?.error?.message);

    if (validateData?.error?.message == undefined) {
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
        if (jsonData.message == "Invalid token, please login!") {
          localStorage.removeItem("sessionStorage");

          route.push("/login");
        }

        return setErrors({ message: jsonData?.message, type: "" });
      }

      route.push("/");
    } else {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }
  };

  return (
    <>
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
                onChange={onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className={`form-control ${styles.description}`}
                name="description"
                id="description"
                value={data?.description || ""}
                onChange={onChangeHandler}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-default"
              onClick={onSubmitForm}
            >
              Create
            </button>
          </form>
        </main>
      </Layout>
    </>
  );
}
