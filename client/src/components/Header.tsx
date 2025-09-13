import { Link } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const ctx = useContext(UserContext);
  const user = ctx?.user;
  const username = user?.username;
  const avatar = user?.avatar as string | undefined | null;

  const initial = (username?.charAt(0) || 'U').toUpperCase();

  const Logout = () => {
    ctx?.LogOut();
  }

  const AvatarBadge = () => (
    <Link to="/profile" className="relative group inline-block w-10 h-10">
      {avatar ? (
        <img
          src={avatar}
          alt="Perfil"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow cursor-pointer transition group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold ring-2 ring-white shadow cursor-pointer transition group-hover:scale-105 select-none">
          {initial}
        </div>
      )}
      <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">Perfil</span>
    </Link>
  );

  return (
    <header className="bg-emerald-400 w-full p-4">
      <nav>
        <ul>
          <div className="flex justify-between items-center text-gray-100 px-12">
            <li className="hover:scale-115 transition-transform duration-200">
              <Link to="/">
                <h1 className="text-3xl font-bold">
                  <span className="text-red-700 font-extrabold text-4xl">/</span>
                  <span className="text-xl ml-2">Mini</span>
                  <span className="ml-2 text-4xl text-red-600 italic">X</span>
                </h1>
              </Link>
            </li>
            <section className="flex items-center gap-5">
              {user ? (
                <>
                  <li className="flex items-center gap-3">
                    <AvatarBadge />
                    <button onClick={Logout} className="hover:text-red-600 ">Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-red-600">
                    <Link to="/login">Login</Link>
                  </li>
                  <span>/</span>
                  <li className="hover:text-red-600">
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </section>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header;