import { defineConfig } from "vocs";

export default defineConfig({
  title: "Docs",
  theme: {
    accentColor: "#ffab00",
  },
  topNav: [
    {
      text: "ERC-7920",
      link: "https://eips.ethereum.org/EIPS/eip-7920",
    },
  ],
  ogImageUrl: "https://erc7920.org/og.png",
  description: "Batch off-chain signatures",
  editLink: {
    pattern:
      "https://github.com/sola92/composite-712/edit/main/docs/pages/:path",
    text: "Edit on GitHub",
  },
  sidebar: [
    {
      text: "Overview",
      link: "/",
    },
    {
      text: "Reference",
      link: "/reference",
    },
    // {
    //   text: "Examples",
    //   link: "/examples",
    // },
    {
      text: "Kudos",
      link: "/kudos",
    },
  ],
});
