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
          <div className="flex justify-between text-gray-100 place-items-baseline px-12">
            <li className="hover:scale-115 transition-transform duration-200">
              <Link to="/">
                <h1 className="text-3xl font-bold">
                  <span className="text-red-700 font-extrabold text-4xl">/</span>
                  <span className="text-xl ml-2">Mini</span>
                  <span className="ml-2 text-4xl text-red-600 italic">X</span>
                </h1>
              </Link>
            </li>
            <section className="flex items-end gap-4">
              <li className="hover:text-red-600">
                <Link to="/login">Login</Link>
              </li>
              <span>/</span>
              <li className="hover:text-red-600">
                <Link to="/register">Register</Link>
              </li>
            </section>
          </div>

        </ul>
      </nav>
    </header>
  );
}

export default Header;