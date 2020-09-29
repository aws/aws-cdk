import { Linter } from '../linter';
import { Attribute, ResourceReflection } from './resource';
export declare const attributesLinter: Linter<AttributeReflection>;
declare class AttributeReflection {
    readonly resource: ResourceReflection;
    readonly attr: Attribute;
    readonly fqn: string;
    constructor(resource: ResourceReflection, attr: Attribute);
}
export {};
