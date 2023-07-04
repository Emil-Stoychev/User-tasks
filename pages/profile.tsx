import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { Profile } from "./types/profileInterface";

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

    if (delOption.field != "" && delOption.field != "" && delOption.field == 'CONFIRM') {
      await fetch(`/api/deleteProfile/${user?._id.toString()}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
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
        userId: user?._id
      }

      const response = await fetch("/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();

      if (jsonData.message != 'Successfully!') {
        return console.log(jsonData.message);
      } else {
        setEditOption({ option: false, oldPassword: '', newPassword: ''})
      }
    }
  };
  

  return (
    <>
      <Layout>
        <h2>Profile page</h2>

        <div>
          <div>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              width="100"
              height="100"
            />
          </div>

          <div>
            <h2>{user?.username}</h2>

            <div>
              {!delOption.option && !editOption.option &&
                  <>
                  <button onClick={() => setEditOption({option: true,oldPassword: '', newPassword: ''})}>Change password</button>
                  <button onClick={() => setDelOption({option: true, field: ''})} >Delete profile</button>
                </>
              }


              {delOption.option &&
                <>
                    <label>Please type "CONFIRM" to delete acc!</label>
                    <input type="text" name="field" value={delOption.field} onChange={(e) => onChangeConfirmHandler(e)} />
                    <button onClick={deleteProfile}>✓</button>
                    <button onClick={() => setDelOption({option: false, field: ''})}>X</button>
                </>
                }

                {editOption.option &&
                  <>
                    <label>Old password</label>
                    <input type="password" name="oldPassword" value={editOption.oldPassword} onChange={(e) => onChangeEditHandler(e)} />
                    <label>New password</label>
                    <input type="password" name="newPassword" value={editOption.newPassword} onChange={(e) => onChangeEditHandler(e)} />
                    <button onClick={onSubmitEditPass}>✓</button>
                    <button onClick={() => setEditOption({option: false, oldPassword: '', newPassword: ''})}>X</button>
                  </>
                }
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
