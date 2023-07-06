import Navigation from "./core/navigation/Navigation";
import Footer from "./core/footer/Footer";
import { ReactNode, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import Head from "next/head";
import { ProfileInterface } from "./types/profileInterface";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ProfileInterface | null>(null);

  useEffect(() => {
    if (localStorage.getItem("sessionStorage")) {
      let token = localStorage.getItem("sessionStorage") || ''
      let userData: JwtPayload | null = null

      userData = jwt.decode(token) as JwtPayload;

      if (userData?.username) {
        setUser(userData as ProfileInterface);
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
        <Navigation user={user as ProfileInterface} setUser={setUser} />

        <main>{children}</main>

        <Footer />
      </div>
    </>
  );
};

export default Layout;
