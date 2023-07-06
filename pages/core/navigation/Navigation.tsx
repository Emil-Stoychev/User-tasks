import Link from "next/link";
import { useRouter } from "next/router";
import { ProfileInterface } from "../../../lib/types/profileInterface";

export default function Navigation(props: {
  user: ProfileInterface;
  setUser: Function;
}) {
  const route = useRouter();

  const logout = () => {
    props.setUser(null);
    localStorage.removeItem("sessionStorage");

    route.push("/login");
  };

  return (
    <>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" href="/">
                Home
              </Link>
            </li>

            {props.user?.username ? (
              <>
                <li>
                  <Link className="nav-link" href="/create">
                    Create
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" href="/profile">
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>

          <ul className="nav navbar-nav navbar-right">
            {!props.user?.username ? (
              <>
                <li>
                  <Link className="nav-link" href="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" href="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="nav-link" href="/" onClick={() => logout()}>
                    Leave
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
