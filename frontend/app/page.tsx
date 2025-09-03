"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { Footer } from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { getUserProfile } from "./api/user";
import AuthModal from "@/components/Auth/AuthModal";


export default function Home() {
  const [isOpen, setIsOpen] = useState( false );
  const [showAuth, setShowAuth] = useState( false );
  const [user, setUser] = useState<any>( null );

  useEffect( () => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser( userData );
      } catch ( error ) {
        console.error( "Error fetching user profile:", error );
      }
    };
    fetchUserProfile();
  }, [] );

  console.log( "User", user );

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Profile", link: "/profile" },
    { name: "About", link: "/about" },
  ];

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          {!user ? (
            <NavbarButton variant="dark" onClick={() => setShowAuth( true )}>
              Sign Up
            </NavbarButton>
          ) : (
            <div className="flex items-center cursor-pointer">
              <img
                src={user?.user.Avatar || "/default-avatar.png"}
                alt={user?.user.username || "User"}
                className="w-10 h-10 rounded-full border cursor-pointer"
              />
            </div>
          )}
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen( !isOpen )}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen( false )}>
            {navItems.map( ( item, idx ) => (
              <a
                key={idx}
                href={item.link}
                className="block text-base font-medium text-neutral-700 dark:text-neutral-200 py-2"
                onClick={() => setIsOpen( false )}
              >
                {item.name}
              </a>
            ) )}
            {!user ? (
              <NavbarButton
                className="mt-4 w-full"
                variant="dark"
                onClick={() => setShowAuth( true )}
              >
                Sign Up / Login
              </NavbarButton>
            ) : (
              <NavbarButton className="mt-4 w-full" variant="dark">
                Sign Out
              </NavbarButton>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth( false )} />}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Explore a seamless experience with our responsive navbar and
          beautifully designed homepage sections.
        </p>
        <NavbarButton variant="dark" className="px-6 py-3 text-lg">
          Get Started
        </NavbarButton>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-2xl shadow-lg border bg-white">
          <h2 className="text-xl font-semibold mb-4">⚡ Fast</h2>
          <p className="text-gray-600">
            Our platform is optimized for speed and smooth user experience.
          </p>
        </div>
        <div className="p-6 rounded-2xl shadow-lg border bg-white">
          <h2 className="text-xl font-semibold mb-4">📱 Responsive</h2>
          <p className="text-gray-600">
            Enjoy a fully responsive design across devices, tested with this
            navbar.
          </p>
        </div>
        <div className="p-6 rounded-2xl shadow-lg border bg-white">
          <h2 className="text-xl font-semibold mb-4">🔒 Secure</h2>
          <p className="text-gray-600">
            Built with modern security standards to keep your data safe.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 italic">
              "This navbar looks amazing when resizing the screen!"
            </p>
            <h3 className="mt-4 font-semibold">— Alex</h3>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 italic">
              "Clean, modern, and works perfectly on mobile devices."
            </p>
            <h3 className="mt-4 font-semibold">— Priya</h3>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 italic">
              "I love how smooth the toggle menu feels on mobile!"
            </p>
            <h3 className="mt-4 font-semibold">— John</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
