import { SqlLanguage, formatDialect } from 'sql-formatter';
import { minifySql } from '../utils';
import { dialects } from './dialects';

interface FormatterOptions {
  language?: SqlLanguage;
  spaces?: number;
}

export const formatter = {
  format(sql: string, options: FormatterOptions) {
    const spaces = (options && options.spaces) || 2;
    const language: SqlLanguage = options.language || 'sql';
    const dialect = dialects[language] || dialects.sql;

    sql = minifySql(sql);
    sql = formatDialect(sql, { dialect, expressionWidth: 100, tabWidth: spaces });

    const keywords = dialect.tokenizerOptions.reservedKeywords;
    const indent = ' '.repeat(spaces);
    const regExps = {
      endsWithKeyword: new RegExp(`(?:${keywords.join('|')})\\s*$`),
      startsWithKeyword: new RegExp(`^\\s*(?:${keywords.join('|')})`),
      endsWithOpenParenthesis: /\($/,
      startsWithCloseParenthesis: /^\s*\)/,
      startIndent: new RegExp('^' + indent),
      spaceBeforeFunctionArguments: new RegExp('([a-z0-9_]+) (\\([^)\\n]*\\))', 'g'),
    };

    let result = '';
    let trimUntilIndent = '';
    let nestingCount = 0;

    // remove redundant new lines
    sql.split('\n').forEach((line, index, array) => {
      const prevLine = array[index - 1];
      if (
        prevLine &&
        regExps.endsWithKeyword.test(prevLine) &&
        !regExps.startsWithKeyword.test(line) &&
        !regExps.startsWithCloseParenthesis.test(line)
      ) {
        result = result.trimEnd();
        line = ' ' + line.trimStart();

        if (regExps.endsWithOpenParenthesis.test(line)) {
          const match = line.match(/^( +)/);
          if (match) {
            trimUntilIndent = match[0];
            nestingCount = 1;
          }
        }
      }

      if (trimUntilIndent) {
        line = line.replace(regExps.startIndent, '');

        if (regExps.endsWithOpenParenthesis.test(line)) {
          nestingCount += 1;
        } else if (regExps.startsWithCloseParenthesis.test(line)) {
          nestingCount -= 1;
        }
        if (nestingCount === 0) {
          trimUntilIndent = '';
        }
      }

      result += line + '\n';
    });

    result = result.replace(regExps.spaceBeforeFunctionArguments, '$1$2');
    result = result.trim();

    return result;
  },
};
