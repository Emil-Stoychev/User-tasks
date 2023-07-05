import styles from './taskTemplate.module.css'

export const GuestComp = () => {
  return (
    <>
      <h3 className={styles.mainHeader}>Welcome to User Tasks App! <br /> here you can easily and quickly create, edit and track your tasks for the day!</h3>
      <h4 className={styles.mainHeader}>You must login to create and see tasks!</h4>

      <img id={styles.backgroundImage} src="https://images.ctfassets.net/rz1oowkt5gyp/1IgVe0tV9yDjWtp68dAZJq/36ca564d33306d407dabe39c33322dd9/TaskManagement-hero.png" alt="backgroundImage" />
    </>
  );
};
