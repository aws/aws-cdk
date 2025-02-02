const baseConfig = require("@aws-cdk/cdk-build-tools/config/eslintrc");
baseConfig.ignorePatterns.push("lib/init-templates/**/typescript/**/*.ts");
baseConfig.ignorePatterns.push("test/integ/cli/sam_cdk_integ_app/**/*.ts");
baseConfig.parserOptions.project = __dirname + "/tsconfig.json";

// custom rules
baseConfig.rules["@cdklabs/no-throw-default-error"] = ["error"];
baseConfig.overrides.push({
  files: ["./test/**"],
  rules: {
    "@cdklabs/no-throw-default-error": "off",
  },
});

// TODO: turn these on
// ignoring new eslint rules until CLI refactor is complete
baseConfig.rules["@stylistic/spaced-comment"] = "off";
baseConfig.rules['@stylistic/no-extra-semi'] = "off";
baseConfig.rules['@stylistic/padded-blocks'] = "off";
baseConfig.rules['jsdoc/require-param-description'] = "off";
baseConfig.rules['jsdoc/require-property-description'] = "off";
baseConfig.rules['jsdoc/require-returns-description'] = "off";
baseConfig.rules['jsdoc/check-alignment'] = 'off';

module.exports = baseConfig;
