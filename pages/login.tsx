import { useState, FormEvent } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from 'joi'
import useGlobalErrorsHook from './hooks/useGlobalErrors'

interface FormData {
  name: string;
  value: string;
}

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

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  let [errors, setErrors] = useGlobalErrorsHook()
  const route = useRouter();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e: FormEvent<FormData>) => {
    e.preventDefault();

    let validateData = schema.validate(data)

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
        setErrors({ message: jsonData.message, type: '' })

        return console.log(jsonData.message);
      }

      localStorage.setItem("sessionStorage", jsonData);
      route.push("/");
    } else {
      setErrors({ message: validateData?.error?.message, type: '' })
    }
  };

  return (
    <>
      <Layout>
        <h2>Login page</h2>

        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={data.username}
            onChange={onChangeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
          />

          <button onClick={onSubmitForm}>LOGIN</button>
        </form>
      </Layout>
    </>
  );
}
