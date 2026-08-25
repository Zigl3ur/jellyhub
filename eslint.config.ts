import { tanstackConfig } from "@tanstack/eslint-config";
import { globalIgnores } from "eslint/config";

export default [
  ...tanstackConfig,
  {
    rules: {
      "no-shadow": "off",
    },
  },
  globalIgnores(["node_modules", ".output"]),
];
