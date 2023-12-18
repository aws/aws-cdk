import { DefaultCdkOptions } from './common';
/**
 * Options to use with cdk destroy
 */
export interface DestroyOptions extends DefaultCdkOptions {
    /**
     * Do not ask for permission before destroying stacks
     *
     * @default false
     */
    readonly force?: boolean;
    /**
     * Only destroy the given stack
     *
     * @default false
     */
    readonly exclusively?: boolean;
}
