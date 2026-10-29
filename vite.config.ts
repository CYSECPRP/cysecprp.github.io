import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { projects } from "./src/content/projects.ts";

// GitHub Pages cannot send headers, so the CSP ships as a meta tag (build only: the dev server injects inline scripts).
function contentSecurityPolicy(connectSources: string[]): Plugin {
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src ${connectSources.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
  ].join("; ");

  return {
    name: "prp-content-security-policy",
    apply: "build",
    transformIndexHtml: () => [
      {
        tag: "meta",
        attrs: { "http-equiv": "Content-Security-Policy", content: policy },
        injectTo: "head-prepend",
      },
    ],
  };
}

// GitHub Pages serves /resume from resume.html with a 200 status; unknown paths get 404.html, which still boots the SPA.
function staticRoutes(routes: string[]): Plugin {
  let outDir = "dist";
  return {
    name: "prp-static-routes",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const index = resolve(outDir, "index.html");
      for (const route of ["404", ...routes]) {
        const page = resolve(outDir, `${route}.html`);
        mkdirSync(dirname(page), { recursive: true });
        copyFileSync(index, page);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const connectSources = ["'self'"];
  const routes = [
    "resume",
    "projects",
    // Covers a /projects -> /projects/ directory redirect.
    "projects/index",
    ...projects.map((project) => `projects/${project.slug}`),
  ];

  if (env.VITE_CONTACT_ENDPOINT) {
    connectSources.push(new URL(env.VITE_CONTACT_ENDPOINT).origin);
  }

  return {
    base: env.VITE_BASE || "/",
    plugins: [
      react(),
      contentSecurityPolicy(connectSources),
      staticRoutes(routes),
    ],
    build: {
      // Never inline fonts as data: URLs; the CSP only allows font-src 'self'.
      assetsInlineLimit: (filePath: string) =>
        /\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined,
    },
  };
});
