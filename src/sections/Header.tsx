import ArrowRight from '@/assets/arrow-right.svg';
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";


export const Header = () => {
  return ( 
    <header className='sticky top-0 backdrop-blur-sm z-20  '>
    <div className="flex justify-center items-center py-3 bg-[#5B76E1] text-white text-sm gap-3">
      <p className='text-white/85 hidden md:block'>Streamline your workflow and boost your productivity </p>
    <div className='inline-flex justify-center items-center gap-1 text-white'>
    <p>Get started for free </p>
    <ArrowRight className="h-4 w-4 inline-flex justify-center items-center "/>
    </div>
    </div>
    <div className='py-3'>
      <div className='container'>
        <div className='flex items-center justify-between'>
    <Image src={Logo} alt="Saas Logo" height={50}  width={50}></Image>
    <MenuIcon className="h-5 w-5 md:hidden"/>
    <nav className=' hidden md:flex gap-6 text-black/60 items-center'>
      <a href='#'>About</a>
      <a href="#">Features</a>
      <a href="#">Customer</a>
      <a href="#">Updates</a>
      <a href="#">Help</a>
      <button className='bg-black rounded-lg px-4 py-2  text-white font-medium inline-flex align-items justify-center tracking-tight'>Get for free</button>
    </nav>
        </div>
      </div>
    </div>
    </header>
  )
};

