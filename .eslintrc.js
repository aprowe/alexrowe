
module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 1,
    'disallowMultipleLineBreaks': 0,
    'no-console': 0,
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
