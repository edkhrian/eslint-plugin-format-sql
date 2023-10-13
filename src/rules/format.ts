import { generate } from 'astring';
import { formatter } from './formatter';

interface RuleOptions {
  tags?: string[];
  spaces?: number;
  startSpaces?: number;
}

export const format = {
  meta: { fixable: 'code' },
  create(context: any) {
    const ruleOptions: RuleOptions = (context.options && context.options[0]) || {};
    const tags = ruleOptions.tags || ['SQL', 'sql'];
    const startIndent = ruleOptions.startSpaces ?? 2;
    const expressionPlaceholder = '"format-sql-placeholder"';

    return {
      TemplateLiteral(node: any) {
        if (!node.parent.tag || !tags.includes(generate(node.parent.tag))) return;

        const literal = node.quasis.map((quasi: any) => quasi.value.raw).join(expressionPlaceholder);

        if (!literal) return;
        const eolMatch = literal.match(/\r?\n/u);
        const [eol = '\n'] = eolMatch || [];

        let formatted = formatter.format(literal, ruleOptions);

        // keep parent indentation
        if (formatted.includes(eol)) {
          let firstNodeInLine = node;
          while (firstNodeInLine.parent && firstNodeInLine.loc.start.line === firstNodeInLine.parent.loc.start.line) {
            firstNodeInLine = firstNodeInLine.parent;
          }
          // Get the margin at the start of the line
          const sourceCode = context.sourceCode;
          const priorLine = sourceCode.lines[firstNodeInLine.loc.start.line - 1];
          const priorMarginMatch = priorLine.match(/^(\s*)\S/u);
          const parentIndentation = priorMarginMatch ? priorMarginMatch[1] : '';
          const tabOrSpace = parentIndentation.startsWith('\t') ? '\t' : '  ';
          const extraIndentation = startIndent ? ' '.repeat(startIndent || 0) : tabOrSpace;
          const startIndentation = `${parentIndentation}${extraIndentation}`;

          formatted = formatted
            .replace(new RegExp(`^${startIndentation}`), '')
            .replace(new RegExp(`^${parentIndentation}`), '')
            .replace(new RegExp(eol, 'g'), `${eol}${startIndentation}`)
            .replace(new RegExp(`${eol}[ \t]+${eol}`, 'g'), `${eol}${eol}`);
          formatted = `${eol}${startIndentation}${formatted}${eol}${parentIndentation}`;
        }

        if (literal !== formatted) {
          context.report({
            fix(fixer: any) {
              const fixed = node.expressions.reduce((str: string, expression: any) => {
                return str.replace(expressionPlaceholder, '${' + generate(expression) + '}');
              }, formatted);

              return fixer.replaceText(node, '`' + fixed + '`');
            },
            message: 'Query is not formatted',
            node,
          });
        }
      },
    };
  },
};
