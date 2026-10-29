import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Cursor from "./components/layout/Cursor";
import FloatingControls from "./components/layout/FloatingControls";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Preloader from "./components/layout/Preloader";
import RouteEffects from "./components/layout/RouteEffects";
import ScrollProgress from "./components/layout/ScrollProgress";
import Toaster from "./components/layout/Toaster";
import Terminal from "./components/terminal/Terminal";
import Home from "./pages/Home";

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <Terminal />
      <Toaster />
      <div className="crt" aria-hidden="true" />
    </>
  );
}
