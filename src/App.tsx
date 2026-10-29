import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Cursor from "./components/layout/Cursor";
import FloatingControls from "./components/layout/FloatingControls";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Preloader from "./components/layout/Preloader";
import RouteEffects from "./components/layout/RouteEffects";
import ScrollProgress from "./components/layout/ScrollProgress";
import Toaster from "./components/layout/Toaster";
import { useTerminal } from "./lib/terminal";
import Home from "./pages/Home";

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const loadTerminal = () => import("./components/terminal/Terminal");
const Terminal = lazy(loadTerminal);

// The terminal's code is fetched once the page is idle and only mounted after the first open.
function TerminalHost() {
  const { open } = useTerminal();
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);

  useEffect(() => {
    const prefetch = () => {
      loadTerminal().catch(() => undefined);
    };
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetch, { timeout: 8000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(prefetch, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!opened) return null;
  return (
    <Suspense fallback={null}>
      <Terminal />
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <RouteEffects />
      <Preloader />
      <Cursor />
      <Header />
      <ScrollProgress />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="route-fallback" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingControls />
      <TerminalHost />
      <Toaster />
      <div className="crt" aria-hidden="true" />
    </>
  );
}
