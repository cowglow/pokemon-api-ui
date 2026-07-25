import { defineConfig, Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import checker from "vite-plugin-checker";
import { renderSVG } from "uqr";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function getGitRevision() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return "unknown"
  }
}

// Terminal QR renderers (vite-plugin-qrcode included) pack 2 QR modules per
// character using half-block glyphs, assuming a roughly square terminal cell -
// some IDE-embedded terminals use different line-height metrics and stretch
// the result into unreadable rectangles. Writing a real SVG and opening it in
// the browser sidesteps terminal font metrics entirely.
function qrCodeOnStart(): Plugin {
  return {
    name: "qrcode-svg-on-start",
    apply: "serve",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        setTimeout(() => {
          const networkUrl = server.resolvedUrls?.network?.[0]
          if (!networkUrl) return
          const outPath = fileURLToPath(new URL("./.qrcode.svg", import.meta.url))
          writeFileSync(outPath, renderSVG(networkUrl))
          try {
            execSync(`open ${JSON.stringify(outPath)}`)
          } catch {
            server.config.logger.info(`Could not auto-open QR code, see ${outPath}`)
          }
        }, 0)
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base:"/pokemon-api-ui",
  plugins: [svgr(),react(), checker({typescript:true}), qrCodeOnStart()],
  define: {
    __GIT_REVISION__: JSON.stringify(getGitRevision())
  }
})
