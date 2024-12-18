import { Expression, ExternalModule } from '@cdklabs/typewriter';
import { CliConfig } from './yargs-types';
export declare class CliHelpers extends ExternalModule {
    readonly browserForPlatform: import("@cdklabs/typewriter").ExpressionProxy<Expression>;
    readonly cliVersion: import("@cdklabs/typewriter").ExpressionProxy<Expression>;
    readonly isCI: import("@cdklabs/typewriter").ExpressionProxy<Expression>;
    readonly yargsNegativeAlias: import("@cdklabs/typewriter").ExpressionProxy<Expression>;
}
export declare function renderYargs(config: CliConfig, helpers: CliHelpers): Promise<string>;
