export type DiagnosticCategory = 'error' | 'warning';

interface DiagnosticBase {
  readonly cat: DiagnosticCategory;
  readonly message: string;
}

export type Diagnostic = DiagnosticBase & (
  | { readonly type: 'uncovered-property'; readonly property: string; }
  | { readonly type: 'other'; }
);

export function fmtDiagnostic(d: Diagnostic) {
  return `${catTag(d.cat)} ${d.message}`;
}

function catTag(x: DiagnosticCategory): string {
  switch (x) {
    case 'error':   return ' [error] ';
    case 'warning': return '[warning]';

  }
}