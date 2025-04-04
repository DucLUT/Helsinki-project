import { useState } from "react";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br
        from-red-200 to-pink-400 p-4
    "
    >
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8">
          {isLogin ? "Welcome Back!" : "Create new account"}
        </h2>

        <div className="bg-white shadow-xl rounded-lg p-8">
          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "New to Dertin" : "Already have an account?"}
            </p>

            <button
              onClick={() =>
                setIsLogin((prevIsLogin) => {
                  console.log("prevIsLogin", prevIsLogin);
                  console.log("isLogin", !prevIsLogin);
                  return !prevIsLogin;
                })
              }
              className="mt-2 text-red-300 hover:text-red-900 font-medium transition-colors duration-200 !bg-transparent border-none p-0"
            >
              {isLogin ? "Create a new account" : "Sign in to your account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
