import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker"; 
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Pricing } from "@/sections/Pricing";
import { Testimonials } from "@/sections/Testimonials";
import { AboutUs } from "@/sections/AboutUs";
import { Footer } from "@/sections/Footer";
import { Stats } from "@/sections/StatsDisplay";
import { FAQ } from "@/sections/FAQ";


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Stats/>
      <LogoTicker/>
      <ProductShowcase/>
      <section id="features" className="scroll-mt-28 ">
      <FAQ/>

      </section>
      {/* <Pricing /> */}
      <section id="customers" className="scroll-mt-32">
      <Testimonials />

      </section>
      <section  id="about" className="scroll-mt-28">
      <AboutUs/>
      </section>
    <section id="contact" className="scroll-mt-28">
      <Footer/>

    </section>

    </>
  );
}
