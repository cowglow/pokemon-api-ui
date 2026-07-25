import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import checker from "vite-plugin-checker";
import { execSync } from "node:child_process";

function getGitRevision() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return "unknown"
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base:"/pokemon-api-ui",
  plugins: [svgr(),react(), checker({typescript:true})],
  define: {
    __GIT_REVISION__: JSON.stringify(getGitRevision())
  }
})
