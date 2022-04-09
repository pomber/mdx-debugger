import { newData, toHash } from "./data.js";

function defaultLog(filepath, url, hash) {
  console.log("compiled", filepath, url);
}

export function withDebugger(compile, { log = defaultLog, filter }) {
  const compileWithDebugger = async (file, options) => {
    const name = file?.path ?? "unknown";

    if (filter && !filter(file)) {
      return compile(file, options);
    }

    const value = typeof file === "string" ? file : file?.value;

    let debuggerData = newData(name, value);

    function startingRemarkPlugin() {
      return (root) => {
        debuggerData.remarkSteps.push({ ast: snapshot(root) });
      };
    }
    function startingRehypePlugin() {
      return (root) => {
        debuggerData.rehypeSteps.push({ ast: snapshot(root) });
      };
    }

    function addDebuggerToPlugin(plugin, steps) {
      return (...a) => {
        const transformer = plugin(...a);
        return async (root, ...rest) => {
          const result = await transformer(root, ...rest);
          const output = snapshot(root);
          debuggerData[steps].push({
            ast: output,
            code: plugin.toString().slice(0, 500),
          });
          return result;
        };
      };
    }

    let xOptions = options || {};
    if (xOptions.remarkPlugins) {
      xOptions = { ...xOptions };
      xOptions.remarkPlugins = xOptions.remarkPlugins.map((plugin) => {
        const pluginWithDebugger = Array.isArray(plugin)
          ? [addDebuggerToPlugin(plugin[0], "remarkSteps"), plugin[1]]
          : addDebuggerToPlugin(plugin, "remarkSteps");
        return pluginWithDebugger;
      });
    }

    if (xOptions.rehypePlugins) {
      xOptions = { ...xOptions };
      xOptions.rehypePlugins = xOptions.rehypePlugins.map((plugin) => {
        const pluginWithDebugger = Array.isArray(plugin)
          ? [addDebuggerToPlugin(plugin[0], "rehypeSteps"), plugin[1]]
          : addDebuggerToPlugin(plugin, "rehypeSteps");
        return pluginWithDebugger;
      });
    }

    xOptions.remarkPlugins = [
      startingRemarkPlugin,
      ...(xOptions?.remarkPlugins || []),
    ];

    xOptions.rehypePlugins = [
      startingRehypePlugin,
      ...(xOptions?.rehypePlugins || []),
    ];

    const result = await compile(file, xOptions);

    debuggerData.output = String(result);

    const hash = toHash(debuggerData);
    log(name, `https://mdxdebug.pomb.us/#${hash}`, hash);
    return result;
  };
  return compileWithDebugger;
}

function snapshot(obj) {
  return JSON.parse(JSON.stringify(obj));
}
