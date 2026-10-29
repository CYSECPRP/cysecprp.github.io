import { site } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Experience from "../sections/Experience";
import Hero from "../sections/Hero";
import Impact from "../sections/Impact";
import Lab from "../sections/Lab";
import Marquee from "../sections/Marquee";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";

export default function Home() {
  useDocumentTitle(
    `${site.name} — Cybersecurity & Software Engineering | Bengaluru`,
  );

  return (
    <>
      <Hero />
      <Marquee />
      <section id="about" aria-labelledby="about-title">
        <About />
        <Skills />
        <Experience />
        <Impact />
      </section>
      <Projects />
      <Lab />
      <Contact />
    </>
  );
}
