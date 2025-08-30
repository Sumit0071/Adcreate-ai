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
import { useState } from "react";

export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState( false );

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Dashboard", link: "/dashboard" },
        { name: "Profile", link: "/profile" },
    ];

    return (
        <div className="min-h-screen">
            {/* Navbar (Desktop + Mobile) */}
            <Navbar>
                {/* Desktop Navbar */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <NavbarButton variant="primary">Sign Out</NavbarButton>
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
                                className="text-sm text-neutral-600 dark:text-neutral-200"
                                onClick={() => setIsOpen( false )}
                            >
                                {item.name}
                            </a>
                        ) )}
                        <NavbarButton className="mt-4 w-full" variant="dark">
                            Sign Out
                        </NavbarButton>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

            {/* Dashboard content */}

        </div>
    );
}
