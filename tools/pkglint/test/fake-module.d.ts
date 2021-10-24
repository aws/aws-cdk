export interface FakeModuleProps {
    /**
     * The list of files to be created.
     * The key specifies the path of the file relative to the package directory including the file name.
     * If the value is a string, the string is written to the file. If object, the object is stringified
     * using `JSON.stringify()` and written into the file.
     */
    readonly files?: {
        [key: string]: string | {};
    };
}
export declare class FakeModule {
    private readonly props;
    private _tmpdir;
    private cleanedUp;
    constructor(props?: FakeModuleProps);
    tmpdir(): Promise<string>;
    cleanup(): Promise<void>;
}
