"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import CogImage from "@/assets/cog.png";
import Cartoon from "@/assets/Cartoon.png";
import Image from "next/image";
import CylinderImage from "@/assets/cylinder.png";
import NoodleImage from "@/assets/noodle.png";
import calculatorImage from "@/assets/Calculator.png";
import businessPadImage from "@/assets/business.png";



import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef } from "react";

export const Hero = () => {
  const heroRef= useRef(null);
  const { scrollYProgress } = useScroll(
    {
    target: heroRef,
    offset: ["start end", "end start"],
   }
  )

  const translateY = useTransform(scrollYProgress, [0,1], [150,-150]);

// ,#183EC2,


  return (
    <section ref={heroRef} className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#05DCF0,#B2E2EA_100%)] overflow-x-clip">
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag">Version 2.0 is here</div>
            <h1 className="text-5xl md:text-7xl tracking-tighter font-bold bg-gradient-to-b from-[#016377] to-[#2256f3] text-transparent bg-clip-text">
              Lapwork for productivity
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Celebrate the joy of accomplishment with an app designed to track
              your progress, motivate your efforts, and celebrate your
              successes.
            </p>
            <div className="flex items-center gap-1 mt-[30px] ">
              <button className="btn btn-primary">Get for free</button>
              <button className="btn btn-text gap-1">
                {" "}
                <span>Learn More </span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative ">


            <motion.img
              src={Cartoon.src}
              alt="Cog Image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0 "
              animate={{
                translateY:[-30,33],
              }}
              transition={{
                repeat: Infinity,
                repeatType:'mirror',
                duration:4,
                ease:"easeInOut",
              }}
            />
            <motion.img
              src={businessPadImage.src}
              alt="Notes Taking Image"
              width={140}
              height={140}
              className="hidden md:block -top-8 -left-32 md:absolute"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={calculatorImage.src}
              width={120}
              alt="calculator Image"
              className="hidden lg:block absolute top-[550px] left-[448px] rotate-[30deg]"
               style={{
                rotate: -30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
