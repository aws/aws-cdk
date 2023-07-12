import * as path from 'path';
import * as minimatch from 'minimatch';

export function matchIncludePatterns(patterns: string[], absoluteRootPath: string, absoluteFilePath: string): boolean {
  if (!path.isAbsolute(absoluteRootPath) || !path.isAbsolute(absoluteFilePath)) {
    throw new Error('Paths expect absolute paths');
  }

  const relativePath = path.relative(absoluteRootPath, absoluteFilePath);
  for (const pattern of patterns) {
    if (minimatch(relativePath, pattern, { matchBase: true })) {
      return true;
    }
  }
  return false;
}
