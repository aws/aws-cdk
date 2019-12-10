import fs = require('fs-extra');
import minimatch = require('minimatch');
import path = require('path');

export async function storedInGit(fileName: string) {
  const ignore = await gitIgnore(fileName);
  return ignore.included(fileName);
}

async function gitIgnore(fileName: string) {
  const ignoreFiles = await findIgnoreFiles(path.dirname(fileName));
  return new GitIgnore(await Promise.all(ignoreFiles.map(f => loadGitignore(f))));
}

async function findIgnoreFiles(dir: string) {
  const ret: string[] = [];

  while (true) {
    const ignoreFile = path.join(dir, '.gitignore');
    if (await fs.pathExists(ignoreFile)) {
      ret.push(ignoreFile);
    }
    if (await fs.pathExists(path.join(dir, '.git'))) { break; }
    const nextDir = path.dirname(dir);
    if (dir === nextDir) { break; }
    dir = nextDir;
  }

  ret.reverse();
  return ret;
}

export class GitIgnore {
  constructor(private readonly ignores: IgnoreFile[]) {
  }

  public included(fileName: string) {
    let ret = true;
    for (const ignore of this.ignores) {
      const rel = path.relative(ignore.dir, fileName);
      for (const pat of ignore.patterns) {
        if (patternMatches(rel, pat.glob)) {
          ret = pat.include;
        }
      }
    }
    return ret;
  }
}

function patternMatches(relPath: string, pattern: string): boolean {
  const forceDirectory = pattern.endsWith('/');
  if (forceDirectory) {
    pattern = pattern.substr(0, pattern.length - 1);
  }

  // If glob contains a / apart from the end, must match full path
  if (pattern.indexOf('/') > -1) {
    return minimatch(relPath, pattern);
  }

  // Otherwise, the glob can match anywhere, but if it ended in a /,
  // it MUST be a directory (so not the final part)
  const parts = relPath.split(path.sep);
  for (let i = 0; i < parts.length - (forceDirectory ? 1 : 0); i++) {
    if (minimatch(parts[i], pattern)) { return true; }
  }
  return false;
}

async function loadGitignore(ignoreFile: string): Promise<IgnoreFile> {
  const contents = await fs.readFile(ignoreFile, { encoding: 'utf-8' });
  const lines = contents.split('\n').map(x => x.trim());

  const patterns: Pattern[] = [];
  for (const line of lines) {
    if (!line || line.startsWith('#')) { continue; }
    if (line.startsWith('!')) {
      patterns.push({ glob: line.substr(1), include: true });
    } else {
      patterns.push({ glob: line, include: false });
    }
  }

  return {
    dir: path.dirname(ignoreFile),
    patterns,
  };
}

interface IgnoreFile {
  dir: string;
  patterns: Pattern[];
}

interface Pattern {
  glob: string;
  include: boolean;
}