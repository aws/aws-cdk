export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
/* tslint:disable */
/* eslint-disable */
export interface ConditionalNull {
    path: string;
    condition: string;
    nullInTrue: boolean;
}

export interface ConditionalNullEntry {
    path: string;
    condition: string;
    nullInTrueBranch: boolean;
}

export interface DetailedDiagnostic {
    ruleId: string;
    severity: Severity;
    message: string;
    source: RuleOrigin;
    resourceId?: string;
    resourceType?: string;
    propertyPath?: string;
    suggestedFix?: string;
    category?: string;
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
    relatedResources?: RelatedResource[];
    conditionScenario?: Record<string, boolean> | undefined;
    documentationUrl?: string;
    ruleDescription?: string;
    phase?: Phase;
    section?: string;
    context?: ViolationContext;
}

export interface DetailedReport {
    filePath: string;
    status: ReportStatus;
    engineVersion: string;
    metadata: ReportMetadata;
    performance: PerformanceMetrics;
    diagnostics: DetailedDiagnostic[];
}

export interface DiagnosticCondition {
    expression?: string;
    deps?: string[];
    mutexWith?: string[];
}

export interface DiagnosticForEachExpansion {
    path: string;
    identifier: string;
    collection: string;
}

export interface DiagnosticImplication {
    antecedent: string;
    consequent: string;
}

export interface DiagnosticModel {
    template: DiagnosticTemplate;
    parameters: Record<string, JsonValue>;
    conditions: Record<string, DiagnosticCondition>;
    conditionParamRefs: string[];
    conditionImplications: DiagnosticImplication[];
    conditionMutexGroups: DiagnosticMutexGroup[];
    resourceConditionMap: Record<string, string>;
    mappings: JsonValue;
    resources: Record<string, DiagnosticResource>;
    outputs: Record<string, DiagnosticOutput>;
    edges: ReferenceEdge[];
    cycles: string[][];
    outputEmptyJoins: string[];
    samImplicitResources: string[];
    globalsParamRefs: string[];
    isCdk: boolean;
    parsedRules: DiagnosticRule[];
    resolutionSources: ResolutionSource[];
}

export interface DiagnosticMutexGroup {
    conditions: string[];
    parameter: string;
    values: string[];
}

export interface DiagnosticOutput {
    value: JsonValue;
    description: string | undefined;
    condition: string | undefined;
    exportName: JsonValue | undefined;
    getattRefs: GetAttRef[];
    conditionRefs: string[];
}

export interface DiagnosticResource {
    resourceType: string;
    condition: string | undefined;
    dependsOn: string[];
    deletionPolicy: JsonValue | undefined;
    updateReplacePolicy: JsonValue | undefined;
    creationPolicy: JsonValue | undefined;
    updatePolicy: JsonValue | undefined;
    properties: Record<string, JsonValue>;
    outgoingRefs: OutgoingRef[];
    incomingRefs: IncomingRef[];
    findInMapRefs: string[];
    simpleSubs: PathVariable[];
    redundantSubs: string[];
    emptyJoins: string[];
    hardcodedPartitionArns: string[];
    conditionallyNullProps: ConditionalNull[];
    conditionRefs: string[];
    forEachExpansions: DiagnosticForEachExpansion[];
    unsubstitutedVariables: PathVariable[];
    invalidRefs: PathTarget[];
}

export interface DiagnosticRule {
    name: string;
    condition: JsonValue | undefined;
    assertions: DiagnosticRuleAssertion[];
}

export interface DiagnosticRuleAssertion {
    assertExpr: JsonValue;
    assertDescription?: string;
}

export interface DiagnosticTemplate {
    formatVersion: string | undefined;
    description: string | undefined;
    transforms: string[];
}

export interface EngineConfig {
    customRules?: ExternalRuleSource[];
    guardRules?: ExternalRuleSource[];
}

export interface ExternalRuleSource {
    name: string;
    content: string;
}

