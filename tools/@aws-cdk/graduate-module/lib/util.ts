import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Minimal ANSI-colored logger. Graduation is a long, multi-step operation, so
 * clear phase/step framing in the terminal matters more than a logging library.
 */
export const log = {
  phase: (msg: string) => console.log(`\n\x1b[1m\x1b[36m▶ ${msg}\x1b[0m`),
  step: (msg: string) => console.log(`  \x1b[36m•\x1b[0m ${msg}`),
  info: (msg: string) => console.log(`    ${msg}`),
  warn: (msg: string) => console.log(`  \x1b[33m⚠ ${msg}\x1b[0m`),
  error: (msg: string) => console.log(`  \x1b[31m✖ ${msg}\x1b[0m`),
  ok: (msg: string) => console.log(`  \x1b[32m✔ ${msg}\x1b[0m`),
};

export interface ExecOptions {
  readonly cwd?: string;
  /** When true, a non-zero exit code does not throw — the result is returned instead. */
  readonly allowFailure?: boolean;
  /** When true, stdout/stderr are inherited (streamed to the terminal). */
  readonly stream?: boolean;
}

export interface ExecResult {
  readonly status: number;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Run a command synchronously. Used for the self-test build/lint commands.
 * Throws on failure unless `allowFailure` is set.
 */
export function exec(command: string, args: string[], options: ExecOptions = {}): ExecResult {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf-8',
    stdio: options.stream ? 'inherit' : 'pipe',
    // The repo's build tooling assumes a POSIX shell environment.
    shell: false,
  });

  const res: ExecResult = {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };

  if (res.status !== 0 && !options.allowFailure) {
    throw new Error(`command failed (exit ${res.status}): ${command} ${args.join(' ')}\n${res.stderr}`);
  }
  return res;
}

/** Recursively list files under `dir` matching an optional predicate. */
export function walk(dir: string, predicate?: (file: string) => boolean): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (!predicate || predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

/** Copy a file, creating parent directories as needed. */
export function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/** Move a directory (recursive copy + remove). Handles cross-device moves. */
export function moveDir(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  fs.rmSync(src, { recursive: true, force: true });
}

/**
 * Compute the module specifier (import path) that a file at `fromFile` should
 * use to reach `toTarget`, normalized to a POSIX-style relative import with a
 * leading `./` or `../` and no file extension.
 */
export function moduleSpecifier(fromFile: string, toTarget: string): string {
  let rel = path.relative(path.dirname(fromFile), toTarget);
  rel = rel.split(path.sep).join('/');
  if (!rel.startsWith('.')) {
    rel = `./${rel}`;
  }
  return rel.replace(/\.(ts|js|d\.ts)$/, '');
}
