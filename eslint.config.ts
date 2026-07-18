import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    // Custom rules go here
    rules: {
      "no-shadow": "off",
    },
  },
];