export interface ForEachExpansion {
    propertyPath: string;
    identifier: string;
    collectionSource: string;
}

export interface GetAttRef {
    resource: string;
    attribute: string;
}

export interface IdRange {
    prefix: string;
    start: number;
    end: number;
}

export interface IncomingRef {
    source: string;
    sourcePath: string;
    kind: string;
    attr?: string;
}

export interface MapEntry {
    key: string;
    value: ResolvedValue;
}

export interface OutgoingRef {
    sourcePath: string;
    target: string;
    kind: string;
    attr?: string;
    conditionContext?: string;
}

export interface ParameterInfo {
    paramType: string;
    default: string | undefined;
    allowedValues: string[] | undefined;
    allowedPattern: string | undefined;
    minLength: number | undefined;
    maxLength: number | undefined;
    minValue: number | undefined;
    maxValue: number | undefined;
    description: string | undefined;
    noEcho: boolean;
}

export interface PathTarget {
    path: string;
    target: string;
}

export interface PathValuePair {
    path: string;
    value: string;
}

export interface PathVariable {
    path: string;
    variable: string;
}

export interface PerformanceMetrics {
    schemaInit: PhaseMetric;
    engineInit: PhaseMetric;
    modelBuild: PhaseMetric;
    schemaValidate: PhaseMetric;
    ruleEvaluation: PhaseMetric;
    diagnosticFinalize: PhaseMetric;
    validateTotal: PhaseMetric;
}

export interface PhaseMetric {
    durationMs: number;
}

export interface PseudoParameterOverrides {
    accountId: string | undefined;
    notificationArns: string | undefined;
    partition: string | undefined;
    region: string | undefined;
    stackId: string | undefined;
    stackName: string | undefined;
    urlSuffix: string | undefined;
}

export interface ReferenceEdge {
    source: string;
    sourcePath: string;
    target: string;
    kind: string;
    attr?: string;
    conditionContext?: string;
}

export interface RelatedResource {
    resource?: ResourceRef;
    location?: SourceSpan;
    message: string;
}

export interface ReportMetadata {
    rulesEvaluated?: number;
    resourcesScanned: number;
    counts: Summary;
    suppressed: number;
    strict: boolean;
    severityLevel: Severity;
}

export interface ResolutionSource {
    resourceId: string;
    propertyPath: string;
    source: string;
}

export interface ResolvedOutput {
    value: ResolvedValue;
    description: string | undefined;
    condition: string | undefined;
    exportName: ResolvedValue | undefined;
}

export interface ResolvedResource {
    logicalId: string;
    resourceType: string;
    condition: string | undefined;
    dependsOn: string[];
    deletionPolicy: ResolvedValue | undefined;
    updateReplacePolicy: ResolvedValue | undefined;
    updatePolicy: JsonValue | undefined;
    creationPolicy: JsonValue | undefined;
    metadata: JsonValue | undefined;
    properties: Record<string, ResolvedValue>;
    diagnostics: ResourceDiagnostics;
}

export interface ResourceDiagnostics {
    findInMapRefs: string[];
    simpleSubs: PathValuePair[];
    redundantSubs: string[];
    emptyJoins: string[];
    conditionRefs: string[];
    hardcodedPartitionArns: string[];
    conditionallyNullProps: ConditionalNullEntry[];
    foreachExpansions: ForEachExpansion[];
    unsubstitutedVariables: PathValuePair[];
    invalidRefs: PathValuePair[];
}

export interface ResourceIdFilter {
    ruleId: string;
    resourceId: string;
}

export interface ResourceRef {
    id?: string;
    resourceType?: string;
}

export interface ResourceTypeFilter {
    ruleId: string;
    resourceType: string;
}

export interface RuleFilterConfig {
    ids?: string[];
    categories?: string[];
    idRanges?: IdRange[];
    idPatterns?: string[];
    resourceIds?: ResourceIdFilter[];
    resourceTypes?: ResourceTypeFilter[];
}

