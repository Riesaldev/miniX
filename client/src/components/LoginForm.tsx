//import necessary modules and components
import { useState } from "react";
import { toast } from "react-hot-toast";
// import { Navigate } from "react-router-dom"; // ya no se utiliza la redirección inmediata
import { useContext } from "react";
import { UserContext } from "../context/UserContext.tsx";
import { useNavigate } from "react-router-dom";

// Access environment variables
const { VITE_API_URL } = import.meta.env;


// Define the form input types
type FormInputs = {
  emailOrUsername: string; // el placeholder indica que puede ser email o username; backend espera email actualmente
  password: string;
  remember: boolean;
};

// Define the LoginForm component
const LoginForm = () => {
  const navigate = useNavigate();

  // Define state variables
  const [isLoading, setIsLoading] = useState(false);

  // Access user context
  const userContext = useContext(UserContext);
  const loginFn = userContext?.login; // función para guardar token

  // Define state for form inputs
  const [formImputs, setFormImputs] = useState<FormInputs>({
    emailOrUsername: "",
    password: "",
    remember: false
  });



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Set loading state to true
    setIsLoading(true);

    //try to connect to the login endpoint
    try {
      const res = await fetch(`${VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // Backend actual espera email y password; si el usuario escribe algo sin @ podríamos decidir no permitir.
        body: JSON.stringify({
          email: formImputs.emailOrUsername.trim(),
          password: formImputs.password
        })
      });
      const contentType = res.headers.get('content-type') || '';
      let body: unknown;
      if (contentType.includes('application/json')) {
        body = await res.json();
      } else {
        const raw = await res.text();
        throw new Error(`Respuesta no JSON (${res.status}): ${raw.slice(0, 120)}`);
      }

      //if the response is not ok, throw an error
      if (!res.ok) {
        let msg = 'Login failed';
        if (typeof body === 'object' && body && 'message' in body) {
          const maybeMsg = (body as { message?: unknown }).message;
          if (typeof maybeMsg === 'string') msg = maybeMsg;
        }
        throw new Error(msg);
      }

      // If login is successful, update user context and show success toast
      if (loginFn) {
        // Intentar extraer token de forma segura
        const maybeObj = body as { data?: { token?: string } };
        const token = maybeObj?.data?.token;
        if (!token) throw new Error('Token no presente en la respuesta');
        if (import.meta.env.DEV) console.log('[LoginForm] token recibido', token);
        loginFn(token);
        toast.success(`Bienvenido de nuevo`, { duration: 3000 });
      }
      // Reset form fields
      setFormImputs({
        emailOrUsername: "",
        password: "",
        remember: false
      });
      // Redirección controlada externamente (el componente padre puede hacerla al detectar userContext actualizado)

      navigate("/profile", { replace: true });
      // Evitamos devolver un <Navigate/> dentro de handleSubmit.

      //if not, show an error toast
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      toast.error(errorMessage, { id: "login-error" });

      //finally, set loading state to false
    } finally {
      setIsLoading(false);

    }
  };

  //
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
          id="email"
          type="text"
          className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
          placeholder="Username or Email"
          autoComplete="username"
          value={formImputs.emailOrUsername}
          onChange={(e) => setFormImputs({ ...formImputs, emailOrUsername: e.target.value })}
          required
          autoFocus
        />

        <label className="sr-only" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-8"
          placeholder="Password"
          autoComplete="current-password"
          value={formImputs.password}
          onChange={(e) => setFormImputs({ ...formImputs, password: e.target.value })}
          required
        />

        <div className="flex justify-between text-sm text-emerald-100 mb-5 w-2/3 mx-auto">
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
          onClick={() => setFormImputs({ ...formImputs, remember: !formImputs.remember })}
          disabled={isLoading}
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