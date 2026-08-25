"use client";
import Image from "next/image";
import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import { motion } from "motion/react";

export const Footer = () => {


  return (
    <footer className="bg-white text-black/85 text-sm py-10 text-center w-full overflow-hidden ">
      <div className="container flex flex-col relative right-16 md:mb-12 md:right-0 w-[62%]  md:m-auto  md:w-[90%] md:flex-row md:items-center ">
        <div className="inline-flex  relative before:content-[' '] before:top-0 before:bottom-0 before:blur before:h-full before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute sm:w-14 md:size-14 md:left-14 lg:left-12">
          <Image
            src={logo}
            width={50}
            height={50}
            alt="Logo"
            className="relative"
            style={{
              width:"auto", 
              height:"auto"
            }}
          />
        </div>
        <nav className="flex flex-col items-start gap-3 mt-6 md:flex-row md:justify-center md:items-center  md:mt-0 md:gap-3 lg:gap-8 md:w-[32%] md:relative md:left-40 lg:m-auto  lg:left-14 lg:text-lg">
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

          {/* <a href="#">Careers</a> */}
        </nav>
        <div className="flex  flex-col justify-start items-start md:items-center  md:relative md:w-32 md:-right-64 lg:-right-0 lg:w-50">
          <div className="flex justify-center gap-2  mt-6  relative right-3 md:right-0   md:gap-4  ">
            <motion.a
              href="https://www.linkedin.com/company/lapwork/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="transition-colors hover:text-[#0A66C2]"
            >
              <SocialLinkedin />
            </motion.a>

            <motion.a
              href="https://x.com/lapwork_"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="transition-colors hover:text-[#404040]"
            >
              <SocialX />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/lapwork_/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="transition-colors hover:text-[#C32AA3]"
            >
              <SocialInsta />
            </motion.a>
          </div>
          <p className="mt-6 mb-4 text-black/60 text-[12px] text-start md:text-center  ">
            &copy; 2026 lapwork, Inc. All rights reserved.
          </p>
        </div>
      </div>
  
      <h1 className=" max-w-9xl mx-auto mt-6 text-center font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#9af7ff] via-[#01c6ed] to-[#2256f3]opacity-90 text-5xl sm:text-[12rem] md:text-[15rem] -z-[1]">
        lapwork
      </h1>
    </footer>
  );
};

//  bg-gradient-to-b from-[#8c8c8c] via-[#2b2b2b] to-[#010101]
