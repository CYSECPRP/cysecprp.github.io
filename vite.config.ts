import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { projects } from "./src/content/projects.ts";
import { projectsIntro, resumeSummary, site } from "./src/content/site.ts";

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

type Page = {
  file: string;
  /** Canonical path; null keeps the page out of search results. */
  path: string | null;
  title: string;
  description: string;
};

const HEAD_PLACEHOLDER = "<!--prp:head-->";

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function headTags({ path, title, description }: Page) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${site.url}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(`${site.name} — cybersecurity portfolio`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (path === null) {
    tags.push(`<meta name="robots" content="noindex" />`);
  } else {
    tags.push(
      `<link rel="canonical" href="${site.url}${path}" />`,
      `<meta property="og:url" content="${site.url}${path}" />`,
    );
  }
  return tags.join("\n    ");
}

const home: Page = {
  file: "index.html",
  path: "/",
  title: `${site.name} — Cybersecurity & Software Engineering | ${site.location.city}`,
  description: site.description,
};

const projectsPage = {
  path: "/projects",
  title: `Projects — ${site.name}`,
  description: projectsIntro,
};

const pages: Page[] = [
  { file: "projects.html", ...projectsPage },
  // Covers a /projects -> /projects/ directory redirect.
  { file: "projects/index.html", ...projectsPage },
  ...projects.map((project) => ({
    file: `projects/${project.slug}.html`,
    path: `/projects/${project.slug}`,
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  })),
  {
    file: "resume.html",
    path: "/resume",
    title: `Resume — ${site.name}`,
    description: resumeSummary.slice(0, resumeSummary.indexOf(". ") + 1),
  },
  {
    file: "404.html",
    path: null,
    title: `404 — ${site.name}`,
    description: site.description,
  },
];

// GitHub Pages serves /resume from resume.html with a 200 status, so every route gets its own HTML and head tags; unknown paths get 404.html, which still boots the SPA.
function sitePages(): Plugin {
  const homeHead = headTags(home);
  return {
    name: "prp-site-pages",
    enforce: "post",
    transformIndexHtml: (html) =>
      html.replace(HEAD_PLACEHOLDER, () => homeHead),
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (index?.type !== "asset") return;
      const html =
        typeof index.source === "string"
          ? index.source
          : new TextDecoder().decode(index.source);
      if (!html.includes(homeHead))
        this.error(`index.html must contain ${HEAD_PLACEHOLDER}`);

      for (const page of pages) {
        this.emitFile({
          type: "asset",
          fileName: page.file,
          source: html.replace(homeHead, () => headTags(page)),
        });
      }

      const urls = new Set(
        [home, ...pages].flatMap((page) =>
          page.path === null ? [] : [`${site.url}${page.path}`],
        ),
      );
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...[...urls].map((url) => `  <url><loc>${url}</loc></url>`),
          "</urlset>",
          "",
        ].join("\n"),
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const connectSources = ["'self'"];

  if (env.VITE_CONTACT_ENDPOINT) {
    connectSources.push(new URL(env.VITE_CONTACT_ENDPOINT).origin);
  }

  return {
    base: env.VITE_BASE || "/",
    plugins: [react(), contentSecurityPolicy(connectSources), sitePages()],
    build: {
      // Never inline fonts as data: URLs; the CSP only allows font-src 'self'.
      assetsInlineLimit: (filePath: string) =>
        /\.(woff2?|ttf|otf)$/i.test(filePath) ? false : undefined,
      rolldownOptions: {
        output: {
          // Libraries change less often than app code, so they get their own long-lived chunks.
          codeSplitting: {
            groups: [
              {
                name: "react",
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
              },
              {
                name: "gsap",
                test: /[\\/]node_modules[\\/](gsap|@gsap[\\/]react|lenis)[\\/]/,
              },
            ],
          },
        },
      },
    },
  };
});
