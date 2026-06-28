const webWorkerUrl = settings.theme_uploads_local.worker;
const wasmUrl = settings.theme_uploads.wasm;

let webWorker;
let messageSeq = 0;
const resolvers = {};

export function cookSvgBob(text) {
  const seq = messageSeq++;

  if (!webWorker) {
    webWorker = new Worker(webWorkerUrl);
    webWorker.postMessage(["wasmUrl", wasmUrl]);
    webWorker.onmessage = (e) => {
      const [incomingSeq, converted] = e.data;
      resolvers[incomingSeq](converted);
      delete resolvers[incomingSeq];
    };
  }

  webWorker.postMessage([seq, text]);

  return new Promise((resolve) => {
    resolvers[seq] = resolve;
  });
}

export function stripStyle(svg) {
  return svg.replace(/<style.*<\/style>/s, "");
}
