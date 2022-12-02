import { SourceFile, ISourceModule } from './source-module';
export declare type CodePart = string | IRenderable;
export declare type HelperPosition = 'top' | 'bottom';
export declare class CM2 {
    readonly currentModule: SourceFile;
    private readonly buffer;
    private readonly indents;
    private readonly helpers;
    private pendingIndent;
    private delegateHelpers?;
    constructor(fileName: string | SourceFile);
    render(): string;
    save(): void;
    add(...xs: Array<CodePart>): void;
    line(...xs: Array<CodePart>): void;
    write(x: string): void;
    addHelper(helper: IHelper): void;
    openBlock(...xs: CodePart[]): void;
    closeBlock(): void;
    block(xs: CodePart | CodePart[], cb: () => void): void;
    docBlock(lines: string[]): void;
    indent(add: string): void;
    unindent(): void;
    relativeImportName(fileName: string): string;
    private get currentIndent();
    private flushPendingIndent;
    /**
     * Render all helpers at least once so we transitively collect all helpers of helpers
     */
    private dummyRenderHelpers;
    private renderHelpers;
}
export interface IRenderable {
    render(code: CM2): void;
}
export interface IHelper extends IRenderable {
    readonly position: HelperPosition;
    readonly helperKey: string;
    absorb(other: this): void;
}
export declare class SymbolImport implements IHelper {
    readonly module: ISourceModule;
    readonly position = "top";
    readonly helperKey: string;
    private readonly symbols;
    constructor(symbolName: string, module: ISourceModule);
    render(code: CM2): void;
    absorb(other: SymbolImport): void;
}
export declare class HelperFunction implements IHelper {
    readonly functionName: string;
    private readonly block;
    readonly position = "bottom";
    readonly helperKey: string;
    constructor(functionName: string, block: (x: CM2) => void);
    render(code: CM2): void;
    absorb(): void;
}
export declare class RenderableHelper implements IHelper {
    readonly helperKey: string;
    readonly position: HelperPosition;
    private readonly renderable;
    constructor(helperKey: string, position: HelperPosition, renderable: IRenderable);
    render(code: CM2): void;
    absorb(): void;
}
export declare function interleave(sep: CodePart, xs: Array<CodePart | CodePart[]>): CodePart[];
