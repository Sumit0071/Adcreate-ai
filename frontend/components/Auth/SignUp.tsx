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
import Image from "next/image";
const SignUp: React.FC<{ switchToLogin: () => void }> = ( { switchToLogin } ) => {
    const [isVisible, setIsVisible] = useState( false );

    const handleSubmit = ( e: React.FormEvent ) => {
        e.preventDefault();
        toast( 'Form submitted!' );
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
                                        type={isVisible ? "text" : "password"}
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

                        <Button type="submit" className="w-full bg-blue-500 text-white">
                            Create Account
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
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" className="bg-white text-gray-800 border-gray-300" onClick={() => { window.location.href = "http://localhost:5000/api/v1/auth/google" }}>
                                <Image src="/google.png" alt="Google" width={20} height={20} />
                                Google
                            </Button>
                            <Button variant="outline" className="bg-white text-gray-800 border-gray-300">
                                Facebook
                            </Button>
                            <Button variant="outline" className="bg-white text-gray-800 border-gray-300">
                                Twitter
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
