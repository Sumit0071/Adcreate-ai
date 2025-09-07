import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeClosed } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, registerUser } from '@/app/api/user';

const SignUp: React.FC<{ switchToLogin: () => void }> = ({ switchToLogin }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const userData = {
      username: (form.username as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      password: (form.password as HTMLInputElement).value,
      // Avatar: optional
    };

    try {
      setLoading(true);
      const res = await registerUser(userData);
      toast.success('User registered successfully!');
      console.log('Registered user:', res);

      form.reset(); // reset the form
      // optionally redirect user here
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-blurred-100">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isVisible ? 'text' : 'password'}
                    placeholder="********"
                    className="w-full border p-2 pr-10 rounded mt-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
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
              className="w-full bg-blue-500 text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-500 hover:underline"
            >
              Login
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="/terms-conditions" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>.
          </div>

          <div className="mt-6">
            <div className="text-center text-sm text-gray-500 mb-2">Or sign up with</div>
            <div className="flex justify-center gap-2">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const tokenId = credentialResponse.credential;
                    if (!tokenId) {
                      toast.error('Google login failed');
                      return;
                    }

                    const res = await googleLogin(tokenId);
                    toast.success('Google login successful!');
                    console.log('Google user:', res);

                    window.location.href = '/dashboard';
                  } catch (err) {
                    console.error('Google login error:', err);
                    toast.error('Google login failed');
                  }
                }}
                onError={() => toast.error('Google login failed')}
              />
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300">
                Facebook
              </Button>
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

export default SignUp;
