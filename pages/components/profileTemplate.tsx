import styles from "../index.module.css";

export const ProfileTemplate = ({
  user,
  delOption,
  setEditOption,
  setDelOption,
  editOption,
  deleteProfile,
  onSubmitEditPass,
}) => {
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
    </>
  );
};
