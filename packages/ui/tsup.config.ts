import { glob } from "glob"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", ...glob.sync("src/components/*.tsx"), ...glob.sync("src/hooks/*.ts"), "src/lib/utils.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  banner: {
    js: '"use client";',
  },
  outDir: "dist",
  outExtension: () => ({ js: ".js" }),
})
