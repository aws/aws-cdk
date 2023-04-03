import { ConstructTree, ConstructTrace } from './construct-tree';
import * as report from '../report';
/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface PolicyViolationConstructAware extends report.PolicyViolationBeta1 {
    /**
     * The constructs violating this rule.
     */
    readonly violatingConstructs: ValidationViolatingConstruct[];
}
/**
 * Construct violating a specific rule.
 */
export interface ValidationViolatingConstruct extends report.PolicyViolatingResourceBeta1 {
    /**
     * The construct path as defined in the application.
     *
     * @default - construct path will be empty if the cli is not run with `--debug`
     */
    readonly constructPath?: string;
    /**
     * A stack of constructs that lead to the violation.
     *
     * @default - stack will be empty if the cli is not run with `--debug`
     */
    readonly constructStack?: ConstructTrace;
}
/**
 * JSON representation of the report.
 */
export interface PolicyValidationReportJson {
    /**
     * Report title.
     */
    readonly title: string;
    /**
     * Reports for all of the validation plugins registered
     * in the app
     */
    readonly pluginReports: PluginReportJson[];
}
/**
 * A report from a single plugin
 */
export interface PluginReportJson {
    /**
     * List of violations in the report.
     */
    readonly violations: PolicyViolationConstructAware[];
    /**
     * Report summary.
     */
    readonly summary: PolicyValidationReportSummary;
    /**
     * Plugin version.
     */
    readonly version?: string;
}
/**
 * Summary of the report.
 */
export interface PolicyValidationReportSummary {
    /**
     * The final status of the validation (pass/fail)
     */
    readonly status: report.PolicyValidationReportStatusBeta1;
    /**
     * The name of the plugin that created the report
     */
    readonly pluginName: string;
    /**
     * Additional metadata about the report. This property is intended
     * to be used by plugins to add additional information.
     *
     * @default - no metadata
     */
    readonly metadata?: {
        readonly [key: string]: string;
    };
}
/**
 * The report containing the name of the plugin that created it.
 */
export interface NamedValidationPluginReport extends report.PolicyValidationPluginReportBeta1 {
    /**
     * The name of the plugin that created the report
     */
    readonly pluginName: string;
}
/**
 * The report emitted by the plugin after evaluation.
 */
export declare class PolicyValidationReportFormatter {
    private readonly tree;
    private readonly reportTrace;
    constructor(tree: ConstructTree);
    formatPrettyPrinted(reps: NamedValidationPluginReport[]): string;
    formatJson(reps: NamedValidationPluginReport[]): PolicyValidationReportJson;
}
