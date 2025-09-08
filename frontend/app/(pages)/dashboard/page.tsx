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
import { useState ,useEffect} from "react";
import { Building2, Tags, Package, Users, Target } from "lucide-react";
import { getUserProfile } from "@/app/api/user";
import {BusinessProfileCard} from "@/components/businessProfileCard";
export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>( null );
  const [showAuth, setShowAuth] = useState( false );

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

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Profile", link: "/profile" },
  ];

  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    productService: "",
    targetAudience: "",
    adGoal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/business-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Business Profile created successfully!");
        setFormData({
          businessName: "",
          niche: "",
          productService: "",
          targetAudience: "",
          adGoal: "",
        });
      } else {
        alert("❌ Error creating profile.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <div className="min-h-[700px] bg-gradient-to-br from-gray-100 via-white to-gray-100 ">
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

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="text-sm text-neutral-600 dark:text-neutral-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton className="mt-4 w-full" variant="dark">
              Sign Out
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Dashboard Content */}
      <BusinessProfileCard/>
    </div>
  );
}
