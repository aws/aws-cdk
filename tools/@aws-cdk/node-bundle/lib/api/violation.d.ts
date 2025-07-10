/**
 * Violation types.
 */
export declare enum ViolationType {
    /**
     * Circular import on the package or one of its dependencies.
     */
    CIRCULAR_IMPORT = "circular-import",
    /**
     * Outdated attributions file.
     */
    OUTDATED_ATTRIBUTIONS = "outdated-attributions",
    /**
     * Missing notice file.
     */
    MISSING_NOTICE = "missing-notice",
    /**
     * Invalid license.
     */
    INVALID_LICENSE = "invalid-license",
    /**
     * No license.
     */
    NO_LICENSE = "no-license",
    /**
     * Multiple licenses.
     */
    MULTIPLE_LICENSE = "multiple-license",
    /**
     * Missing resource file.
     */
    MISSING_RESOURCE = "missing-resource"
}
/**
 * A validation violation.
 */
export interface Violation {
    /**
     * The violation type.
     */
    readonly type: ViolationType;
    /**
     * The violation message.
     */
    readonly message: string;
    /**
     * A fixer function.
     * If undefined, this violation cannot be fixed automatically.
     */
    readonly fix?: () => void;
}
/**
 * Report encapsulating a list of violations.
 */
export declare class ViolationsReport {
    private readonly _violations;
    constructor(_violations: Violation[]);
    /**
     * The list of violations.
     */
    get violations(): readonly Violation[];
    /**
     * True when no violations exist. False otherwise.
     */
    get success(): boolean;
    /**
     * Summary of the violation in the report.
     */
    get summary(): string;
}
