import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://parixan.xyz",
  devToolbar: { enabled: false },
  experimental: {
    responsiveImages: true,
    svg: true
  },
  integrations: [sitemap({ entryLimit: 10000 }), partytown(), react({ experimentalReactChildren: true })],
  image: {
    domains: []
  }
});
