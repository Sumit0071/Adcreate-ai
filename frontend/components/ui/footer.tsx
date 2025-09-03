import React from "react";

export const Footer: React.FunctionComponent = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Logo + Company */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="text-indigo-400"
                        >
                            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
                        </svg>
                        <h2 className="text-lg font-semibold text-white">
                            AdCreati ai Pvt Ltd
                        </h2>
                    </div>
                    <p className="text-sm">
                        Providing reliable tech since 1992.
                        We bring innovation, speed, and reliability to your business.
                    </p>
                </div>

                {/* Services */}
                <div>
                    <h6 className="text-white font-semibold mb-3">Services</h6>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Branding</a></li>
                        <li><a href="#" className="hover:text-white">Design</a></li>
                        <li><a href="#" className="hover:text-white">Marketing</a></li>
                        <li><a href="#" className="hover:text-white">Advertisement</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h6 className="text-white font-semibold mb-3">Company</h6>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">About us</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                        <li><a href="#" className="hover:text-white">Jobs</a></li>
                        <li><a href="#" className="hover:text-white">Press kit</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h6 className="text-white font-semibold mb-3">Newsletter</h6>
                    <form className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
                © {new Date().getFullYear()} Adcreate ai. All rights reserved.
            </div>
        </footer>
    );
};
