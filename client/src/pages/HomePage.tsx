/**
 * HomePage
 * Qué: Landing pública que introduce la aplicación y CTA hacia registro.
 * Cómo: Presenta layout con fondo e información básica + enlace a /register.
 * Por qué: Primer punto de contacto que explica propósito antes de pedir credenciales.
 */
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-auto h-screen justify-center items-center bg-[url('/bg-home.jpg')] bg-center bg-cover">
      <div className="bg-black/60 h-full rounded-lg text-emerald-500 flex flex-col items-center justify-start pt-22">
        <h1 className="py-8 font-black text-2xl flex items-center" aria-label="Bienvenido a MiniX">
          Welcome to
          <span className="text-xl ml-2 underline decoration-4 decoration-red-700">Mini</span>
          <span className="ml-2 text-5xl text-red-600 italic">X</span>
        </h1>
        <p className="py-8 font-medium text-xl text-center max-w-xl">
          Your new form to connect and share with others easily and effectively!
        </p>
        <p className="font-medium text-base w-1/3 justify-center text-center max-w-xl">
          This is a simple social media app where you can create an account, login, and share messages with other users.
        </p>
        <div className="w-full h-full flex justify-center mt-18">
          <Link
            to="/register"
            className="border border-emerald-500 rounded-lg px-4 py-2 m-2 hover:bg-emerald-500 hover:text-white transition duration-300 h-10 flex items-center font-bold"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;