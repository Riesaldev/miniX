/**
 * Formulario de Login.
 * Qué: permite autenticar al usuario mediante email o username + contraseña.
 * Cómo: hace POST al endpoint /api/users/login y almacena token vía UserContext.
 * Por qué: establecer sesión para acceder a funcionalidades protegidas.
 */
import { useState, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { UserContext } from '../context/UserContext.tsx';
import { useNavigate } from 'react-router-dom';

// Variables de entorno necesarias para endpoint base.
const { VITE_API_URL } = import.meta.env;


// Tipado de los inputs del formulario.
type FormInputs = {
  emailOrUsername: string; // Puede ser email o username; backend actual interpreta email si contiene '@'.
  password: string;
  remember: boolean; // Futuro: persistencia custom (ahora se usa cookie/localStorage siempre).
};

const LoginForm = () => {
  const navigate = useNavigate();

  // Estado de carga para evitar envíos múltiples.
  const [isLoading, setIsLoading] = useState(false);

  // Contexto de usuario (gestiona token y perfil).
  const userContext = useContext(UserContext);
  const loginFn = userContext?.login; // Setter de token en contexto.

  // Estado controlado del formulario.
  const [formImputs, setFormImputs] = useState<FormInputs>({
    emailOrUsername: "",
    password: "",
    remember: false
  });



  // Envío del formulario (async/await + robustez en parseo de respuesta).
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${VITE_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formImputs.emailOrUsername.trim(), // backend decide si es email/username.
          password: formImputs.password
        })
      });
      // Parseo robusto de respuesta (JSON esperado).
      // Si no es JSON o hay error HTTP, lanzamos con mensaje adecuado.
      // Esto evita fallos silenciosos o errores de parseo inesperados.
      // El manejo de errores se centraliza en el catch.
      const contentType = res.headers.get('content-type') || '';
      let body: unknown;
      if (contentType.includes('application/json')) {
        body = await res.json();
      } else {
        const raw = await res.text();
        throw new Error(`Respuesta no JSON (${res.status}): ${raw.slice(0, 120)}`);
      }
      // Manejo de errores HTTP (4xx, 5xx) con mensaje del body si existe.
      // Si la API cambia el formato de error, esto puede necesitar ajustes.
      // Se asume que body es un objeto con posible campo 'message'.
      if (!res.ok) {
        let msg = 'Login failed';
        if (typeof body === 'object' && body && 'message' in body) {
          const maybeMsg = (body as { message?: unknown }).message;
          if (typeof maybeMsg === 'string') msg = maybeMsg;
        }
        throw new Error(msg);
      }
      // Éxito: extraer token y actualizar contexto.
      if (loginFn) {
        const maybeObj = body as { data?: { token?: string } };
        const token = maybeObj?.data?.token;
        if (!token) throw new Error('Token no presente en la respuesta');
        if (import.meta.env.DEV) console.log('[LoginForm] token recibido', token);
        loginFn(token);
        toast.success('Bienvenido de nuevo', { duration: 3000 });
      }
      // Limpiar formulario y redirigir a perfil.
      setFormImputs({ emailOrUsername: '', password: '', remember: false });
      navigate('/profile', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage, { id: 'login-error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado del formulario con accesibilidad básica y estados.
  // No se usa librería de formularios para mantener simple y didáctico.
  // Se podría mejorar con validaciones más avanzadas (email válido, fuerza password, etc).
  // También se podría separar en componentes más pequeños si crece en complejidad.
  // El diseño es básico y se puede mejorar con CSS/Frameworks según necesidades.
  return (
    <>
      <form
        className="bg-emerald-500/30 backdrop-blur-md p-8 rounded-4xl text-center w-3/4 md:w-1/2 lg:w-1/3 z-10 relative -top-44"
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
          {isLoading ? 'Iniciando sesión...' : 'Login'}
        </button>
      </form>

    </>
  );
};

export default LoginForm;