'use strict';

const astring = require('astring');
const formatter = require('pg-formatter');

const cache = {
  values: [],
  get(key) {
    const item = this.values.find(function (item) {
      return item.key === key;
    });
    return item ? item.value : undefined;
  },
  add(key, value) {
    this.values.push({ key, value });
    this.values = this.values.slice(-1000);
  },
};

module.exports = {
  meta: { fixable: 'code' },
  create(context) {
    const ruleOptions = (context.options && context.options[0]) || {};
    const tags = ruleOptions.tags || ['SQL', 'sql'];
    const expressionPlaceholder = '"pg-formatter-placeholder"';

    return {
      TemplateLiteral(node) {
        if (!node.parent.tag || tags.indexOf(node.parent.tag.name) === -1) return;

        const literal = node.quasis
          .map(function (quasi) {
            return quasi.value.raw;
          })
          .join(expressionPlaceholder);

        if (!literal) return;

        // check cache and format
        let formatted = cache.get(literal);
        if (!formatted) {
          formatted = formatter.format(literal, ruleOptions);
          cache.add(literal, formatted);
        }
        formatted = formatted.replace(/^\s+|\s+$/g, '');

        // keep parent indentation
        if (formatted.indexOf('\n') >= 0) {
          let firstNodeInLine = node;
          while (firstNodeInLine.parent && firstNodeInLine.loc.start.line === firstNodeInLine.parent.loc.start.line) {
            firstNodeInLine = firstNodeInLine.parent;
          }
          const parentIndentation = ' '.repeat(firstNodeInLine.loc.start.column);
          const extraIndentation = ' '.repeat(ruleOptions.spaces || 0);

          formatted = formatted.replace(/\n/g, `\n${parentIndentation + extraIndentation}`);
          formatted = `\n${parentIndentation + extraIndentation}${formatted}\n${parentIndentation}`;
        }

        if (literal !== formatted) {
          context.report({
            fix: function (fixer) {
              const fixed = node.expressions.reduce(function (str, expression) {
                return str.replace(expressionPlaceholder, '${' + astring.generate(expression) + '}');
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
