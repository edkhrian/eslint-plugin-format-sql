module.exports = {
  configs: {
    format: {
      plugins: ['format-sql'],
      rules: {
        'format-sql/format': 'warn',
      },
    },
  },
  rules: {
    format: require('./format'),
  },
};
