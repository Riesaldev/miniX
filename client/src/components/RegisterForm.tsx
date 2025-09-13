// Import necessary modules and components
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";

// Access environment variables
const { VITE_API_URL } = import.meta.env;
// Define the RegisterForm component
const RegisterForm = () => {
  // Initialize navigation hook
  const navigate = useNavigate();
  // Access user context
  const userContext = useContext(UserContext);
  // Get the current user from context
  const user = userContext?.user;

  // Define state variables for form fields
  const [formInputs, setFormInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission behavior
    try {
      e.preventDefault();
      if (formInputs.password !== formInputs.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      // Set loading state to true
      setLoading(true);
      // Make a POST request to the registration endpoint
      // Enviar los campos planos (el backend espera username, email, password en el root del body)
      const res = await fetch(`${VITE_API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formInputs.username.trim(),
          email: formInputs.email.trim(),
          password: formInputs.password
        }),
      });
      // Verificar content-type antes de parsear
      const contentType = res.headers.get('content-type') || '';
      type RegisterResponse = {
        message: string;
        [key: string]: unknown;
      };
      let body: RegisterResponse;
      if (contentType.includes('application/json')) {
        body = await res.json() as RegisterResponse;
      } else {
        const rawText = await res.text();
        throw new Error(`Respuesta no JSON (${res.status}): ${rawText.slice(0, 120)}`);
      }
      // Handle non-OK responses throw an error
      if (!res.ok) {
        throw new Error(body.message);
      }
      // Show success toast and navigate to login page
      toast.success(body.message, {
        id: "register",
      });
      navigate("/login");
    } catch (err) {
      // Display the error message using toast
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(errorMessage, {
        id: "register"
      });
      // Log the error to the console for debugging
      console.error("Registration error:", err);
      // Finally, set loading state to false
    } finally {

      setLoading(false);
    }
  }

  // If the user is already logged in, navigate to the home page
  if (user) {
    return <Navigate to="/" />;
  }
  // Render the registration form
  return (
    <form className="bg-emerald-500/30 backdrop-blur-md p-8 rounded-4xl text-center w-3/4 md:w-1/2 lg:w-1/3 z-10 relative -top-44 " onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-emerald-500 mb-4">Create Account</h1>
      <p className="mt-4 text-lg text-emerald-100 mb-5">Welcome to the Register page!</p>

      <input
        type="text"
        name="username"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Username"
        autoComplete="username"
        required
        minLength={3}
        maxLength={30}
        onChange={(e) => setFormInputs({ ...formInputs, username: e.target.value })}
      />

      <input
        type="email"
        name="email"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Email"
        autoComplete="email"
        required
        onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
      />

      <input
        type="password"
        name="password"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Password"
        autoComplete="new-password"
        required
        minLength={6}
        onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })}
      />

      <input
        type="password"
        name="confirmPassword"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Confirm Password"
        autoComplete="new-password"
        required
        minLength={6}
        onChange={(e) => setFormInputs({ ...formInputs, confirmPassword: e.target.value })}
      />

      <p
        className="text-sm text-emerald-100 mb-5 relative right-18"
      >
        I agree to the <a
          href="/terms"
          className="underline hover:text-red-400 left-11"
        >
          terms and conditions
        </a>
      </p>

      <p
        className="text-sm text-emerald-100 relative right-6"
      >If you already have an account, you can <a
        href="/login" className="underline hover:text-red-400"
      > login here</a>
        .
      </p>

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 text-emerald-900 font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 hover:text-white cursor-pointer mt-8"
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;