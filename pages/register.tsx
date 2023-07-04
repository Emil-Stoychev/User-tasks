import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from 'joi'

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
        <h2>Register page</h2>

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

          <button onClick={onSubmitForm}>Register</button>
        </form>
      </Layout>
    </>
  );
}
