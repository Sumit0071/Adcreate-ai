"use client";

import { useState } from "react";
import SignupModal from "./SignupModal";
import Login from "./Login";
import SignUp from "./SignUp";
import { motion } from "framer-motion";

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <SignupModal onClose={onClose}>
      <div className="w-full">

        {/* Tabs */}
        <div className="relative flex mb-6 border-b">
          <button
            onClick={() => setMode("login")}
            className="flex-1 py-2 font-medium text-center"
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className="flex-1 py-2 font-medium text-center"
          >
            Sign Up
          </button>

          <motion.div
            layout
            className="absolute bottom-0 h-[2px] bg-blue-600"
            style={{
              width: "50%",
              left: mode === "login" ? "0%" : "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {mode === "login" ? (
          <Login switchToSignUp={() => setMode("signup")} />
        ) : (
          <SignUp switchToLogin={() => setMode("login")} />
        )}
      </div>
    </SignupModal>
  );
};

export default AuthModal;