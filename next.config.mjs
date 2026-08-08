/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// three.js ships untranspiled ESM examples; Next handles it, but we keep the
	// package on the server-external list out of the RSC graph to avoid warnings.
	experimental: {
		optimizePackageImports: ["@react-three/drei", "framer-motion"],
	},
	webpack: (config) => {
		// GLB/GLTF assets dropped into /public are fetched over HTTP, but if you
		// prefer importing them, this loader makes it work out of the box.
		config.module.rules.push({
			test: /\.(glb|gltf|hdr|exr)$/,
			type: "asset/resource",
		})
		return config
	},
}

export default nextConfig
