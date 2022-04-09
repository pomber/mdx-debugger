import LZString from "lz-string";

export function newData(path, source) {
  return {
    path,
    source,
    remarkSteps: [],
    rehypeSteps: [],
    output: null,
  };
}

export function toHash(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function fromHash(hash) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(hash));
}
