"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceTypeDefinition = void 0;
const cm2_1 = require("../cm2");
const type_1 = require("../type");
const value_1 = require("../value");
class InterfaceTypeDefinition {
    constructor(typeName, sourceFile, props = {}) {
        this.typeName = typeName;
        this.sourceFile = sourceFile;
        this.props = props;
        this.ifProps = new Array();
        this.addProperty(...props.properties ?? []);
        if (props.baseInterface && props.baseType) {
            throw new Error('Cannot supply baseInterface and baseType at the same time');
        }
        const baseType = props.baseType ?? props.baseInterface;
        this.declaration = {
            render: (code) => {
                code.openBlock('export interface ', this.typeName, ...baseType ? [' extends ', baseType] : []);
                for (const prop of this.ifProps) {
                    code.docBlock([
                        prop.summary,
                        '',
                        // FIXME: dedent
                        prop.details ?? '',
                        prop.defaultValue || prop.defaultDescription ? `@default ${prop.defaultValue ?? '-'} ${prop.defaultDescription}` : '',
                    ]);
                    code.line(`readonly ${prop.name}${prop.required ? '' : '?'}: `, prop.type, ';');
                }
                code.closeBlock();
            }
        };
    }
    get definingModule() {
        return this.sourceFile;
    }
    get typeRefName() {
        return this.typeName;
    }
    render(code) {
        if (this.props.automaticallyRender && code.currentModule.equals(this.sourceFile)) {
            code.addHelper(new cm2_1.RenderableHelper(this.typeName, this.props.automaticallyRender, this.declaration));
        }
        return type_1.standardTypeRender(this, code);
    }
    toString() {
        return this.typeName;
    }
    addProperty(...props) {
        this.ifProps.push(...props);
    }
    addInputProperty(propsVariable, prop) {
        if (!prop.required && !(prop.defaultValue || prop.defaultDescription)) {
            throw new Error('defaultValue or defaultDescription is required when required=false');
        }
        if (prop.required && (prop.defaultValue || prop.defaultDescription)) {
            throw new Error('defaultValue or defaultDescription may not be supplied when required=true');
        }
        this.addProperty(prop);
        return new PropertyValue(propsVariable, prop.name, prop.type, prop.defaultValue);
    }
    get allPropertiesOptional() {
        return this.ifProps.every(p => !p.required) && (!this.props.baseInterface || this.props.baseInterface.allPropertiesOptional);
    }
    get hasProps() {
        return this.ifProps.length > 0;
    }
    get defaultValue() {
        return this.allPropertiesOptional ? value_1.litVal('{}', this) : undefined;
    }
    toHelper(position) {
        return new cm2_1.RenderableHelper(this.typeName, position, this.declaration);
    }
    /**
     * Return a code file just for this type
     */
    toCM2() {
        const code = new cm2_1.CM2(this.sourceFile);
        code.add(this.declaration);
        return code;
    }
}
exports.InterfaceTypeDefinition = InterfaceTypeDefinition;
class PropertyValue {
    constructor(propsVariable, propName, type, defaultValue) {
        this.propsVariable = propsVariable;
        this.propName = propName;
        this.type = type;
        this.defaultValue = defaultValue;
    }
    render(code) {
        if (this.defaultValue) {
            code.add(`(${this.propsVariable}.${this.propName} ?? `, this.defaultValue, ')');
        }
        else {
            code.add(`${this.propsVariable}.${this.propName}`);
        }
    }
    toString() {
        return `${this.propsVariable}.${this.propName}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNldHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZmFjZXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0NBQTRFO0FBQzVFLGtDQUFvRDtBQUVwRCxvQ0FBMEM7QUFlMUMsTUFBYSx1QkFBdUI7SUFJbEMsWUFBNkIsUUFBZ0IsRUFBa0IsVUFBc0IsRUFBbUIsUUFBc0MsRUFBRTtRQUFuSCxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQWtCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBbUM7UUFIL0gsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFrQixDQUFDO1FBSXJELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztTQUM5RTtRQUVELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUV2RCxJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDL0YsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNaLElBQUksQ0FBQyxPQUFPO3dCQUNaLEVBQUU7d0JBQ0YsZ0JBQWdCO3dCQUNoQixJQUFJLENBQUMsT0FBTyxJ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