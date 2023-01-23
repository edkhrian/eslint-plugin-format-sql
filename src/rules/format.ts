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
    const startIndent = ruleOptions.startSpaces || 0;
    const expressionPlaceholder = '"format-sql-placeholder"';

    return {
      TemplateLiteral(node: any) {
        if (!node.parent.tag || !tags.includes(node.parent.tag.name)) return;

        const literal = node.quasis.map((quasi: any) => quasi.value.raw).join(expressionPlaceholder);

        if (!literal) return;

        let formatted = formatter.format(literal, ruleOptions);

        // keep parent indentation
        if (formatted.includes('\n')) {
          let firstNodeInLine = node;
          while (firstNodeInLine.parent && firstNodeInLine.loc.start.line === firstNodeInLine.parent.loc.start.line) {
            firstNodeInLine = firstNodeInLine.parent;
          }
          const parentIndentation = ' '.repeat(firstNodeInLine.loc.start.column);
          const extraIndentation = ' '.repeat(startIndent || 0);

          formatted = formatted.replace(/\n/g, `\n${parentIndentation + extraIndentation}`).replace(/\n +\n/g, '\n\n');
          formatted = `\n${parentIndentation + extraIndentation}${formatted}\n${parentIndentation}`;
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
