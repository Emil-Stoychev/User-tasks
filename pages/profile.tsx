import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { Profile } from "./types/profileInterface";
import { ProfileTemplate } from "./components/profileTemplate";
import useGlobalErrorsHook from "./hooks/useGlobalErrors";
import Joi from "joi";

const schema = Joi.object({
  oldPassword: Joi.string().min(3).max(16).required(),

  newPassword: Joi.string().min(3).max(16).required(),
  option: true
});

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
  let [errors, setErrors] = useGlobalErrorsHook();
  const [user, setUser] = useState<Profile | null>(null);
  const route = useRouter();

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

          return setErrors({message: jsonData?.message, type: ''})
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
      let response = await fetch(`/api/deleteProfile/${user?._id.toString()}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("sessionStorage")}`,
        },
      });
      const jsonData = await response.json();

      setErrors({message: jsonData?.message, type: ''})

      localStorage.removeItem("sessionStorage");
      route.push("/login");
    }
  };

  const onSubmitEditPass = async (e: any) => {
    e.preventDefault();

    let validateData = schema.validate(editOption);

    if (validateData?.error?.message == undefined) {
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
        return setErrors({ message: jsonData.message, type: "" });
      } else {
        setEditOption({ option: false, oldPassword: "", newPassword: "" });

        return setErrors({ message: 'Successfully changed!', type: "" });
      }
    } else {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }
  };

  return (
    <>
      <Layout>
        <ProfileTemplate user={user} delOption={delOption} setEditOption={setEditOption} setDelOption={setDelOption} editOption={editOption} deleteProfile={deleteProfile} onSubmitEditPass={onSubmitEditPass} />
      </Layout>
    </>
  );
}
