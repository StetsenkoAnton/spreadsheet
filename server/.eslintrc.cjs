 /* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'eslint:recommended',
  ],
  env: {
    node: true,
  },
  sourceType: "module",
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
