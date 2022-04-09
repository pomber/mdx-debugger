import "./app.css";
import ReactJson from "react-json-view";
import { useMemo, useState } from "react";
import { fromHash } from "../../package/data";

function App() {
  const data = readHash();
  console.log(data);
  const { path, source, remarkSteps, rehypeSteps, output } = data;

  // console.log("data", data);

  return (
    <div className="accordion">
      <Source source={source} path={path} />
      {remarkSteps.map((step, i) => (
        <Tree
          key={i}
          tree={step.ast}
          name={`Remark #${i}`}
          color="#cccdf9"
          code={step.code}
        />
      ))}
      {rehypeSteps.map((step, i) => (
        <Tree
          key={i}
          tree={step.ast}
          name={`Rehype #${i}`}
          color="#b6e89d"
          code={step.code}
        />
      ))}
      <Source source={output} path="Output" />
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

function Tree({ tree, name, code, color }) {
  const filtered = useMemo(() => filterTree(tree), [tree]);
  return (
    <Panel name={name} tooltip={code} color={color}>
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
    return fromHash(hash);
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

function Panel({ children, name, tooltip, color }) {
  const [open, setOpen] = useState(true);

  const toggle = () => setOpen(!open);

  return (
    <div className="panel" data-collapsed={!open}>
      <div className="panel-bar" onClick={toggle} style={{ background: color }}>
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
