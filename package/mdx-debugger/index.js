import LZString from "lz-string";

export function withDebugger(compile) {
  const compileWithDebugger = (file, options) => {
    const name = file?.path ?? "unknown";
    const value = typeof file === "string" ? file : file?.value;
    console.log("compiling", name);

    let debuggerData = {
      path: name,
      source: value,
      startingMDAST: null,
      steps: [],
    };

    function startingPlugin() {
      return (root) => {
        debuggerData.startingMDAST = snapshot(root);
      };
    }

    function addDebuggerToPlugin(plugin) {
      return (...a) => {
        const transformer = plugin(...a);
        return (root, ...rest) => {
          const result = transformer(root, ...rest);
          const output = snapshot(root);
          debuggerData.steps.push({
            mdast: output,
            code: plugin.toString().slice(0, 500),
          });
          return result;
        };
      };
    }

    let xOptions = options;
    if (xOptions && xOptions.remarkPlugins) {
      xOptions = { ...options };
      xOptions.remarkPlugins = xOptions.remarkPlugins.map((plugin) => {
        const pluginWithDebugger = Array.isArray(plugin)
          ? [addDebuggerToPlugin(plugin[0]), plugin[1]]
          : addDebuggerToPlugin(plugin);
        return pluginWithDebugger;
      });
    }

    xOptions = {
      ...xOptions,
      remarkPlugins: [startingPlugin, ...(xOptions?.remarkPlugins || [])],
    };

    const result = compile(file, xOptions);
    const hash = LZString.compressToEncodedURIComponent(
      JSON.stringify(debuggerData)
    );
    console.log("compiled", name, `https://mdxdebug.pomb.us/#${hash}`);
    return result;
  };
  return compileWithDebugger;
}

function snapshot(obj) {
  if (obj == null || typeof obj != "object") {
    return obj;
  }

  var temp = new obj.constructor();

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = snapshot(obj[key]);
    }
  }

  return temp;
}
