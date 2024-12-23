import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"]
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
        parser: "@typescript-eslint/parser",
        jsxPragma: "React",
        ecmaFeatures:
          { jsx: true }
      },
    }
  },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 0,
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 0,
      'vue/multi-word-component-names': 0,
      'prefer-const': 0,
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'vue/no-mutating-props': 'error', // 不允许改变组件 prop
      'no-useless-escape': 0,
      '@typescript-eslint/no-unused-vars': 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-empty-object-type": 0,
      "eslint/ban-ts-comment": 0,
      "no-undef": 0,
      "@typescript-eslint/no-unused-expressions": 0,
      "@typescript-eslint/no-unsafe-function-type": 0,
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-non-null-asserted-optional-chain": 0,
    }
  }
];