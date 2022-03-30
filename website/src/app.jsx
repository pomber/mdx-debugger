import "./app.css";
import LZString from "lz-string";
import ReactJson from "react-json-view";
import { useMemo, useState } from "react";

function App() {
  const data = readHash();
  const { path, source, startingMDAST, steps } = data;

  // console.log("data", data);

  return (
    <div className="accordion">
      <Source source={source} path={path} />
      <Tree tree={startingMDAST} name={`Remark #0`} />
      {steps.map((step, i) => (
        <Tree
          key={i}
          tree={step.mdast}
          name={`Remark #${i + 1}`}
          code={step.code}
        />
      ))}
    </div>
  );
}

function Source({ source, path }) {
  const title = path ? path : `MDX Source`;
  return (
    <Panel name={title}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{source}</pre>
    </Panel>
  );
}

function Tree({ tree, name, code }) {
  const filtered = useMemo(() => filterTree(tree), [tree]);
  return (
    <Panel name={name} tooltip={code}>
      <ReactJson
        displayDataTypes={false}
        displayObjectSize={false}
        indentWidth={2}
        collapsed={3}
        quotesOnKeys={false}
        src={filtered}
      />
    </Panel>
  );
}

export default App;

function readHash() {
  const hash = document.location.hash.slice(1);
  if (!hash) {
    return {};
  }

  try {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(hash));
  } catch {
    return {};
  }
}

function filterTree(node) {
  const { position, ...rest } = node;
  if (rest.children) {
    rest.children = rest.children.map(filterTree);
  }
  return rest;
}

function Panel({ children, name, tooltip }) {
  const [open, setOpen] = useState(true);

  const toggle = () => setOpen(!open);

  return (
    <div className="panel" data-collapsed={!open}>
      <div className="panel-bar" onClick={toggle}>
        <span className="panel-bar-text" title={tooltip}>
          {name}
        </span>
      </div>
      <div
        className="panel-content"
        style={{
          display: open ? "block" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
