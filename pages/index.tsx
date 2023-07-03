import Head from "next/head";
import Layout from "./Layout";
import clientPromise from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AllTasksComp } from "./components/task";
import { GuestComp } from "./components/guestComp";
import { Task } from "./types/taskInterface";

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTask, setSearchTask] = useState<Task[]>([]);
  const [session, setSession] = useState<String | null | undefined>(undefined);
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

  return (
    <Layout>
      <Head>
        <title>User Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h2>Home page</h2>

          {session != undefined 
              ? <AllTasksComp tasks={tasks} setTasks={setTasks} />
              : <GuestComp />
          }
        </div>
      </main>
    </Layout>
  );
}
