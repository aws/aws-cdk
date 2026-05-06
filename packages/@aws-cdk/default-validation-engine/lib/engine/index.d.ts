import type {
    DetailedReport,
    DiagnosticModel,
    EngineConfig,
    ParameterInfo,
    ResolvedOutput,
    ResolvedResource,
    RuleInfo,
    SourceSpan,
    StandardDiagnostic,
    StandardReport,
    ValidateConfig,
} from './bindings_wasm';
export type {
    Severity,
    DetailLevel,
    RuleOrigin,
    IdRange,
    ResourceIdFilter,
    ResourceTypeFilter,
    RuleFilterConfig,
    RuleInfo,
    SourceSpan,
    ResourceRef,
    RelatedResource,
    ViolationContext,
    StandardDiagnostic,
    DetailedDiagnostic,
    PhaseMetric,
    PerformanceMetrics,
    Summary,
    ReportMetadata,
    StandardReport,
    DetailedReport,
    PseudoParameterOverrides,
    EngineConfig,
    ValidateConfig,
    ExternalRuleSource,
    ResolvedValue,
    RefKind,
    ParameterInfo,
    ResolvedResource,
    ResolvedOutput,
    ForEachExpansion,
    ResourceDiagnostics,
    MapEntry,
    PathValuePair,
    ConditionalNull,
    ConditionalNullEntry,
    DiagnosticModel,
    DiagnosticTemplate,
    DiagnosticCondition,
    DiagnosticImplication,
    DiagnosticMutexGroup,
    ReferenceEdge,
    OutgoingRef,
    IncomingRef,
    DiagnosticResource,
    PathVariable,
    DiagnosticForEachExpansion,
    PathTarget,
    GetAttRef,
    DiagnosticOutput,
    DiagnosticRule,
    DiagnosticRuleAssertion,
    ResolutionSource,
} from './bindings_wasm';
export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | {
          [key: string]: JsonValue;
      };
export interface Engine {
    validateStandard(template: TemplateFile, config?: ValidateConfig): StandardReport;
    validateDetailed(template: TemplateFile, config?: ValidateConfig): DetailedReport;
    listRules(): RuleInfo[];
    engineName(): string;
    free(): void;
}
export declare class TemplateFile {
    readonly path: string;
    constructor(path: string);
    readBytes(): Uint8Array;
}
export declare class TemplateModel {
    private readonly inner;
    constructor(template: TemplateFile);
    resources(): Record<string, ResolvedResource>;
    parameters(): Record<string, ParameterInfo>;
    outputs(): Record<string, ResolvedOutput>;
    conditions(): string[];
    transforms(): string[];
    formatVersion(): string | undefined;
    description(): string | undefined;
    toDiagnosticModel(): DiagnosticModel;
    sourceLocation(path: string): SourceSpan | null;
    free(): void;
}
export declare class SchemaValidator {
    private readonly inner;
    listRules(): RuleInfo[];
    schemaCount(): number;
    validate(template: TemplateFile, region?: string): StandardDiagnostic[];
    free(): void;
}
export declare const RegoEngine: new (config?: EngineConfig) => Engine;
export declare const CelEngine: new (config?: EngineConfig) => Engine;
export declare function version(): string;
