/**
 * Some construct-tree wide config we pass via context, because it's convenient.
 *
 * Users shouldn't touch these, and to make sure they don't we make sure the
 * context keys have an unguessable prefix that is different on each execution.
 */
export declare const PRIVATE_CONTEXT_DEFAULT_STACK_SYNTHESIZER: string;
