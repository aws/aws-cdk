/**
 * Generate default prop sets for canned metric
 *
 * We don't generate `cloudwatch.Metric` objects directly (because we can't
 * guarantee that all packages already properly depend on
 * `@aws-cdk/aws-cloudwatch`).
 *
 * Instead, we generate functions that return the set of properties that should
 * be passed to a `cloudwatch.Metric` to construct it.
 *
 * ----------------------------------------------------------
 *
 * Generates code similar to the following:
 *
 * ```
 * export class <Namespace>Metrics {
 *   public static <metric><statistic>(<dimensions>): Props {
 *     // ...
 *   }
 * }
 * ```
 */
export declare class CannedMetricsGenerator {
    private readonly namespace;
    readonly outputFile: string;
    private readonly code;
    constructor(moduleName: string, namespace: string);
    generate(): boolean;
    /**
     * Saves the generated file.
     */
    save(dir: string): Promise<string[]>;
    private functionName;
    private emitTypeDef;
}
