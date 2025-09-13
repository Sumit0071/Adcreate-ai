
import { X } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const SignupModal = ( {
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
} ) => {
  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="relative dark:bg-gray-900 rounded-xl shadow-xl p-4 w-[90%] max-w-md max-h-[90vh] overflow-y-auto bg-cover bg-center"
        style={{ backgroundImage: "url('/Auth.png')" }}>
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          size="icon"
          variant="ghost"
        >
          <X />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default SignupModal;
