import styles from "../index.module.css";
import {ProfileInterface} from "../../lib/types/profileInterface";
import {DeleteOption} from "../../lib/types/delOption";
import {EditOptionIn} from "../../lib/types/editOptionIn";

const ProfileTemplate = (props: {
  user: ProfileInterface,
  delOption: DeleteOption,
  setEditOption: Function,
  setDelOption: Function,
  editOption: EditOptionIn,
  deleteProfile: Function,
  onSubmitEditPass: Function,
}) => {
  const onChangeEditHandler = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement

    props.setEditOption((state: EditOptionIn) => ({
      ...state,
      [target.name]: target.value,
    }));
  };

  const onChangeConfirmHandler = (e: React.SyntheticEvent) => {
    let target = e.target as HTMLInputElement

    props.setDelOption((state: DeleteOption) => ({
      ...state,
      [target.name]: target.value,
    }));
  };

  return (
    <>
      <main className={styles.main}>
        <div className="card text-center">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="card-img-top"
            width="200px"
          />
          <div className="card-body">
            <h5 className="card-title">{props.user?.username}</h5>

            {!props?.delOption?.option && !props?.editOption?.option && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    props.setEditOption({
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
                  onClick={() => props.setDelOption({ option: true, field: "" })}
                >
                  Delete profile
                </button>
              </>
            )}

            {props?.delOption?.option && (
              <>
                <form action="/action_page.php">
                  <div className="form-group">
                    <label>Please type "CONFIRM" to delete acc!</label>
                    <input
                      className="form-control"
                      type="text"
                      name="field"
                      value={props?.delOption?.field}
                      onChange={(e) => onChangeConfirmHandler(e)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={(e) => props.deleteProfile(e)}>
                    ✓
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => props.setDelOption({ option: false, field: "" })}
                  >
                    X
                  </button>
                </form>
              </>
            )}

            {props?.editOption?.option && (
              <>
                <form action="/action_page.php">
                  <div className="form-group">
                    <label htmlFor="oldPass">Old Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="oldPass"
                      value={props.editOption.oldPassword}
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
                      value={props.editOption.newPassword}
                      onChange={(e) => onChangeEditHandler(e)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => props.onSubmitEditPass(e)}
                  >
                    ✓
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      props.setEditOption({
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
    </>
  );
};

export default ProfileTemplate