"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import { loginUser } from "@/app/api/user";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@/app/api/user";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
const Login: React.FC<{ switchToSignUp: () => void }> = ( { switchToSignUp } ) => {
  const [isVisible, setIsVisible] = useState( false );
  const [loading, setLoading] = useState( false );
  const [credentials, setCredentials] = useState( {
    email: "",
    password: "",
  } );

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setCredentials( { ...credentials, [e.target.id]: e.target.value } );
  };

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();
    setLoading( true );

    try {
      const res = await loginUser( credentials ); // calls backend /login
      toast.success( "Login successful!" );
      console.log( "User logged in:", res );

      // optional: redirect to dashboard
      window.location.href = "/dashboard";
    } catch ( err: any ) {
      console.error( "Login failed", err );
      toast.error( err.response?.data?.message || "Invalid credentials" );
    } finally {
      setLoading( false );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-blurred-100">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Access your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full border p-2 pr-10 rounded mt-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible( !isVisible )}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 cursor-pointer"
                    tabIndex={-1}
                  >
                    {isVisible ? <EyeClosed size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={switchToSignUp}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-2">
              Or login with
            </div>
            <div className="flex justify-center gap-3">
              <GoogleLogin size="medium"
                onSuccess={async ( credentialResponse ) => {
                  try {
                    const tokenId = credentialResponse.credential;
                    if ( !tokenId ) {
                      toast.error( "Google login failed" );
                      return;
                    }

                    const res = await googleLogin( tokenId );
                    toast.success( "Google login successful!" );
                    console.log( "Google user:", res );

                    window.location.href = "/dashboard"; // redirect after login
                  } catch ( err ) {
                    console.error( "Google login error:", err );
                    toast.error( "Google login failed" );
                  }
                }}
                onError={() => toast.error( "Google login failed" )}
              />
           
           
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;
