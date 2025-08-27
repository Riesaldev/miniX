

const RegisterForm = () => {
  return (
    <form className="bg-emerald-500/60 backdrop-blur-md p-8 rounded-4xl text-center w-3/4 md:w-1/2 lg:w-1/3 z-10 relative -top-44 ">
      <h1 className="text-4xl font-bold text-emerald-500 mb-4">Create Account</h1>
      <p className="mt-4 text-lg text-emerald-100 mb-5">Welcome to the Register page!</p>

      <input type="text" className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4" placeholder="Username" />

      <input type="email" className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4" placeholder="Email" />

      <input type="password" className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4" placeholder="Password" />

      <input type="text" className="border text-emerald-50 border-emerald-300 p-2 rounded-lg w-2/3 mb-4" placeholder="Confirm Password" />

      <p className="text-sm text-emerald-100 mb-5 relative right-18">
        I agree to the <a href="/terms" className="underline hover:text-red-400 left-11">

          terms and conditions
        </a>
      </p>

      <p className="text-sm text-emerald-100 relative right-6">If you already have an account, you can <a href="/login" className="underline hover:text-red-400">login here</a>.</p>

      <button type="submit" className="bg-emerald-500 text-emerald-800 py-2 px-4 rounded-lg hover:bg-emerald-700 hover:text-white cursor-pointer mt-8">
        Register
      </button>
    </form>
  );
}

export default RegisterForm;