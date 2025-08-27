import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="bg-emerald-500 bg-center bg-cover h-screen flex items-center justify-center z-0">
      <div className="bg-[url('/bg-reg-log.jpg')] bg-cover bg-no-repeat h-screen w-full opacity-80">
        <div className="flex items-center justify-center h-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;