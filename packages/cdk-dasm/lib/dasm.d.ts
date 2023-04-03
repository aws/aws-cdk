export interface DisassemblerOptions {
    /**
     * Include a timestamp in the generated output.
     *
     * @default true
     */
    readonly timestamp?: boolean;
}
export declare function dasmTypeScript(template: Template, options?: DisassemblerOptions): Promise<string>;
interface Template {
    Resources: {
        [id: string]: Resource;
    };
}
interface Resource {
    Type: string;
    Properties?: {
        [prop: string]: any;
    };
}
export {};
