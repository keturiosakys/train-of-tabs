import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

const manifest = defineManifest(async (env) => ({
	manifest_version: 3,
	description: "An extension to keep track of where that tab came from.",
	version,
	icons: {
		16: "src/assets/icon16.png",
		32: "src/assets/icon32.png",
		48: "src/assets/icon48.png",
		128: "src/assets/icon128.png",
	},
	name: env.mode === "development" ? "[DEV] Train of Tabs" : "Train of Tabs",
	action: {
		default_popup: "index.html",
		default_title: "Panko",
	},
	background: {
		type: "module",
		service_worker: "src/background.ts",
	},
	permissions: ["storage", "tabs"],
}));

export default defineConfig({
	plugins: [solidPlugin(), crx({ manifest })],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
