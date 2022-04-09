import { compile } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkLicense from "remark-license";
import remarkCapitalize from "remark-capitalize";
import { withDebugger } from "../package/index.js";

const file = `
# example

Some text.

## use

## License
`;

const debugCompile = withDebugger(compile, {
  filter: (file) => file?.path.includes("test"),
  // log: (filepath, url) =>
  //   console.log(
  //     url.replace("https://mdxdebug.pomb.us/", "http://localhost:3000/")
  //   ),
});
const result = await debugCompile(
  { value: file, path: "test.md" },
  {
    remarkPlugins: [remarkLicense, remarkCapitalize],
    rehypePlugins: [rehypeSlug],
  }
);
