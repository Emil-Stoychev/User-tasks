import Navigation from "./core/navigation/Navigation";
import Footer from "./core/footer/Footer";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Head from "next/head";

const Layout: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("sessionStorage")) {
      let userData = jwt.decode(localStorage.getItem("sessionStorage"));

      if (userData?.username) {
        setUser(userData);
      } else {
        setUser(null);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>User Tasks</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      </Head>

      <div id="container">
        <Navigation user={user} setUser={setUser} />

        <main>{children}</main>

        <Footer />
      </div>
    </>
  );
};

export default Layout;
