import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // don't advertise what the site runs on
  poweredByHeader: false,
  // page.dev.tsx files are pages only in `npm run dev`, so test pages like
  // /api-demo never ship with the site
  pageExtensions: isDev
    ? ["dev.tsx", "tsx", "ts", "jsx", "js"]
    : ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
