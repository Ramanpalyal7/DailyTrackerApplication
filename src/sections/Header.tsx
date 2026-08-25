"use client";

import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import { motion } from "motion/react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const visitorId = localStorage.getItem("lapwork_visitor_id") || "anonymous";
    window.location.href = `/api/download?platform=windows&visitorId=${visitorId}`;
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      <div className="flex justify-center items-center py-3 bg-[#1A3871] text-white text-sm gap-3">
        <p className="text-white/90 hidden md:block">
          Streamline your workflow and boost your productivity{" "}
        </p>
      </div>
      <div className="py-3">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image 
              src={Logo} 
              alt="Saas Logo" 
              height={50} 
              width={50} 
              style={{
                width: "auto", 
                height: "auto"
              }}
            />

            {/* Menu Icon */}
            <MenuIcon 
              onClick={toggleMenu}
              className="h-5 w-5 md:hidden cursor-pointer" 
            />

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <motion.a
                href="#about"
                className="navLinkClass"
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                About
              </motion.a>
              <motion.a
                href="#features"
                className="navLinkClass"
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#customers"
                className="navLinkClass"
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Customer
              </motion.a>
              <motion.a
                href="#contact"
                className="navLinkClass"
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Contact
              </motion.a>

              <a
                href="#"
                onClick={handleDownloadClick}
                className="bg-[#1A3871] rounded-lg px-4 py-2 text-white font-medium inline-flex align-items justify-center tracking-tight hover:opacity-90 transition-opacity"
              >
                <span>Download Now</span>
              </a>
            </nav>
          </div>

          {/* Mobile view menu */}
          {isMenuOpen && (
            <nav className="flex flex-col md:hidden gap-4 mt-4 text-black/60 items-start">
              <motion.a
                href="#about"
                className="navLinkClass"
                onClick={toggleMenu}
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                About
              </motion.a>
              <motion.a
                href="#features"
                className="navLinkClass"
                onClick={toggleMenu}
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#customers"
                className="navLinkClass"
                onClick={toggleMenu}
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Customer
              </motion.a>
              <motion.a
                href="#contact"
                className="navLinkClass"
                onClick={toggleMenu}
                whileHover={{ y: -3, color: "#1A3871" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Contact
              </motion.a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDownloadClick(e);
                  toggleMenu();
                }}
                className="bg-[#1A3871] rounded-lg px-4 py-2 text-white font-medium inline-flex justify-center tracking-tight w-full"
              >
                <span>Download Now</span>
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};