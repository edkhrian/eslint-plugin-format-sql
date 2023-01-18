module.exports = {
  configs: {
    format: {
      plugins: ['pg-formatter'],
      rules: {
        'pg-formatter/format': [
          'warn',
          {
            tags: ['SQL', 'sql'],
            startIndent: 2,
            formatter: {
              spaces: 2,
              keywordCase: 'uppercase',
              functionCase: 'lowercase',
            },
          },
        ],
      },
    },
  },
  rules: {
    format: require('./format'),
  },
};
