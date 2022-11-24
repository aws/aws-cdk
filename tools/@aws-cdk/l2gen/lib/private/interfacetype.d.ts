import { IRenderable, CM2, HelperPosition, RenderableHelper } from '../cm2';
import { IType } from '../type';
import { SourceFile } from '../source-module';
import { IValue } from '../value';
export interface InterfaceTypeDefinitionProps {
    readonly typeName: string;
    readonly sourceFile: SourceFile;
    readonly properties?: InterfaceProperty[];
}
export declare class InterfaceTypeDefinition implements IRenderable {
    private readonly props;
    readonly typeReference: IType;
    private readonly ifProps;
    constructor(props: InterfaceTypeDefinitionProps);
    render(code: CM2): void;
    toString(): string;
    addProperty(...props: InterfaceProperty[]): void;
    addInputProperty(propsVariable: string, prop: InterfaceProperty): IValue;
    get allPropertiesOptional(): boolean;
    get hasProps(): boolean;
    get defaultValue(): IValue | undefined;
    toHelper(position: HelperPosition): RenderableHelper;
}
export interface InterfaceProperty {
    readonly name: string;
    readonly type: IType;
    readonly summary: string;
    readonly details?: string;
    readonly required: boolean;
    readonly defaultValue?: IValue;
    readonly defaultDescription?: string;
}
