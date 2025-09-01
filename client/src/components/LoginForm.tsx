import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

const LS_USER_KEY = "rememberedUser";
const LS_REM_KEY = "rememberMe";
const LS_TOKEN_KEY = "authToken";

interface LoginResponse {
  token?: string;
  message?: string;
}

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cargar preferencia/usuario al montar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem(LS_USER_KEY);
    const savedRemember = localStorage.getItem(LS_REM_KEY);
    if (savedUser) setUsername(savedUser);
    if (savedRemember === "true") setRemember(true);
  }, []);

  // Sincronizar localStorage cuando cambien remember o username
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (remember && username.trim() !== "") {
      localStorage.setItem(LS_USER_KEY, username);
      localStorage.setItem(LS_REM_KEY, "true");
    } else {
      localStorage.removeItem(LS_USER_KEY);
      localStorage.removeItem(LS_REM_KEY);
    }
  }, [remember, username]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Introduce usuario y contraseña");
      return;
    }

    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => controller.abort(), 5000);

      const res: Response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let serverMsg = "";
        try {
          const json = (await res.json()) as LoginResponse;
          serverMsg = json?.message ? `: ${json.message}` : "";
        } catch (parseErr) {
          console.error("JSON parse error:", parseErr);
        }

        if (res.status === 404) {
          toast.error("Usuario no existe" + serverMsg);
        } else if (res.status === 401) {
          toast.error("Credenciales incorrectas" + serverMsg);
        } else {
          toast.error("Error en el servidor" + serverMsg);
        }
        return;
      }

      const data = (await res.json()) as LoginResponse;
      if (data?.token) {
        // Preferible: usar cookie HttpOnly en el servidor. Sólo guardar si es necesario.
        localStorage.setItem(LS_TOKEN_KEY, data.token);
      }
      toast.success("Inicio de sesión correcto");
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof DOMException && err.name === "AbortError") {
        toast.error("La petición ha tardado demasiado y fue abortada");
      } else {
        toast.error("No hay conexión con el servidor");
      }
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="sr-only" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-8"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between text-sm text-emerald-100 mb-5 mx-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="underline hover:text-red-400 mr-4">Forgot password?</a>
        </div>
        <p className="text-sm text-emerald-100">If you don't have an account, you can <a href="/register" className="underline hover:text-red-400">register here</a>.</p>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="bg-emerald-500 text-emerald-800 py-2 px-4 rounded-lg hover:bg-emerald-700 hover:text-white cursor-pointer mt-8 disabled:opacity-50"
        >
          {isLoading ? "Iniciando sesión..." : "Login"}
        </button>
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default LoginForm;