import * as path from 'path';

// Must be a 'require' to not run afoul of ESM module import rules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const minimatch = require('minimatch');

export function matchIncludePatterns(patterns: string[], absoluteRootPath: string, absoluteFilePath: string): boolean {
  if (!path.isAbsolute(absoluteRootPath) || !path.isAbsolute(absoluteFilePath)) {
    throw new Error('Paths expect absolute paths');
  }

  const relativePath = path.relative(absoluteRootPath, absoluteFilePath);
  let includeOutput = false;

  for (const pattern of patterns) {
    const negate = pattern.startsWith('!');
    const match = minimatch(relativePath, pattern, { matchBase: true, flipNegate: true });

    if (!negate && match) {
      includeOutput = true;
    }

    if (negate && match) {
      includeOutput = false;
    }
  }

  return includeOutput;
}
