import Navigation from "./core/navigation/Navigation";
import Footer from "./core/footer/Footer";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="container">
      <Navigation />

      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;