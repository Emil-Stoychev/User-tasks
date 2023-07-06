import styles from "../index.module.css";
import { useState } from "react";
import { Task } from "../../lib/types/taskInterface";
import AllTasksComp from "./task";

const SearchTemplate = (props: {
  tasks: Task[];
  setTasks: Function;
  search: string;
  setSearch: Function;
}) => {
  const [sortOption, setSortOption] = useState(false);

  const sortTask = () => {
    setSortOption((state) => !state);

    if (!sortOption) {
      props.setTasks((state: any) => state.sort((a: any, b: any) => b.title.localeCompare(a.title)));
    } else {
      props.setTasks((state: any) => state.sort((a: any, b: any) => a.title.localeCompare(b.title)));
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="d-flex align-items-center" id={styles.searchBtns}>
              <input
                type="search"
                className="form-control mr-2"
                placeholder="Search"
                value={props.search}
                onChange={(e) => props.setSearch(e.target.value)}
              />
              <button onClick={() => sortTask()} className="btn btn-primary">
                Sort
              </button>
            </div>
          </div>
        </div>
      </div>

      <AllTasksComp tasks={props.tasks} setTasks={props.setTasks} />
    </>
  );
};

export default SearchTemplate;
