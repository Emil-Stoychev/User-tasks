import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import ProfileTemplate from "./components/profileTemplate";
import useGlobalErrorsHook from "../hooks/useGlobalErrors";
import Joi from "joi";
import { ProfileInterface } from "../lib/types/profileInterface";
import { DeleteOption } from "../lib/types/delOption";
import { EditOptionIn } from "../lib/types/editOptionIn";

const schema = Joi.object({
  oldPassword: Joi.string().min(3).max(16).required(),

  newPassword: Joi.string().min(3).max(16).required(),
  option: true,
});

export default function Profile() {
  const [delOption, setDelOption] = useState<DeleteOption>({
    option: false,
    field: "",
  });
  const [editOption, setEditOption] = useState<EditOptionIn>({
    option: false,
    oldPassword: "",
    newPassword: "",
  });
  let [_errors, setErrors] = useGlobalErrorsHook();
  const [user, setUser] = useState<ProfileInterface | null>(null);
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

          return setErrors({ message: jsonData?.message, type: "" });
        }

        setUser(jsonData);
      })();
    }
  }, []);

  const deleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
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

      route.push("/login");

      localStorage.removeItem("sessionStorage");
      setErrors({ message: jsonData?.message, type: "" });
    }
  };

  const onSubmitEditPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validateData = schema.validate(editOption);

    if (validateData?.error?.message != undefined) {
      return setErrors({ message: validateData?.error?.message, type: "" });
    }

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

      return setErrors({ message: "Successfully changed!", type: "" });
    }
  };

  return (
    <Layout>
      <ProfileTemplate
        user={user as ProfileInterface}
        delOption={delOption}
        setEditOption={setEditOption}
        setDelOption={setDelOption}
        editOption={editOption}
        deleteProfile={deleteProfile}
        onSubmitEditPass={onSubmitEditPass}
      />
    </Layout>
  );
}
