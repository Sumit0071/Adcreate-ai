import { useState } from "react";
import SignupModal from "./SignupModal";
import SignUp from "./SignUp";
import Login from "./Login";

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <SignupModal onClose={onClose}>
      {isLogin ? (
        <Login switchToSignUp={() => setIsLogin(false)} />
      ) : (
        <SignUp switchToLogin={() => setIsLogin(true)} />
      )}
    </SignupModal>
  );
};

export default AuthModal;
