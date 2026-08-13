import productImage from "@/assets/product-image.png";
import pyramidImage from "@/assets/pyramid.png";
import tubeImage from "@/assets/tube.png";

import Image from "next/image";

export const ProductShowcase = () => {
  return <section className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF] py-24 overflow-x-clip ">
    <div className="container">
      <div className="section-heading">
      <div className="flex justify-center">
      <div className="tag">Boost your productivity</div>
      </div>
      <h2 className="section-title mt-5 ">A more effective way to track progress</h2>
      <p className="section-para mt-5">Celebrate the joy of accomplishment with an app designed to track your progress and motivate your efforts.</p>
      </div>
      <div className="relative">
      <Image src={productImage} alt="product Image" className="mt-10"/>
      <Image src={pyramidImage} alt="pyramid Image" height={262}  width={262} className="hidden md:block absolute -right-36 -top-32" />
      <Image src={tubeImage} alt="tube Image" height={268} className="hidden md:block absolute bottom-24 -left-36" />
      </div>
    </div>
  </section>
};
