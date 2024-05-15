import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  integrations: [sitemap(), partytown()],
  image: {
    domains: []
  }
});
