import Head from "next/head";
import Layout from "./Layout";
import clientPromise from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [tasks, setTasks] = useState([]);
  const [session, setSession] = useState(undefined);
  const route = useRouter();

  useEffect(() => {
    if (localStorage.getItem("sessionStorage")) {
      (async function req() {
        const headers = {
          Authorization: `${localStorage.getItem("sessionStorage")}`,
        };
        const response = await fetch("/api/getTasks", { headers });
        const jsonData = await response.json();

        if (jsonData.message) {
          route.push("/login");

          setTasks([]);
          setSession(undefined);
          localStorage.removeItem("sessionStorage");

          return console.log(jsonData.message);
        }

        setTasks(jsonData);
        setSession(localStorage.getItem("sessionStorage"));
      })();
    }
  }, []);

  const deleteTask = async (taskId: any) => {
    const response = await fetch(`/api/deleteTask/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("sessionStorage")}`,
      },
    });
    const jsonData = await response.json();

    if (jsonData.message != null) {
      if (jsonData.message == "Invalid token, please login!") {
        localStorage.removeItem("sessionStorage");

        route.push("/login");
      }

      return console.log(jsonData.message);
    }

    setTasks((state) => state.filter((x) => x?._id != jsonData.taskId));
  };

  const changeStatus = async (taskId: any, status: boolean) => {
    const response = await fetch(`/api/changeStatus/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("sessionStorage")}`,
      },
      body: JSON.stringify({ status }),
    });
    const jsonData = await response.json();

    if (jsonData.message != null) {
      if (jsonData.message == "Invalid token, please login!") {
        localStorage.removeItem("sessionStorage");

        route.push("/login");
      }

      return console.log(jsonData.message);
    }

    setTasks((state) =>
      state.map((x) => {
        if (x?._id == jsonData.taskId) {
          x.completed = jsonData.status;
        }

        return x;
      })
    );
  };

  return (
    <Layout>
      <Head>
        <title>User Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h2>Home page</h2>

          {session != undefined ? (
            <>
              <h1>Your table with tasks</h1>

              {tasks.length == 0 && <h2>You don't have tasks yet.</h2>}

              <ul>
                {tasks.map((task) => (
                  <li key={task?._id}>
                    <h2>{task?.title}</h2>
                    <p>{task?.description}</p>
                    <h3
                      onClick={() => changeStatus(task?._id, task?.completed)}
                    >
                      Status:{" "}
                      {task?.completed ? (
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
                      <h3 onClick={() => deleteTask(task._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                        </svg>
                      </h3>

                      <h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                        >
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                        </svg>
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h2>You must login to create and see tasks!</h2>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
