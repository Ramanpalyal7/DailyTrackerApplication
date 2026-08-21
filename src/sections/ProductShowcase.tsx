"use client";
import productImage from "@/assets/product-image.png";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";
import checklistImage from "@/assets/checklistquality.png";
import clockImage from "@/assets/clockquality.png";
import lapworkImage from "@/assets/lapworkApplication1.png";

import Image from "next/image";
import { motion, useScroll , useTransform } from "motion/react";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef= useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end','end start']
  });
  const translateY = useTransform(scrollYProgress,[0,1], [150, -150]);

  return (
    <section  ref={sectionRef}   className="bg-gradient-to-b from-[#FFFFFF] to-[#7df4ff] py-24 overflow-x-clip ">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Boost your productivity</div>
          </div>
          <h2 className="section-title mt-5 ">
            A more effective way to track progress
          </h2>
          <p className="section-para mt-5">
            Celebrate the joy of accomplishment with an app designed to track
            your progress and motivate your efforts.
          </p>
        </div>
        <div className="relative">
          <Image src={lapworkImage} alt="product Image" className="mt-10 rounded-2xl" />
          <motion.img
            src={clockImage.src}
            alt="pyramid Image"
            height={332}
            width={332}
            className="hidden md:block absolute -right-36 -top-32"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={checklistImage.src}
            alt="tube Image"
            height={248}
            width={248}
            
            className="hidden md:block absolute bottom-24 -left-36 "
               style={{
              translateY,
              
            }}
          />
        </div>
      </div>
    </section>
  );
};
