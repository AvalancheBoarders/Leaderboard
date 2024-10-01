module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', "prettier"],
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-inferrable-types": "off",
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }