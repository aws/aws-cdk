// -------------------------------------------------------------------------------------------
// GENERATED FROM packages/aws-cdk/lib/config.ts.
// Do not edit by hand; all changes will be overwritten at build time from the config file.
// -------------------------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/comma-dangle, comma-spacing, max-len, quotes, quote-props */
/**
 * @struct
 */
export interface CliConfigType {
  readonly _: Array<string>;

  readonly globalOptions?: GlobalOptions;

  readonly list?: ListOptions;

  readonly synthesize?: SynthesizeOptions;

  readonly bootstrap?: BootstrapOptions;

  readonly gc?: GcOptions;

  readonly deploy?: DeployOptions;

  readonly rollback?: RollbackOptions;

  readonly import?: ImportOptions;

  readonly watch?: WatchOptions;

  readonly destroy?: DestroyOptions;

  readonly diff?: DiffOptions;

  readonly metadata?: MetadataOptions;

  readonly acknowledge?: AcknowledgeOptions;

  readonly notices?: NoticesOptions;

  readonly init?: InitOptions;

  readonly migrate?: MigrateOptions;

  readonly context?: ContextOptions;

  readonly docs?: DocsOptions;

  readonly doctor?: DoctorOptions;
}

/**
 * @struct
 */
export interface GlobalOptions {
  readonly app?: string;

  readonly build?: string;

  readonly context?: Array<string>;

  readonly plugin?: Array<string>;

  readonly trace?: boolean;

  readonly strict?: boolean;

  readonly lookups?: boolean;

  readonly 'ignore-errors'?: boolean;

  readonly json?: boolean;

  readonly verbose?: boolean;

  readonly debug?: boolean;

  readonly profile?: string;

  readonly proxy?: string;

  readonly 'ca-bundle-path'?: string;

  readonly ec2creds?: boolean;

  readonly 'version-reporting'?: boolean;

  readonly 'path-metadata'?: boolean;

  readonly 'asset-metadata'?: boolean;

  readonly 'role-arn'?: string;

  readonly staging?: boolean;

  readonly output?: string;

  readonly notices?: boolean;

  readonly 'no-color'?: boolean;

  readonly ci?: boolean;

  readonly unstable?: Array<string>;
}

/**
 * @struct
 */
export interface ListOptions {
  readonly long?: boolean;

  readonly 'show-dependencies'?: boolean;
}

/**
 * @struct
 */
export interface SynthesizeOptions {
  readonly exclusively?: boolean;

  readonly validation?: boolean;

  readonly quiet?: boolean;
}

/**
 * @struct
 */
export interface BootstrapOptions {
  readonly 'bootstrap-bucket-name'?: string;

  readonly 'bootstrap-kms-key-id'?: string;

  readonly 'example-permissions-boundary'?: boolean;

  readonly 'custom-permissions-boundary'?: string;

  readonly 'bootstrap-customer-key'?: boolean;

  readonly qualifier?: string;

  readonly 'public-access-block-configuration'?: boolean;

  readonly tags?: Array<string>;

  readonly execute?: boolean;

  readonly trust?: Array<string>;

  readonly 'trust-for-lookup'?: Array<string>;

  readonly 'cloudformation-execution-policies'?: Array<string>;

  readonly force?: boolean;

  readonly 'termination-protection'?: boolean;

  readonly 'show-template'?: boolean;

  readonly 'toolkit-stack-name'?: string;

  readonly template?: string;

  readonly 'previous-parameters'?: boolean;
}

/**
 * @struct
 */
export interface GcOptions {
  readonly action?: string;

  readonly type?: string;

  readonly 'rollback-buffer-days'?: number;

  readonly 'created-buffer-days'?: number;

  readonly confirm?: boolean;

  readonly 'bootstrap-stack-name'?: string;
}

/**
 * @struct
 */
export interface DeployOptions {
  readonly all?: boolean;

  readonly 'build-exclude'?: Array<string>;

  readonly exclusively?: boolean;

  readonly 'require-approval'?: string;

  readonly 'notification-arns'?: Array<string>;

  readonly tags?: Array<string>;

  readonly execute?: boolean;

  readonly 'change-set-name'?: string;

  readonly method?: string;

  readonly force?: boolean;

  readonly parameters?: Array<string>;

  readonly 'outputs-file'?: string;

  readonly 'previous-parameters'?: boolean;

  readonly 'toolkit-stack-name'?: string;

  readonly progress?: string;

  readonly rollback?: boolean;

  readonly hotswap?: boolean;

  readonly 'hotswap-fallback'?: boolean;

  readonly watch?: boolean;

  readonly logs?: boolean;

  readonly concurrency?: number;

  readonly 'asset-parallelism'?: boolean;

  readonly 'asset-prebuild'?: boolean;

  readonly 'ignore-no-stacks'?: boolean;
}

/**
 * @struct
 */
export interface RollbackOptions {
  readonly all?: boolean;

  readonly 'toolkit-stack-name'?: string;

  readonly force?: boolean;

  readonly 'validate-bootstrap-version'?: boolean;

  readonly orphan?: Array<string>;
}

/**
 * @struct
 */
export interface ImportOptions {
  readonly execute?: boolean;

  readonly 'change-set-name'?: string;

  readonly 'toolkit-stack-name'?: string;

  readonly rollback?: boolean;

  readonly force?: boolean;

  readonly 'record-resource-mapping'?: string;

  readonly 'resource-mapping'?: string;
}

/**
 * @struct
 */
export interface WatchOptions {
  readonly 'build-exclude'?: Array<string>;

  readonly exclusively?: boolean;

  readonly 'change-set-name'?: string;

  readonly force?: boolean;

  readonly 'toolkit-stack-name'?: string;

  readonly progress?: string;

  readonly rollback?: boolean;

  readonly hotswap?: boolean;

  readonly 'hotswap-fallback'?: boolean;

  readonly logs?: boolean;

  readonly concurrency?: number;
}

/**
 * @struct
 */
export interface DestroyOptions {
  readonly all?: boolean;

  readonly exclusively?: boolean;

  readonly force?: boolean;
}

/**
 * @struct
 */
export interface DiffOptions {
  readonly exclusively?: boolean;

  readonly 'context-lines'?: number;

  readonly template?: string;

  readonly strict?: boolean;

  readonly 'security-only'?: boolean;

  readonly fail?: boolean;

  readonly processed?: boolean;

  readonly quiet?: boolean;

  readonly 'change-set'?: boolean;
}

/**
 * @struct
 */
export interface MetadataOptions {}

/**
 * @struct
 */
export interface AcknowledgeOptions {}

/**
 * @struct
 */
export interface NoticesOptions {
  readonly unacknowledged?: boolean;
}

/**
 * @struct
 */
export interface InitOptions {
  readonly language?: string;

  readonly list?: boolean;

  readonly 'generate-only'?: boolean;
}

/**
 * @struct
 */
export interface MigrateOptions {
  readonly 'stack-name'?: string;

  readonly language?: string;

  readonly account?: string;

  readonly region?: string;

  readonly 'from-path'?: string;

  readonly 'from-stack'?: boolean;

  readonly 'output-path'?: string;

  readonly 'from-scan'?: string;

  readonly filter?: Array<string>;

  readonly compress?: boolean;
}

/**
 * @struct
 */
export interface ContextOptions {
  readonly reset?: string;

  readonly force?: boolean;

  readonly clear?: boolean;
}

/**
 * @struct
 */
export interface DocsOptions {
  readonly browser?: string;
}

/**
 * @struct
 */
export interface DoctorOptions {}
