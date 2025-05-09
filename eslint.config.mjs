import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),{
    rules:{
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-unused-vars": [
            "warn",
            {
              "args": "all",
              "argsIgnorePattern": "^_",
              "vars": "all",
              "varsIgnorePattern": "^_|^props$", // Ignore React props
              "ignoreRestSiblings": true,
              "caughtErrors": "all"
            }
          ],
          "@typescript-eslint/no-empty-interface": [
            "error",
            {
              "allowSingleExtends": true,  // Allow empty interfaces extending one type
             "allowMultipleExtends": false 
            }
          ]
    }
  }
];

export default eslintConfig;
