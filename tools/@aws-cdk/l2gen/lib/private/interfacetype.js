"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceTypeDefinition = void 0;
const cm2_1 = require("../cm2");
const type_1 = require("../type");
const well_known_values_1 = require("../well-known-values");
class InterfaceTypeDefinition {
    constructor(props) {
        this.props = props;
        this.ifProps = new Array();
        this.addProperty(...props.properties ?? []);
        this.typeReference = type_1.existingType(props.typeName, props.sourceFile);
    }
    render(code) {
        code.openBlock('export interface ', this.props.typeName);
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
    toString() {
        return this.props.typeName;
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
        return this.ifProps.every(p => !p.required);
    }
    get hasProps() {
        return this.ifProps.length > 0;
    }
    get defaultValue() {
        return this.allPropertiesOptional ? well_known_values_1.literalValue('{}', this.typeReference) : undefined;
    }
    toHelper(position) {
        return new cm2_1.RenderableHelper(this.props.typeName, position, this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNldHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVyZmFjZXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0NBQTRFO0FBQzVFLGtDQUE4QztBQUc5Qyw0REFBb0Q7QUFRcEQsTUFBYSx1QkFBdUI7SUFJbEMsWUFBNkIsS0FBbUM7UUFBbkMsVUFBSyxHQUFMLEtBQUssQ0FBOEI7UUFGL0MsWUFBTyxHQUFHLElBQUksS0FBSyxFQUFxQixDQUFDO1FBR3hELElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxhQUFhLEdBQUcsbUJBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQVM7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLElBQUksQ0FBQyxPQUFPO2dCQUNaLEVBQUU7Z0JBQ0YsZ0JBQWdCO2dCQUNoQixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBRSxZQUFZLElBQUksQ0FBQyxZQUFZLElBQUksR0FBSSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3hILENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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