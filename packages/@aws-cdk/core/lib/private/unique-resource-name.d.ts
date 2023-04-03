/**
 * Options for creating a unique resource name.
*/
interface MakeUniqueResourceNameOptions {
    /**
     * The maximum length of the unique resource name.
     *
     * @default - 256
     */
    readonly maxLength?: number;
    /**
     * The separator used between the path components.
     *
     * @default - none
     */
    readonly separator?: string;
    /**
     * Non-alphanumeric characters allowed in the unique resource name.
     *
     * @default - none
     */
    readonly allowedSpecialCharacters?: string;
}
export declare function makeUniqueResourceName(components: string[], options: MakeUniqueResourceNameOptions): string;
export {};
