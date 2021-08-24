import * as fs from 'fs';

interface WriteFileOpts {
  readonly dryRun?: boolean;
}

export function writeFile(args: WriteFileOpts, filePath: string, content: string): void {
  if (args.dryRun) {
    return;
  }
  fs.writeFileSync(filePath, content, 'utf8');
}
