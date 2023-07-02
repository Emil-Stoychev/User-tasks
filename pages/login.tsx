import { useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const route = useRouter()

  const onChangeHandler = (e) => {
    setData((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (data.username != "" && data.password != "") {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();

      if(jsonData.message) {
        return console.log(jsonData.message);
      }

      localStorage.setItem("sessionStorage", jsonData);
      route.push('/')
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
