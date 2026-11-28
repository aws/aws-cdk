/**
 * `Exclude` / `Include` filtering.
 *
 * Patterns are globs, evaluated against each candidate's **key path relative to the
 * destination prefix**, and the last matching pattern wins. Because the request carries two
 * separate arrays, every `Exclude` is evaluated before every `Include`, so an `Include`
 * always beats an overlapping `Exclude` — the relative order a caller writes them in cannot
 * be expressed.
 *
 * The same filter chain decides what gets deployed and what gets pruned, which is what
 * makes `Exclude` the supported way to protect destination-only content.
 */

/** A compiled filter chain. */
export interface Filters {
  /** Whether a relative key path survives the chain. */
  accepts(relativePath: string): boolean;
}

/** The chain that accepts everything, used when neither property is given. */
const ACCEPT_ALL: Filters = { accepts: () => true };

/**
 * Compile `Exclude` and `Include` into a filter chain.
 *
 * Patterns use the shell-glob vocabulary the AWS CLI's `--exclude`/`--include` accept:
 * `*` (any run of characters, **including** `/`), `?` (one character), and `[...]`
 * character classes with an optional leading `!` or `^` for negation.
 */
export function compileFilters(exclude: string[], include: string[]): Filters {
  if (exclude.length === 0 && include.length === 0) { return ACCEPT_ALL; }

  const chain = [
    ...exclude.map((pattern) => ({ accept: false, regex: globToRegExp(pattern) })),
    ...include.map((pattern) => ({ accept: true, regex: globToRegExp(pattern) })),
  ];

  return {
    accepts(relativePath: string): boolean {
      // Start from "included", then let each matching rule overwrite the verdict. Last
      // match wins.
      let accepted = true;
      for (const rule of chain) {
        if (rule.regex.test(relativePath)) {
          accepted = rule.accept;
        }
      }
      return accepted;
    },
  };
}

/**
 * Translate one glob into an anchored regular expression.
 *
 * Note `*` maps to `.*` rather than "anything but a separator": that is what the CLI's
 * `fnmatch`-style matching does, and it is why `*.log` also excludes `deep/c.log`.
 */
export function globToRegExp(pattern: string): RegExp {
  let source = '';

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    switch (char) {
      case '*':
        source += '.*';
        break;
      case '?':
        source += '.';
        break;
      case '[': {
        const closing = pattern.indexOf(']', i + 1);
        if (closing < 0) {
          // An unterminated class is a literal `[`, matching shell behavior.
          source += '\\[';
          break;
        }
        let body = pattern.slice(i + 1, closing);
        let negated = false;
        if (body.startsWith('!') || body.startsWith('^')) {
          negated = true;
          body = body.slice(1);
        }
        // Escape only the characters that would change a character class's meaning.
        source += `[${negated ? '^' : ''}${body.replace(/[\\\]^]/g, '\\$&')}]`;
        i = closing;
        break;
      }
      default:
        source += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        break;
    }
  }

  return new RegExp(`^${source}$`);
}
