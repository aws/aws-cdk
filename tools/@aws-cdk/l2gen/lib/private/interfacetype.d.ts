import { IRenderable, CM2, HelperPosition, RenderableHelper } from '../cm2';
import { IType } from '../type';
import { SourceFile } from '../source-module';
import { IValue } from '../value';
export interface InterfaceTypeDefinitionProps {
    readonly properties?: InterfaceField[];
    /**
     * Renders the type only if its used
     */
    readonly automaticallyRender?: HelperPosition;
    readonly baseInterface?: InterfaceTypeDefinition;
    readonly baseType?: IType;
}
export declare class InterfaceTypeDefinition implements IType {
    private readonly typeName;
    readonly sourceFile: SourceFile;
    private readonly props;
    private readonly ifProps;
    readonly declaration: IRenderable;
    constructor(typeName: string, sourceFile: SourceFile, props?: InterfaceTypeDefinitionProps);
    get definingModule(): SourceFile;
    get typeRefName(): string;
    render(code: CM2): void;
    toString(): string;
    addProperty(...props: InterfaceField[]): void;
    addInputProperty(propsVariable: string, prop: InterfaceField): IValue;
    get allPropertiesOptional(): boolean;
    get hasProps(): boolean;
    get defaultValue(): IValue | undefined;
    toHelper(position: HelperPosition): RenderableHelper;
    /**
     * Return a code file just for this type
     */
    toCM2(): CM2;
}
export interface InterfaceField {
    readonly name: string;
    readonly type: IType;
    readonly summary: string;
    readonly details?: string;
    readonly required: boolean;
    readonly defaultValue?: IRenderable;
    readonly defaultDescription?: string;
}
