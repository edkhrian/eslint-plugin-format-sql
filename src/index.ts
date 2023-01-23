import { format } from './rules';

export const configs = {
  format: {
    plugins: ['format-sql'],
    rules: {
      'format-sql/format': [
        'warn',
        {
          language: 'postgresql',
          tags: ['SQL', 'sql'],
          startSpaces: 2,
          spaces: 2,
        },
      ],
    },
  },
};
export const rules = { format };
