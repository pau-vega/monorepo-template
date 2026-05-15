import { globSync } from "glob"
import { defineConfig, type Options } from "tsup"

const shared: Options = {
  format: ["esm"],
  // Workaround: tsup DTS builder uses deprecated baseUrl internally (tsup#1388)
  // https://github.com/egoist/tsup/issues/1388 — remove when tsup fixes this
  dts: { compilerOptions: { ignoreDeprecations: "6.0" } },
  sourcemap: true,
  external: ["react", "react-dom"],
  outDir: "dist",
  outExtension: () => ({ js: ".js" }),
}

export default defineConfig([
  {
    ...shared,
    // Components + hooks: need "use client"
    entry: [...globSync("src/components/*.tsx"), ...globSync("src/hooks/*.ts")],
    clean: true,
    banner: { js: '"use client";' },
  },
  {
    ...shared,
    // Barrel index + utils: no "use client"
    entry: ["src/index.ts", "src/lib/utils.ts"],
    // clean: false — first config above already cleaned dist; don't wipe its output
    clean: false,
  },
])
