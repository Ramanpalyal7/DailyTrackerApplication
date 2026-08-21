"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import cursorImage from "@/assets/cursorIcon.png";
import aboutIconImage from "@/assets/aboutIcon.png";
import scrollImage from "@/assets/scroll.png";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#7df4ff] py-24"
    >
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Sign up for free today</h2>
          <p className="section-para mt-5">
            Celebrate the joy of accomplishment with an app designed to track
            your progress and motivate your efforts.
          </p>
          <motion.img
            src={scrollImage.src}
            alt="SearchIcon Image"
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
            className="absolute -right-[302px] -top-[19px]"
            style={{
              rotate: -15,
              translateY,
            }}
          />
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Get for free</button>
          <button className="btn btn-text gap-1">
            {" "}
            <span>Learn More </span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
