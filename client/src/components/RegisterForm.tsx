// Import necessary modules and components
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import { toast } from "react-hot-toast";

// Access environment variables
const { VITE_API_URL } = import.meta.env;

// Define the RegisterForm component
const RegisterForm = () => {

  // Access user context
  const userContext = useContext(UserContext);
  // Get the current user from context
  const user = userContext?.user;

  // Initialize navigation
  const navigate = useNavigate();

  // Define state variables for form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission behavior
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      // Set loading state to true
      setLoading(true);
      // Make a POST request to the registration endpoint
      const res = await fetch(`${VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      // Parse the JSON response
      const body = await res.json();
      // Handle non-OK responses throw an error
      if (!res.ok) {
        throw new Error(body.message || "Registration failed");
      }
      // Show success toast and navigate to login page
      toast.success(body.message, {
        id: "register-success",
        duration: 10000,
      });
      //and reset form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Redirect to login page
      navigate("/login");

    } catch (err) {
      // Show error toast with the error message
      let errorMessage = "An unexpected error occurred";
      // Check if the error is an instance of Error to get the message
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Display the error message using toast
      toast.error(errorMessage, {
        id: "register-fail"
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
    navigate("/");
  }
  // Render the registration form
  return (
    <form className="bg-emerald-500/60 backdrop-blur-md p-8 rounded-4xl text-center w-3/4 md:w-1/2 lg:w-1/3 z-10 relative -top-44 " onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-emerald-500 mb-4">Create Account</h1>
      <p className="mt-4 text-lg text-emerald-100 mb-5">Welcome to the Register page!</p>

      <input
        type="text"
        name="username"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Username"
        autoComplete="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        name="email"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Email"
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        name="password"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Password"
        autoComplete="new-password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        name="confirmPassword"
        className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4"
        placeholder="Confirm Password"
        autoComplete="new-password"
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        className="bg-emerald-500 text-emerald-800 py-2 px-4 rounded-lg hover:bg-emerald-700 hover:text-white cursor-pointer mt-8"
      >
        Register
      </button>
    </form>
  );
}

export default RegisterForm;