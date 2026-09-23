import { serve } from "bun";
import { join } from "path";
import { existsSync, statSync } from "fs";

const PORT = 3000;
const BASE_DIR = import.meta.dir;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".sh": "text/plain; charset=utf-8",
  ".ps1": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    // Direct install script aliases
    if (pathname === "/install.sh") {
      pathname = "/public/install.sh";
    } else if (pathname === "/install.ps1") {
      pathname = "/public/install.ps1";
    }

    const filePath = join(BASE_DIR, pathname);

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const file = Bun.file(filePath);

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache"
        }
      });
    }

    return new Response("404 Not Found - Lost on the Grand Line 🌊", { status: 404 });
  }
});

console.log(`🏴‍☠️ ClawNest Website running at http://localhost:${server.port}`);
