import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from 'joi'
import styles from './index.module.css'

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(16)
    .required(),

  password: Joi.string()
    .min(3)
    .max(16)
    .required(),
})

export default function Register() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const route = useRouter();

  const onChangeHandler = (e: any) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(data)
    console.log(validateData?.error?.message);

    if (validateData?.error?.message == undefined) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();

      if (jsonData.message) {
        return console.log(jsonData.message);
      }

      localStorage.setItem("sessionStorage", jsonData);
      route.push("/");
    }
  };

  return (
    <>
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
    </>
  );
}
