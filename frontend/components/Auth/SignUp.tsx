"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "@/app/api/user";

const SignUp = ({ switchToLogin }: { switchToLogin: () => void }) => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      await registerUser(user);

      toast.success("Account created");

      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-5">

      <h2 className="text-2xl font-bold">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg p-3
bg-white text-gray-900 border-gray-300
dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
placeholder-gray-400 dark:placeholder-gray-500
focus:outline-none focus:ring-2 focus:ring-indigo-500
transition-colors"
          onChange={(e) =>
            setUser({ ...user, username: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3
bg-white text-gray-900 border-gray-300
dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
placeholder-gray-400 dark:placeholder-gray-500
focus:outline-none focus:ring-2 focus:ring-indigo-500
transition-colors"
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
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
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            required
          />

          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-3"
          >
            {visible ? <EyeClosed size={18} /> : <Eye size={18} />}
          </button>

        </div>

        <Button className="w-full">
          {loading ? "Creating..." : "Create Account"}
        </Button>

      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-blue-600"
        >
          Login
        </button>
      </div>

    </div>
  );
};

export default SignUp;