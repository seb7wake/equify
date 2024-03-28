// config/esbuild.config.js
const esbuild = require("esbuild");
const rails = require("esbuild-rails");

esbuild
  .build({
    entryPoints: ["application.js"],
    outdir: "app/assets/builds",
    bundle: true,
    sourcemap: true,
    watch: process.argv.includes("--watch"),
    plugins: [rails()],
    loader: {
      ".js": "jsx", // Add loader for JSX if using .js extension
      ".ts": "tsx", // Support for TypeScript
    },
  })
  .catch(() => process.exit(1));
