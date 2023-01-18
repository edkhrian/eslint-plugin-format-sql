module.exports = {
  configs: {
    format: {
      plugins: ['pg-formatter'],
      rules: {
        'pg-formatter/format': [
          'warn',
          {
            spaces: 2,
            keywordCase: 'uppercase',
            functionCase: 'lowercase',
          },
        ],
      },
    },
  },
  rules: {
    format: require('./format'),
  },
};
