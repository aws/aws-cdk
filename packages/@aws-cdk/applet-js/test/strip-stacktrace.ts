import 'source-map-support/register';

function outputPatchedJson(text: string) {
  const document: any = JSON.parse(text);
  for (const stack of (document.stacks as any[])) {
    for (const key of Object.keys(stack.metadata)) {
      if (!stack.metadata[key]) { continue; }
      for (const entry of (stack.metadata[key] as any[])) {
        if (entry.trace) { entry.trace = ['**REDACTED**']; }
      }
    }
  }
  if ('runtime' in document) {
    delete document.runtime;
  }
  process.stdout.write(JSON.stringify(document, null, 2));
}

function main() {
  let inputText: string = '';
  process.stdin.setEncoding('utf8')
         .on('data', chunk => inputText += chunk)
         .on('end', () => outputPatchedJson(inputText));
}

main();
