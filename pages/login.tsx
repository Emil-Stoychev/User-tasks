import { useState, FormEvent } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from "joi";
import useGlobalErrorsHook from "./hooks/useGlobalErrors";
import styles from "./index.module.css";

interface FormData {
  name: string;
  value: string;
}

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(16).required(),

  password: Joi.string().min(3).max(16).required(),
});

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  let [errors, setErrors] = useGlobalErrorsHook();
  const route = useRouter();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e: FormEvent<FormData>) => {
    e.preventDefault();

    let validateData = schema.validate(data);

    if (validateData?.error?.message == undefined) {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();

      if (jsonData.message) {
        setErrors({ message: jsonData.message, type: "" });

        return console.log(jsonData.message);
      }

      localStorage.setItem("sessionStorage", jsonData);
      route.push("/");
    } else {
      setErrors({ message: validateData?.error?.message, type: "" });
    }
  };

  return (
    <Layout>
      <main className={styles.main}>
        <h2>Login page</h2>

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
            Login
          </button>
        </form>
      </main>
    </Layout>
  );
}
