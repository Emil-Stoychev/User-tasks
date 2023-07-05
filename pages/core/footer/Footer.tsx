import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={`page-footer font-small cyan darken-3 ${styles.footer}`}>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            Made by: Emil Stoychev
          </div>
        </div>
      </div>
    </footer>
  );
}
