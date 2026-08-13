import ArrowRight from "@/assets/arrow-right.svg";
import CogImage from "@/assets/cog.png";
import Image from "next/image";
import CylinderImage from "@/assets/cylinder.png";
import NoodleImage from "@/assets/noodle.png";

export const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip    ">
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="tag">Version 2.0 is here</div>
            <h1 className="text-5xl md:text-7xl tracking-tighter font-bold bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text">
              Pathway to productivity
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
            <Image
              src={CogImage}
              alt="Cog Image"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
            />
            <Image
              src={CylinderImage}
              alt="Cylinder Image"
              width={220}
              height={220}
              className="hidden md:block -top-8 -left-32 md:absolute"
            />
            <Image
              src={NoodleImage}
              width={220}
              alt="Noodle Image"
              className="hidden lg:block absolute top-[550px] left-[448px] rotate-[30deg]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
