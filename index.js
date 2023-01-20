module.exports = {
  configs: {
    format: {
      plugins: ['format-sql'],
      rules: {
        'format-sql/format': [
          'warn',
          {
            tags: ['SQL'],
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
