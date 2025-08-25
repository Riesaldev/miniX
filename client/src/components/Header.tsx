//import useAuthContext from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header = () => {

  //const { authUser, setAuthUser } = useAuthContext();
  return (
    <header className="bg-emerald-400 w-full h-2/60 p-4">
      {/*{authUser && <p>Hello, {authUser.name}!</p>}*/}

      <nav>
        <ul>
          {/*{authUser ? (
            <>
              <li>
                <Link to="/users/profile">My Profile</Link>
              </li>
              <li>
                <Link to="/msg/new">New Message</Link>
              </li>
              <li>
                <button onClick={authLogout}>Logout</button>
              </li>
            </>
          ) : (*/}
          <div className="flex justify-around text-xl font-bold text-gray-100">
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </div>

        </ul>
      </nav>
    </header>
  );
}

export default Header;