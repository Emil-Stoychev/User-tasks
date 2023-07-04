import { useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import Joi from 'joi'

const schema = Joi.object({
  title: Joi.string()
      .alphanum()
      .min(3)
      .max(16)
      .required(),

  description: Joi.string()
      .min(3)
      .max(16)
      .required(),
})

export default function Create() {
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

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(data)
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

        return console.log(jsonData.message);
      }

      route.push("/");
    }
  };

  return (
    <>
      <Layout>
        <h2>Create page</h2>

        <form>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={onChangeHandler}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={data.description}
            onChange={onChangeHandler}
          />

          <button onClick={onSubmitForm}>Create</button>
        </form>
      </Layout>
    </>
  );
}
