import React from "react";

export const Footer: React.FunctionComponent = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Logo + Company */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="logo.png" className="h-15 w-25" />
                        <h2 className="text-lg font-semibold text-white">
                            AdCreati ai Pvt Ltd
                        </h2>
                    </div>
                    <p className="text-sm">
                        Making the manual adcreation one step ahead
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
