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
