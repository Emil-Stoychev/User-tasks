import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { Profile } from "./types/profileInterface";
import styles from "./index.module.css";

export default function Profile() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [delOption, setDelOption] = useState({
    option: false,
    field: "",
  });
  const [editOption, setEditOption] = useState({
    option: false,
    oldPassword: "",
    newPassword: "",
  });
  const [user, setUser] = useState<Profile | null>(null);
  const route = useRouter();

  const onChangeEditHandler = (e: any) => {
    setEditOption((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeConfirmHandler = (e: any) => {
    setDelOption((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (localStorage.getItem("sessionStorage")) {
      (async function req() {
        const headers = {
          Authorization: `${localStorage.getItem("sessionStorage")}`,
        };
        const response = await fetch("/api/profile", { headers });
        const jsonData = await response.json();

        if (jsonData?.message) {
          route.push("/login");

          setUser(null);
          localStorage.removeItem("sessionStorage");
          return console.log(jsonData?.message);
        }

        setUser(jsonData);
      })();
    }
  }, []);

  const deleteProfile = async (e: any) => {
    e.preventDefault();

    if (
      delOption.field != "" &&
      delOption.field != "" &&
      delOption.field == "CONFIRM"
    ) {
      await fetch(`/api/deleteProfile/${user?._id.toString()}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("sessionStorage");
      route.push("/login");
    }
  };

  const onSubmitEditPass = async (e: any) => {
    e.preventDefault();

    if (editOption.oldPassword != "" && editOption.newPassword != "") {
      let data = {
        oldPassword: editOption.oldPassword,
        newPassword: editOption.newPassword,
        userId: user?._id,
      };

      const response = await fetch("/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();

      if (jsonData.message != "Successfully!") {
        return console.log(jsonData.message);
      } else {
        setEditOption({ option: false, oldPassword: "", newPassword: "" });
      }
    }
  };

  return (
    <>
      <Layout>
        <main className={styles.main}>
          <div className="card text-center">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile"
              className="card-img-top"
              width="200px"
            />
            <div className="card-body">
              <h5 className="card-title">{user?.username}</h5>

              {!delOption.option && !editOption.option && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setEditOption({
                        option: true,
                        oldPassword: "",
                        newPassword: "",
                      })
                    }
                  >
                    Change password
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setDelOption({ option: true, field: "" })}
                  >
                    Delete profile
                  </button>
                </>
              )}

              {delOption.option && (
                <>
                  <form action="/action_page.php">
                    <div className="form-group">
                      <label>Please type "CONFIRM" to delete acc!</label>
                      <input
                        className="form-control"
                        type="text"
                        name="field"
                        value={delOption.field}
                        onChange={(e) => onChangeConfirmHandler(e)}
                      />
                    </div>
                    <button className="btn btn-primary" onClick={deleteProfile}>
                      ✓
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setDelOption({ option: false, field: "" })}
                    >
                      X
                    </button>
                  </form>
                </>
              )}

              {editOption.option && (
                <>
                  <form action="/action_page.php">
                    <div className="form-group">
                      <label htmlFor="oldPass">Old Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="oldPass"
                        value={editOption.oldPassword}
                        name="oldPassword"
                        onChange={(e) => onChangeEditHandler(e)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pwd">New Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        id="pwd"
                        value={editOption.newPassword}
                        onChange={(e) => onChangeEditHandler(e)}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={onSubmitEditPass}
                    >
                      ✓
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setEditOption({
                          option: false,
                          oldPassword: "",
                          newPassword: "",
                        })
                      }
                    >
                      X
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
        <div></div>
      </Layout>
    </>
  );
}
