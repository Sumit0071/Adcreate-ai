"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";
import { loginUser, googleLogin } from "@/app/api/user";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ switchToSignUp }: { switchToSignUp: () => void }) => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      await loginUser(credentials);
      toast.success("Login successful");

      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-bold">Welcome Back</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3
bg-white text-gray-900 border-gray-300
dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
placeholder-gray-400 dark:placeholder-gray-500
focus:outline-none focus:ring-2 focus:ring-indigo-500
transition-colors"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />

        <div className="relative">

          <input
            type={visible ? "text" : "password"}
            placeholder="Password"
            className="w-full border rounded-lg p-3
bg-white text-gray-900 border-gray-300
dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
placeholder-gray-400 dark:placeholder-gray-500
focus:outline-none focus:ring-2 focus:ring-indigo-500
transition-colors pr-10"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />

          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>

        </div>

        <Button className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>

      </form>

      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <button
          onClick={switchToSignUp}
          className="text-blue-600"
        >
          Sign Up
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t"></div>
        <span className="text-xs text-gray-500">OR</span>
        <div className="flex-1 border-t"></div>
      </div>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (res) => {
            const token = res.credential;

            if (!token) {
              toast.error("Google login failed");
              return;
            }

            await googleLogin(token);
            window.location.href = "/dashboard";
          }}
        />
      </div>

    </div>
  );
};

export default Login;