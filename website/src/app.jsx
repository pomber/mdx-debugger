import "./app.css";
import ReactJson from "react-json-view";
import { useMemo, useState } from "react";
import { fromHash } from "../../package/data";

function App() {
  const data = readHash();

  if (!data) {
    return <EmptyState />;
  }

  const { path, source, remarkSteps, rehypeSteps, output } = data;

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

const sampleURL =
  "/?foo#N4IgDghgLgFiBcIoFMDOUB0BbAJiANCKgPYCuATgMbIIgA6AdgMQAEyAHhFmADbKOMAysSzIWKdpgHNWpVPwaMmrADIBLag3mMCIcsiwRyAa0EowqBAG1QEdAlBQAnmBqJyxYlF2UYanjj6DNaOLm4gMMgQOGoMAOa6OMhgsAgAjIS+-oHIwfA2SGG0Et6EAG4QPKThHFy8NIRgxKhqUGrEeaDoRt7woDyxbgBMmcRVWHkAzITEAGaz8r2TAL6EuXh9IAMMw6PjeWkADDPzi+mHy5cAuo3Nre2dRFA9DluDCCMglGOkE+knC2QvTSqxA61e212Xx+f3gRwBZzhF0u+FCrlokHIEDiWLAcEyfgCQRChXRiBKugqVXCwlE4g4mF0TRabQ6r265F6-Xe8AALHtfgcEUD0kNQeDNpCEPzoft0hkQHNAb0hmLrrcWQ92c9ORCeTLvnK4cLgWK1gwNtydtKBbC0gqlYjVZdVmjwpForEEoQkik4PBPlkibkSc4yUgGZTKtVaHIGuA7qzHhyuW9rfAAGy2vIyx0igMAdnFFr16azssFCALJoQk2RyxuCc1bM2KdLbnLhsrxsVp3zQ15xctaY72arNfgdZdqNJ7qiMXiiWSqQDBOyxPybuKkfK0fC6k08iZia1rZ1qal8AAHGO+RPJgBWIfthA3it2h193q8tUNjX3FsunPF9r1vT9lVrM0wRLSUeTfLsPwnH8XUbZkAOTYDYPTBUEKFXsIPgC5zWHS8AE4wKQlZp1sexNjDcIPC8HxCRyPICno2gPQXb0QF9FccJYjd2KKckdxAKkY0QWpuD4Y9mwwl4sKhXDa3vZ8lI+MDjnwxEjhQ-8k21RSrWUmE8LzYF1JMzT3wObSLPOajZwxIxsVxfEvkEkNN2c0TJCjalaFpMQSgwOT0KM3UNLvWz-h0-M0igiVrJilS4XAp1f1Qk9AKeYyRxtWKewcuEkpglKDTM+UJ2dFEt0QLivSXP0bKDVjQxEiN-N3QLEDjcLDLPfLL07KqYpKoYi2IkDRqNat4qWetsvkyKLx5Wbuwy-tB2m6KNtheaSqnOrfIiecmp9Zd-UDLy2PqrrSnEvdaAPXIjwM08gOGuDb1zL9ayfXaUvgsb7SQrKPtyttopBo0tqWMqSJ+oqwYW6VfxnDjEExNyIDxZj1284Tw22YxdDaKBZPgBhSB4HhCAoHhOKgKALHgAB6dniFcLQyCoZAMGIcg4nZgZDzQdmAFkAEkABUCeDO7TopHrJJAGX5YbV1lbEiTwhYABKlgQG1rGHoCtWmiwAAjZByBNq4-ybCKhqilKcNBiciOgpH03IlHKOnaEkloWZSAYSgkxYfRDBMV6tGQAAKbmk1QFgAF4WGAZYAEos8YFgWG+LQoBYNQ4gYIXkAAMViSoABFkFmWJ0LT9OC8LlgU4eVAMHLyv9FrhgG6blvU4z9PM-DpJm52HAWAAHwXjvC+7jpe-7quh5H2fW4nzOabplfO4AfnEchqmPwv4C7lIe77iut7rnhG931OO+L9B6S-zO160DBGrxEXgvFgYs3rIAABLnXiAAJWQHEDgYBpCF30FACgDAWB2CcBHFgicoD6GQPgFgzc+B53TgAPnzhgzunMWAAFEeDyDLmnWYQsWDoAXEQsMGhKg8CcCwSupc4w4AwMfdmAAqIuV4y6P30AIhkLBxHs2Pp-Uu1s7BiEziQgWMRyDDzpGfSAsAMD6BIDwMoSdtEYEoAAdxwEQqxuj9HIDzjfKxticAqPXqXSAlBjDYhrv4TRmCbEQFaMQ2IOAACqYAADyOxE4mxnHYVMZtGKPTakJe6gCeJ8X9AJQmSszYqyer1EAdDOAyXjGhQaX03YFVXEVaYaNJxWQaYGUG9l-pIn0s7WpeV6mXg6XDCcIIgbtK0qM+smNOo4xxHjDymSib3RKXrIKIgQoMjCpDBSgz9QURaYlNpl5Kpw3hh8CGfTPoDLWumU5m1RmIxAvcxCLTaqm06jk5qK4bqFI6uGVZz1EBRPelcqGmEUr7RzDVKaPsZq3kOt046TsanXOhpCg5E0dpwr2gi+80zsnQNyVdVqt1-nhEBWU+OoLUXgu+umWG3Y-oEUfMc5GaVUYlWQuqMFuzbluEZXae8TyYZgXOXyDG905nuQVu1HyZtSbk1aFTQ+9MQCM2ZqzVAHMuY8xIBQaggthaiw0OA1AUs5ayqyTrbqpS1Yawdh8gFusgUgENsbJ1FKXVlKtrbe2WtlouzqfyuKHKvZsr9pi7pvIqKgm+CHRAicyGULwQQhxQTk1UMLmUNQLJU3IEISwAA5DkotRDK5JAzpQ4Ax8c15orYWotJQy30kkAAOWIJWihWbO6F1Ua20umcSgdqSBgPWLAz7Ds7QLPWGB8FqCwEmlgN8i1FsLlfAdI6Z17gzuIZVScSg52PrnDuJ6GDLAdoQfQMAwhmGSJYHyKTXhpM8Bksl8rOrID4KIBgj1nhxDbVwd0aQmQeFcJyNQaAHBxvfcTL1tq1mIAqXUWSOzVogWGd2ZpR0I2mThl0giekeW0r5RhqNhHcOtU6VMpyxTvVqx0J62gX6DC5D-diQDogMSge5nbNoUG+gwb+R+51CHXXBQHds3l6HoovPMt0o54yTlipqpckjMmKrkd0iKzTKNxXvJmaJx6iH6DBCY1Jb9bHyYcaA5xIYPHwP8YfdnNcityXbjE2UkF1ScqkdxUVZlTpYXJQaVC8cLTkWBv6ei0LWntqUczHiiLBKbXGddYxwzNRLO-uswB2zDV7ONDA3xyDzmhNuZE-BtLVLTUJwGmiiFDTBXQoi4DHFwMVMtO5Si3zGmmtxYRgl5r1UuuStSxbcIGX7osZ-exvLXHsYOZKwJlznlhNweY9lubnHwgQCWxBlbER9CzE1WzTmvHeYGoFkLEWYCE7modeVuVG2-LVftZarWmWPNvf1kbJJKz6PhF9XbR1UWGv0rcB7EZLTvYhbIgN6UsbtZProp1dJVrlmnRm1Zwg-6ducRA0V3jB3nMgDUBsMElT6hJLWxVl75tVbhGQ1U+rdK9npkw7CbDSKEuc7sjR4jvXXYhsaWGw5vPJmHJS3RzzDGzNfYs6xnLuObMLfAPtpz0HXPPYB7LmkGzJOs787psXJVFPtYaXJkbE01NC+Dc8hHpUEtW-Sqp2jnVKVy-+1jrbuX8cFY16V145PYxHie9amXP3aDeaN31kav0YUJbC-ARFLKlpoeF-CgObzsVw-Wklo60uPeA9oFNn3Svtv5YiIV8AxWSfB4p3dsP2uI-F71y9WrNK7c3JAsN8aSK2t54ZZ1rltuVqZ9Fdno6On+t6fBu7ozE3S-y+m77lX82geB5W+HzHZtsfK6QKr3bW-ScwGO6d7V529V80NTdk14sHsfZb7vtvUfECPcdgrhndrfseq-57oHEQP1UHDPe3aKKHB5GHBLf2U3aNWNUYBNEAMOCOKOa9W9KoOIJdGtahVBdBXBfBAtTNbA3tVADA3uUxIEJNZBTuOtVofNRtffKAFtROBtIgjdNQWYXBHJGBCABgYwFg6dPOAAMiEIEWnQwDADrycxYBEJYAAEIYA7AAAFKQpwAQpIIhItcnItHOPOYg3tTuBtCQqQ0rPueeTOUg0gOIXuSwzAqAYgMwcgL0dQlxI9ahXtZYY9NwwuTw89S9RUUgVmQI2gCRAAAQACtUB2AYFw42g6QIBAiRBoANAWAIiojpZuAhYoBhArto4ohI4lFGAF0mhOQs5q4sQ4hZtME04AB9co7EWbIhSI9gaolgGo5opoqItOOwNo5o1AZYYhDwLAFgOgPQfIqAdmZogAWgvl-QXX4BAAAG5GBkDI4HgWBJZ64AANAAYQ6BQF-UTkkO5jbizlzh7X7WABsVxHAxvk2K2JUAgCcDICgAGMzmOIsGsRECaB2F-TTiXlwWzhzmWJwKBDwPuMeOeMCInV6KiMTghKeJeKIViWtnCOQEjgwDsBaArkThcxYA+NQCIX0L7VuhvnaLhJqMoH0GgGQElhwHYD2N-TYyJLPR8N0OXTaKpKiBQDpIZP2LYyTRBMLlWKjkpOpJ5PpMZIOKgCwK8RLk5O+I6DY1OJRLRIxKxP7lxI3RgDSBvlGJ1NGPwA3TAD1PAENO1KGFNJgCGHNPcM7ggFNIgFGOPSIQJK+MyN+KgFQGBOPlwL0VhPYFQETjqIqMaJ7V7SWQYBvisHJPYGDO+A9OVIAQyHDIMPJ1NOknqFtIMM7kjNNOZyzNMxzNziIWdIEAIADPjMVM9N7jACJI3RJMKVNIk1CmdLtLZNLPoHLKIVjKrMTL+IARGFTN7XTJGPVW0AIAbKLlJLHO8zbOLJzk7LoG7MrMpOrKTOtPrPbM7lHNGKbwWKNO3MbMVlNOpQWI3RLLHOXMUArNjKDLXP7K9IkK3JzOPNYmjN7IfJ+KTIgBfNfMLjPybitJZjO11Tehv2u2NX3Mf1lmzP-OnKbLHI1nnNfMvNGPdUNLHOB3IFGKuAvJzjwrtNziFJYF8N8MQSyJYBngSJ4FLnuKlLYxBJNiAA";
function EmptyState() {
  return (
    <div className="landing">
      <div className="content">
        <h1>MDX Debugger</h1>
        <p>
          For instructions see{" "}
          <a href="https://github.com/pomber/mdx-debugger">GitHub</a>
        </p>
        <p>
          Here is <a href={sampleURL}>a demo</a> of what to expect.
        </p>
      </div>
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
    return null;
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
