/**
 * Escapes a single argument for safe inclusion in a POSIX shell command.
 *
 * Every argument is single-quoted unconditionally (like Python's `shlex.quote`),
 * so any character that would otherwise have meaning to the shell is preserved
 * as a literal part of the value.
 */
export function posixShellEscape(arg: string): string {
  return "'" + arg.replace(/'/g, "'\\''") + "'";
}

/**
 * Escape only if the string contains dangerous characters for the shell.
 */
export function posixShellEscapeMinimal(arg: string): string {
  if (/[^a-zA-Z0-9_\/:=@+.,%-]/.test(arg)) {
    return posixShellEscape(arg);
  }
  return arg;
}

/**
 * Escape a single argument for safe inclusion in a PowerShell command.
 */
export function powershellEscape(arg: string): string {
  return "'" + arg.replace(/'/g, "''") + "'";
}

/**
 * Escape only if the string contains dangerous characters for the shell.
 */
export function powershellEscapeMinimal(arg: string): string {
  if (/[^a-zA-Z0-9_\/:=@+.,-]/.test(arg)) {
    return powershellEscape(arg);
  }
  return arg;
}
