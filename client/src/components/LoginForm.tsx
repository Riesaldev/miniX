import { useState } from "react";

const LoginForm = () => {

  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement login logic
    } catch (err) {
      console.error("Login failed", err);

    }


    return (
      <>
        <form
          className="bg-emerald-500/60 backdrop-blur-md p-8 rounded-4xl text-center w-3/4 md:w-1/2 lg:w-1/3 z-10 relative -top-44"
          onSubmit={handleSubmit}
          aria-live="polite"
        >
          <h1 className="text-4xl font-bold text-emerald-500 mb-4">Login</h1>
          <p className="mt-4 text-lg text-emerald-100 mb-5">Welcome back! Please log in to your account.</p>

          <label className="sr-only" htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
            placeholder="Username or Email"
            autoComplete="username"
            required
          />

          <label className="sr-only" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-8"
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <div className="flex justify-between text-sm text-emerald-100 mb-5 mx-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="underline hover:text-red-400 mr-4">Forgot password?</a>
          </div>
          <p className="text-sm text-emerald-100">If you don't have an account, you can <a href="/register" className="underline hover:text-red-400">register here</a>.</p>

          <button
            type="submit"
            className="bg-emerald-500 text-emerald-800 py-2 px-4 rounded-lg hover:bg-emerald-700 hover:text-white cursor-pointer mt-8 disabled:opacity-50"
          >
            {isLoading ? "Iniciando sesión..." : "Login"}
          </button>
        </form>

      </>
    );
  };

  export default LoginForm;