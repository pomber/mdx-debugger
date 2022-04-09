# MDX Debugger

```js
import { withDebugger } from "mdx-debugger";

const file = "# hi";

const debugCompile = withDebugger(compile);
await debugCompile(file, { remarkPlugins: [remarkGfm] });
```
