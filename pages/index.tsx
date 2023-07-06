import Layout from "./Layout";
import clientPromise from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GuestComp from "./components/guestComp";
import { Task } from "../lib/types/taskInterface";
import useGlobalErrorsHook from "../hooks/useGlobalErrors";
import SearchTemplate from "./components/searchTemplate";

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
  const [savedTask, setSavedTask] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [session, setSession] = useState<String | null | undefined>(undefined);
  const route = useRouter();
  const [errors, setErrors] = useGlobalErrorsHook();

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
          setSavedTask([]);
          setSession(undefined);
          localStorage.removeItem("sessionStorage");

          return setErrors({ message: jsonData?.message, type: "" });
        }

        setTasks(jsonData);
        setSavedTask(jsonData);
        setSession(localStorage.getItem("sessionStorage"));
      })();
    }
  }, []);

  useEffect(() => {
    setTasks(savedTask);
    setTasks((state) => state.filter((x) => x.title.includes(search)));
  }, [search]);

  return (
    <Layout>
      <main className={styles.main}>
        <div>
          {session != undefined ? (
            <SearchTemplate
              tasks={tasks}
              setTasks={setTasks}
              search={search}
              setSearch={setSearch}
            />
          ) : (
            <GuestComp />
          )}
        </div>
      </main>
    </Layout>
  );
}
