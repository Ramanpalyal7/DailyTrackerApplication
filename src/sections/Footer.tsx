import Image from "next/image";
import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg"; 
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";




export const Footer = () => {
  return (
    <footer className="bg-white text-black/85 text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[' '] before:top-0 before:bottom-0 before:blur before:h-full before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">

      <Image src={logo} height={50} alt="Logo"  className="relative"/>
        </div>
      <nav className="flex flex-colmd:flex-row md:justify-center gap-6 mt-6 ">
        <a href="#">About</a>
        <a href="#">Features</a>
        <a href="#">Customers</a>
        <a href="#">Pricing</a>
        <a href="#">Help</a>
        <a href="#">Careers</a>
      </nav>
      <div className="flex justify-center gap-6 mt-6 ">
        
        <a href="#"target="_blank" rel="noopener noreferrer"><SocialX/></a>
        <a href="https://www.instagram.com/lapwork_/" target="_blank" rel="noopener noreferrer"><SocialInsta/></a>
        <a href="https://www.linkedin.com/company/lapwork/" target="_blank" rel="noopener noreferrer"><SocialLinkedin/></a>     
   

      </div>
<p className="mt-6">&copy; 2026 LapWork, Inc. All rights reserved.</p>
      </div>
    </footer>
  )
};
