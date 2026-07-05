import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

const eslintConfig = defineConfig([
  ...expoConfig,
  globalIgnores([
    ".next/**",
    ".expo/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/next-app-legacy/**",
  ]),
]);

export default eslintConfig;
