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
  const [savedTask, setSavedTask] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState(false);
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
          setSavedTask([]);
          setSession(undefined);
          localStorage.removeItem("sessionStorage");

          return console.log(jsonData.message);
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

  const sortTask = () => {
    setSortOption((state) => !state);

    if (!sortOption) {
      setTasks((state) => state.sort((a, b) => b.title.localeCompare(a.title)));
    } else {
      setTasks((state) => state.sort((a, b) => a.title.localeCompare(b.title)));
    }
  };

  return (
    <Layout>
      <main className={styles.main}>
        <div>
          {session != undefined ? (
            <>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8">
                    <div className="d-flex align-items-center">
                      <input
                        type="search"
                        className="form-control mr-2"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        onClick={() => sortTask()}
                        className="btn btn-primary"
                      >
                        Sort
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AllTasksComp tasks={tasks} setTasks={setTasks} />
            </>
          ) : (
            <GuestComp />
          )}
        </div>
      </main>
    </Layout>
  );
}
