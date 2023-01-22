# eslint-plugin-format-sql

[![NPM][npm-icon]][npm-url]

ESLint plugin to format SQL queries inside any SQL template tag using [@sqltools/formatter][format-library-url]. One of the key features of this plugin is keeping code's indent after a formation.

## Installation
Install the plugin first:
```bash
npm install --save-dev eslint-plugin-format-sql
```

Then add this plugin to eslint config in `extends` section and configure rule for your need:
```json5
// .eslintrc
{
  "extends": [
    // ...
    "plugin:format-sql/format"
  ],
  "rules": {
    "format-sql/format": ["warn", {
      "tags": ["SQL", "sql"], // names of SQL template tags to parse their literals
      "startIndent": 0, // extra spaces to indent for each query line
      "formatter": { 
        // @sqltools/formatter options
      },
    }],
    // ...
  },
}
```
You can check available options for `formatter` object [here][format-library-url].

In case no options is provided for the rule then default params will be used:
```json5
{
  "tags": ["SQL", 'sql'],
  "startIndent": 0,
  "formatter": {},
}
```

## Example

Example of formation with default options.

Before:
```typescript
import { SQLFactory } from 'pg-sql-template'; // or another sql template library
import { client } from './client';

const SQL = SQLFactory({ client });

class PostsController {
  async getPosts(userId: number) {
    const posts = await SQL`
      SELECT posts.id, posts.text, posts.created_at AS created, users.name AS author 
      FROM posts LEFT JOIN users ON users.id = posts.author_id
      WHERE posts.author_id = ${userId}
      ORDER BY posts.created_at`.many();
    
    // ...
  }
}
```

After `--fix`:
```typescript
import { SQLFactory } from 'pg-sql-template'; //  or another sql template library
import { client } from './client';

const SQL = SQLFactory({ client });

class PostsController {
  async getPosts(userId: number) {
    const posts = await SQL`
    SELECT posts.id,
      posts.text,
      posts.created_at AS created,
      users.name AS author
    FROM posts
      LEFT JOIN users ON users.id = posts.author_id
    WHERE posts.author_id = ${userId}
    ORDER BY posts.created_at
    `.many();
    
    // ...
  }
}

```

[npm-url]: https://www.npmjs.com/package/eslint-plugin-format-sql
[npm-icon]: https://img.shields.io/npm/v/eslint-plugin-format-sql.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen
[format-library-url]: https://www.npmjs.com/package/@sqltools/formatter