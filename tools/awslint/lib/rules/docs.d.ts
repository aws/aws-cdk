import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
declare type DocsLinterContext = {
    readonly assembly: reflect.Assembly;
    readonly errorKey: string;
} & ({
    readonly kind: 'type';
    documentable: reflect.Type;
} | {
    readonly kind: 'interface-property';
    containingType: reflect.InterfaceType;
    documentable: reflect.Property;
} | {
    readonly kind: 'class-property';
    containingType: reflect.ClassType;
    documentable: reflect.Property;
} | {
    readonly kind: 'method';
    containingType: reflect.ReferenceType;
    documentable: reflect.Method;
} | {
    readonly kind: 'enum-member';
    containingType: reflect.EnumType;
    documentable: reflect.EnumMember;
});
export declare const docsLinter: Linter<DocsLinterContext>;
export {};
