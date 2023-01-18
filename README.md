# eslint-plugin-pg-formatter

[![NPM][npm-icon]][npm-url]

ESLint plugin to format SQL queries inside any SQL template tag using [pg-formatter](https://github.com/gajus/pg-formatter). One of the key features of this plugin is keeping code's indent after a formation.

## Installation
Install the plugin first:
```bash
npm install --save-dev eslint-plugin-pg-formatter
```

Then add this plugin to eslint config in `extends` section and configure rule for your need:
```json5
// .eslintrc
{
  "extends": [
    // ...
    "plugin:pg-formatter/format"
  ],
  "rules": {
    "pg-formatter/format": ["warn", {
      "tags": ["SQL", "sql"], // names of SQL template tags to parse their literals
      "startIndent": 2, // extra spaces to indent for each query line
      "formatter": { 
        // pg-formatter options
      },
    }],
    // ...
  },
}
```
You can check available options for `formatter` field [here](https://github.com/gajus/pg-formatter).

In case no options is provided for the rule then default ones will be used:
```json5
{
  "tags": ["SQL", "sql"],
  "startIndent": 2,
  "formatter": {
    "spaces": 2,
    "keywordCase": 'uppercase',
    "functionCase": 'lowercase',
  },
}
```

## Example

Example of formation with default options.

Before:
```typescript
import { SQL } from 'some-sql-tag-library';

class PostsController {
  async getPosts(userId: number) {
    const posts = await SQL`
      SELECT posts.id, posts.text, posts.created_at AS created, users.name AS author 
      FROM posts LEFT JOIN users ON users.id = posts.author_id
      WHERE posts.author_id = ${userId}
      ORDER BY posts.created_at`.execute();
    
    // ...
  }
}
```

After `--fix`:
```typescript
import { SQL } from 'some-sql-tag-library';

class PostsController {
  async getPosts(userId: number) {
    const posts = await SQL`
      SELECT
        posts.id,
        posts.text,
        posts.created_at AS created,
        users.name AS author
      FROM
        posts
        LEFT JOIN users ON users.id = posts.author_id
      WHERE
        posts.author_id = ${userId}
      ORDER BY
        posts.created_at
    `.execute();
    
    // ...
  }
}

```

[npm-url]: https://www.npmjs.com/package/eslint-plugin-pg-formatter
[npm-icon]: https://img.shields.io/npm/v/eslint-plugin-pg-formatter.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen
