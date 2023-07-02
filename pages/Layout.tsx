import Navigation from "./core/navigation/Navigation";
import Footer from "./core/footer/Footer";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

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
    <div className="container">
      <Navigation user={user} setUser={setUser} />

      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
