"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SignupModal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">

      <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl p-4 transition-colors w-full max-w-4xl overflow-hidden">

        {/* Close */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-10"
        >
          <X />
        </Button>

        <div className="grid md:grid-cols-2 min-h-[520px]">

          {/* Left Image */}
          <div className="relative hidden md:block">
            <Image
              src="/Auth.png"
              alt="Auth"
              fill
              className="object-cover"
            />

            
          </div>

          {/* Form */}
          <div className="p-8 flex flex-col justify-center">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupModal;