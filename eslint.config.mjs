import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        rules: {
            "indent"           : [1, 4],
            "space-unary-ops"  : 2
        }
    },
    {
        languageOptions: { globals: {...globals.browser, ...globals.node} }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {
        files: ["**/*.vue"], 
        languageOptions: {
            parserOptions: {parser: tseslint.parser}
        }
    },
];