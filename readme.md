# MDX Debugger

A dev tool to inspect the ast transformations done remark and rehype plugins during MDX compilation.

https://user-images.githubusercontent.com/1911623/162578700-360b2b4b-4d80-4c48-8a67-2db0c79190af.mp4

## Usage

```
$ npm i mdx-debugger
```

```js
import { withDebugger } from "mdx-debugger";

const file = { value: "# Hello", path: "test.md" };

const debugCompile = withDebugger(compile);
const result = await debugCompile(file, {
  remarkPlugins: [...],
  rehypePlugins: [...],
});
```

## Options

```js
import { withDebugger } from "mdx-debugger";

const file = { value: "# Hello", path: "test.md" };

const debugCompile = withDebugger(compile, {
  // only debug some files:
  filter: (file) => file?.path.includes("test.md"),
  // customize the message logged to the console:
  log: (filepath, url) => console.log(`${filepath} -> ${url}`),
});
const result = await debugCompile(file, {
  remarkPlugins: [...],
  rehypePlugins: [...],
});
```

## Contribution

PRs welcome.

## License

MIT
