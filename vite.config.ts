import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

const manifest = defineManifest(async (env) => ({
	manifest_version: 3,
	version,
	name: env.mode === "staging" ? "[DEV] Breadcrumbs" : "Breadcrumbs",
	action: {
		default_popup: "index.html",
		default_title: "Breadcrumbs",
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
