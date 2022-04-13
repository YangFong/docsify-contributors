const { build } = require("esbuild");
const fs = require("fs/promises");

const compressPlugin = {
    name: "compress",
    setup(build) {
        build.onEnd(async () => {
            const path = __dirname + "/dist/index.min.js";
            const res = await fs.readFile(path);
            const data = res.toString();
            await fs.writeFile(path, data.replace(/\s{2,}/g, ""));
        });
    }
};

build({
    entryPoints: ["./src/core/index.ts"],
    bundle: true,
    minify: true,
    outfile: "/dist/index.min.js",
    plugins: [compressPlugin]
}).catch(() => process.exit(1));
