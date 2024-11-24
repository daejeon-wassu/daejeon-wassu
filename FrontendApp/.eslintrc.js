module.exports = {
  root: true,
  extends: ['@react-native', 'eslint:recommended', 'prettier'],
  rules: {
    'no-undef': 'off',
    'no-var': 'error',
    'no-multiple-empty-lines': 'error',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': ['warn', {args: 'none', argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    eqeqeq: 'error',
    'dot-notation': 'error',
  },
};