export interface RuleInfo {
    id: string;
    severity: Severity;
    category?: string;
    description: string;
    origin: RuleOrigin;
}

export interface SourceSpan {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}

export interface StandardDiagnostic {
    ruleId: string;
    severity: Severity;
    message: string;
    source: RuleOrigin;
    resourceId?: string;
    resourceType?: string;
    propertyPath?: string;
    suggestedFix?: string;
    category?: string;
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
    relatedResources?: RelatedResource[];
    conditionScenario?: Record<string, boolean> | undefined;
}

export interface StandardReport {
    filePath: string;
    status: ReportStatus;
    engineVersion: string;
    metadata: ReportMetadata;
    performance: PerformanceMetrics;
    diagnostics: StandardDiagnostic[];
}

export interface Summary {
    fatal: number;
    errors: number;
    warnings: number;
    informational: number;
    debug: number;
}

export interface ValidateConfig {
    include?: RuleFilterConfig;
    exclude?: RuleFilterConfig;
    severityLevel?: Severity | undefined;
    parameterOverrides?: Record<string, string> | undefined;
    pseudoParameterOverrides?: PseudoParameterOverrides | undefined;
    strict?: boolean | undefined;
    includeEngineRules?: boolean | undefined;
}

export interface ViolationContext {
    actualValue?: JsonValue | undefined;
    expectedConstraint?: string;
    property?: string;
    lifecycle?: string;
    resolutionSource?: string;
    extra?: Record<string, JsonValue>;
}

export interface WasmSchemaValidationResult {
    diagnostics: StandardDiagnostic[];
    metric: PhaseMetric;
}

export type DetailLevel = 'STANDARD' | 'DETAILED';

export type EngineType = 'REGO' | 'CEL';

export type Phase = 'PARSE' | 'SCHEMA' | 'LINT';

export type RefKind = 'REF' | { GET_ATT: { attr: string } } | { SUB: { var: string } } | 'DEPENDS_ON';

export type ReportStatus = 'OK' | 'ERROR';

export type ResolvedValue =
    | { Concrete: { value: JsonValue } }
    | { List: { items: ResolvedValue[] } }
    | { Map: { entries: MapEntry[] } }
    | { Enum: { variants: ResolvedValue[] } }
    | { Conditional: { condition: string; if_true: ResolvedValue; if_false: ResolvedValue } }
    | { Reference: { target: string; kind: RefKind } }
    | { Dynamic: { reason: string } }
    | { TypedDynamic: { reason: string; param_type: string } };

export type RuleOrigin = 'SCHEMA' | 'CFN_LINT' | 'ENGINE' | 'CUSTOM' | 'GUARD';

export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export class WasmCelEngine {
    free(): void;
    [Symbol.dispose](): void;
    engineName(): string;
    listRules(): any;
    constructor(config: EngineConfig);
    validateDetailed(template: Uint8Array, options: ValidateConfig, file_path: string): any;
    validateStandard(template: Uint8Array, options: ValidateConfig, file_path: string): any;
}

export class WasmRegoEngine {
    free(): void;
    [Symbol.dispose](): void;
    engineName(): string;
    listRules(): any;
    constructor(config: EngineConfig);
    validateDetailed(template: Uint8Array, options: ValidateConfig, file_path: string): any;
    validateStandard(template: Uint8Array, options: ValidateConfig, file_path: string): any;
}

export class WasmSchemaValidator {
    free(): void;
    [Symbol.dispose](): void;
    listRules(): any;
    constructor();
    schemaCount(): number;
    validate(model: WasmSemanticModel, region: string): any;
}

export class WasmSemanticModel {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    conditions(): any;
    description(): string | undefined;
    formatVersion(): string | undefined;
    outputs(): any;
    parameters(): any;
    static parse(template: Uint8Array): WasmSemanticModel;
    resources(): any;
    sourceLocation(path: string): any;
    toDiagnosticModel(): any;
    transforms(): any;
}

export function init(): void;

export function version(): string;
