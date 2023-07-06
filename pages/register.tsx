import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from "joi";
import styles from "./index.module.css";
import useGlobalErrorsHook from "../hooks/useGlobalErrors";

const schema = Joi.object({
  username: Joi.string().min(3).max(16).required(),

  password: Joi.string().min(3).max(16).required(),
});

export default function Register() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const route = useRouter();
  const [errors, setErrors] = useGlobalErrorsHook();

  const onChangeHandler = (e: any) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(data);

    if (validateData?.error?.message != undefined) {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const jsonData = await response.json();

    if (jsonData.message) {
      return setErrors({ message: jsonData.message, type: "" });
    }

    localStorage.setItem("sessionStorage", jsonData);
    route.push("/");
  };

  return (
    <Layout>
      <main className={styles.main}>
        <h2>Register page</h2>

        <form action="/action_page.php">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={data.username}
              name="username"
              onChange={onChangeHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="pwd"
              value={data.password}
              onChange={onChangeHandler}
            />
          </div>
          <button
            type="submit"
            className="btn btn-default"
            onClick={onSubmitForm}
          >
            Register
          </button>
        </form>
      </main>
    </Layout>
  );
}
