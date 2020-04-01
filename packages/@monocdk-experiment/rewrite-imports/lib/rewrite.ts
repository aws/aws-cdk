const exclude = [
  '@aws-cdk/cloudformation-diff',
  '@aws-cdk/assert'
];

export function rewriteFile(source: string) {
  const output = new Array<string>();
  for (const line of source.split('\n')) {
    output.push(rewriteLine(line));
  }
  return output.join('\n');
}

export function rewriteLine(line: string) {
  for (const skip of exclude) {
    if (line.includes(skip)) {
      return line;
    }
  }
  return line
    .replace(/(["'])@aws-cdk\/core(["'])/g, '$1monocdk-experiment$2')        // monocdk-experiment => monocdk-experiment
    .replace(/(["'])@aws-cdk\/(.+)(["'])/g, '$1monocdk-experiment/$2$3');  // monocdk-experiment/foobar => monocdk-experiment/foobar;
}
