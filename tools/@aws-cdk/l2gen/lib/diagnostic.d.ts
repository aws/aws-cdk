export declare type DiagnosticCategory = 'error' | 'warning';
interface DiagnosticBase {
    readonly cat: DiagnosticCategory;
    readonly message: string;
}
export declare type Diagnostic = DiagnosticBase & ({
    readonly type: 'uncovered-property';
    readonly property: string;
} | {
    readonly type: 'other';
});
export declare function fmtDiagnostic(d: Diagnostic): string;
export {};
