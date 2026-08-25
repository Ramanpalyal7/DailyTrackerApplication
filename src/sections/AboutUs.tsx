"use client";

import aboutImage from "@/assets/aboutpro.png";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const AboutUs = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#7df4ff] py-24"
    >
      <div className="container flex flex-col justify-center items-center md:flex-row    md:gap-10 lg:gap-32  ">
        <div className=" md:block ">
          <motion.img
            src={aboutImage.src}
            width={120}
            alt="Developer Team"
            className=" w-80 rounded "
            whileHover={{
              scale: 1.08,
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            style={{
              translateY,
            }}
          />
          <p className="section-para text-[12px] leading-[15px] mb-4 tracking-tighter md:tracking-tight   md:text-[10px] md:mt-8 lg:mt-0 ">
            Built by developers who care about deep work, and <br /> honest 
            productivity not guilt-driven hustle.
              <span className="mt-1 block">-Team Lapwork</span>
          </p>
          
        </div>

        <div className="section-heading relative mx-0   ">
          <div>
            <h2 className="section-title">“Focusing is about saying No.”</h2>
            <p
              className="section-para mt-5 leading-7
           text-[16px] md:text-[18px]  "
            >
              Productivity means saying no to distractions{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent font-black animate-pulse">
                Lapwork
              </span>{" "}
              tracks your productive hours and distracted moments side by side,
              so you always know where your time truly goes.
            
            </p>
          </div>
        </div>
      </div>
      {/* <motion.img
            src={scrollImage.src}
            alt="scroll  Image"
            width={160}
           
            className="absolute -left-[280px] -top-[117px]"
            style={{
                rotate: 3,
              translateY,
            
            }}
          />
          <motion.img
            src={cursorImage.src}
            alt="cursor image"
            width={160}
            className="sm:hidden md:block md:absolute md:-right-[120px] md:-top-[19px]"
            style={{
              rotate: -15,
              translateY,
            }}
          /> */}

      {/* <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Get for free</button>
          <button className="btn btn-text gap-1">
            {" "}
            <span>Learn More </span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div> */}
    </section>
  );
};
