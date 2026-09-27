import { About } from "@/app/components/home/about";
import { Features } from "@/app/components/home/features";
import { Hero } from "@/app/components/home/hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <About />
    </>
  );
}