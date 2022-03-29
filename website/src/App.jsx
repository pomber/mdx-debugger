// import "./App.css";
import LZString from "lz-string";

function App() {
  const data = readHash();
  const { path, source, startingMDAST, steps } = data;

  return (
    <div style={{ display: "flex", maxHeight: "100vh" }}>
      <Source source={source} />
      <Tree tree={startingMDAST} />
      {steps.map((step, i) => (
        <Tree key={i} tree={step.mdast} />
      ))}
    </div>
  );
}

function Source({ source }) {
  return (
    <pre style={{ minWidth: 400, width: 400, overflow: "auto" }}>{source}</pre>
  );
}

function Tree({ tree }) {
  return (
    <pre style={{ minWidth: 400, width: 400, overflow: "auto" }}>
      {JSON.stringify(tree, null, 2)}
    </pre>
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
