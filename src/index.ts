import { format } from './rules';

export default {
  configs: {
    format: {
      plugins: ['format-sql'],
      rules: {
        'format-sql/format': [
          'warn',
          {
            startSpaces: 2,
            spaces: 2,
          },
        ],
      },
    },
  },
  rules: { format },
};
