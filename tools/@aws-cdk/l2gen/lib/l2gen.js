"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2Gen = void 0;
const generatable_1 = require("./generatable");
const codemaker_1 = require("codemaker");
const cm2_1 = require("./cm2");
const well_known_types_1 = require("./well-known-types");
const value_1 = require("./value");
const source_module_1 = require("./source-module");
const cfn2ts_conventions_1 = require("./private/cfn2ts-conventions");
const interfacetype_1 = require("./private/interfacetype");
const arguments_1 = require("./arguments");
const type_1 = require("./type");
const arns_1 = require("./private/arns");
const well_known_values_1 = require("./well-known-values");
const integrationtype_1 = require("./integrationtype");
class L2Gen {
    constructor(cloudFormationResourceType) {
        this.cloudFormationResourceType = cloudFormationResourceType;
        this.l1Props = new value_1.ObjectLiteral();
        this.interfaceProperties = new Array();
        this.statics = new Array();
        const resourceName = cloudFormationResourceType.split('::')[2];
        this.baseClassName = codemaker_1.toPascalCase(resourceName);
        this.genClassName = `${this.baseClassName}Gen`;
        this.sourceFile = new source_module_1.SourceFile(generatable_1.fileFor(this.genClassName, 'private'));
        this.baseProps = new interfacetype_1.InterfaceTypeDefinition(`${this.genClassName}PropsBase`, this.sourceFile);
        this.props = new interfacetype_1.InterfaceTypeDefinition(`${this.genClassName}Props`, this.sourceFile, { baseInterface: this.baseProps });
        this.interfaceType = new interfacetype_1.InterfaceTypeDefinition(`I${this.baseClassName}`, new source_module_1.SourceFile(generatable_1.fileFor(`I${this.baseClassName}`, 'public')), {
            baseType: well_known_types_1.IRESOURCE,
        });
        this.attributesType = new interfacetype_1.InterfaceTypeDefinition(`${this.baseClassName}Attributes`, new source_module_1.SourceFile(generatable_1.fileFor(`I${this.baseClassName}Attributes`, 'public')));
    }
    /**
     * Return a reference to the L1 type for the given property
     */
    static genTypeForProperty(typeName, ...propertyPath) {
        return cfn2ts_conventions_1.genTypeForProperty(typeName, ...propertyPath);
    }
    static genTypeForPropertyType(typeName, propertyTypeName) {
        return cfn2ts_conventions_1.genTypeForPropertyType(typeName, propertyTypeName);
    }
    static define(typeName, cb) {
        const ret = new L2Gen(typeName);
        cb(ret);
        return ret;
    }
    addProperty(prop) {
        const ret = this.baseProps.addInputProperty('props', prop);
        return integrationtype_1.maybeWire(this, prop, ret);
    }
    addPrivateProperty(prop) {
        const ret = this.props.addInputProperty('props', prop);
        return integrationtype_1.maybeWire(this, prop, ret);
    }
    addLazyPrivateProperty(prop) {
        if (prop.type !== type_1.STRING) {
            throw new Error('Not now Iago!');
        }
        const factory = this.props.addInputProperty('props', {
            name: `${prop.name}Producer`,
            required: prop.required,
            summary: prop.summary,
            details: prop.details,
            defaultDescription: prop.defaultDescription,
            type: well_known_types_1.factoryFunction(prop.type),
        });
        const producer = value_1.litVal([well_known_types_1.LAZY, '.string({ produce: ', factory, ' })'], prop.type);
        const lazyValue = prop.required === false ? value_1.litVal([factory, ' ? ', producer, ' : undefined'], prop.type) : producer;
        integrationtype_1.maybeWire(this, prop, lazyValue);
        return { factory, lazyValue };
    }
    wire(props) {
        this.l1Props.set(props);
    }
    interfaceProperty(props) {
        this.interfaceProperties.push(props);
        this.interfaceType.addProperty(props);
    }
    identification(ident) {
        this.interfaceProperty({
            ...ident.arnProperty,
            type: type_1.STRING,
            required: true,
        });
        for (const field of Object.values(ident.fields)) {
            this.interfaceProperty({
                ...field,
                type: type_1.STRING,
                required: true,
            });
            this.attributesType.addProperty({
                ...field,
                type: type_1.STRING,
                required: true,
            });
        }
        const arnFormat = arns_1.analyzeArnFormat(ident.arnFormat);
        // fromXxxAttributes
        this.statics.push({
            render: (code) => {
                code.block([`public static from${this.baseClassName}Attributes(scope: `, well_known_types_1.CONSTRUCT, ', id: ', type_1.STRING, ', attrs: ', this.attributesType, '): ', this.interfaceType], () => {
                    code.line('const stack = ', well_known_types_1.STACK, '.of(scope);');
                    code.line('return new class extends ', well_known_types_1.RESOURCE, ' implements ', this.interfaceType, ' {');
                    code.indent('  ');
                    const fmtExpr = arns_1.formatArnExpression(arnFormat, value_1.litVal('stack'), Object.fromEntries(Object.entries(ident.fields)
                        .map(([name, field]) => [name, value_1.litVal(['attrs.', field.name])])));
                    code.line('public readonly ', ident.arnProperty.name, ': ', type_1.STRING, ' = ', fmtExpr, ';');
                    for (const field of Object.values(ident.fields)) {
                        code.line('public readonly ', field.name, ': ', type_1.STRING, ' = attrs.', field.name, ';');
                    }
                    code.unindent();
                    code.line('}(scope, id);');
                });
            }
        });
        // fromXxxArn
        this.statics.push({
            render: (code) => {
                code.block([`public static from${this.baseClassName}Arn(scope: `, well_known_types_1.CONSTRUCT, ', id: ', type_1.STRING, ', arn: ', type_1.STRING, '): ', this.interfaceType], () => {
                    const { splitExpression, splitFields } = arns_1.splitArnExpression(arnFormat, value_1.litVal('arn'), value_1.litVal('parsedArn'));
                    code.line('const parsedArn = ', splitExpression);
                    code.line('return new class extends ', well_known_types_1.RESOURCE, ' implements ', this.interfaceType, ' {');
                    code.indent('  ');
                    code.line('public readonly ', ident.arnProperty.name, ': ', type_1.STRING, ' = arn;');
                    for (const [fieldName, field] of Object.entries(ident.fields)) {
                        code.line('public readonly ', field.name, ': ', type_1.STRING, ' = ', splitFields[fieldName], ';');
                    }
                    code.unindent();
                    code.line('}(scope, id, { environmentFromArn: arn });');
                });
            }
        });
    }
    generateFiles() {
        return [
            this.interfaceType.toCM2(),
            ...this.attributesType.hasProps ? [this.attributesType.toCM2()] : [],
            this.generateGenClassFile(),
        ];
    }
    generateGenClassFile() {
        const l1Type = cfn2ts_conventions_1.l1ResourceType(this.cloudFormationResourceType);
        const code = new cm2_1.CM2(this.sourceFile.fileName);
        const propsType = type_1.existingType(`${this.genClassName}Props`, this.sourceFile);
        code.docBlock(['@internal']);
        code.add(this.baseProps.declaration);
        code.add(this.props.declaration);
        code.docBlock(['@internal']);
        code.block([`export class ${this.genClassName} extends `, well_known_types_1.RESOURCE, ' implements ', this.interfaceType], () => {
            for (const stat of this.statics) {
                code.line(stat);
            }
            // Declare interface properties
            for (const prop of this.interfaceProperties) {
                code.line('public readonly ', prop.name, prop.required === false ? '?' : '', ': ', prop.type, ';');
            }
            code.block([
                'constructor(',
                new arguments_1.Arguments()
                    .arg('scope', well_known_types_1.CONSTRUCT)
                    .arg('id', type_1.STRING)
                    .arg('props', propsType, { defaultValue: this.props.defaultValue }),
                ')'
            ], () => {
                code.line('super(scope, id);');
                code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');
                // Fill interface properties
                for (const prop of this.interfaceProperties) {
                    const value = value_1.litVal(['resource.', prop.sourceProperty]);
                    code.line('this.', prop.name, ' = ', well_known_values_1.splitSelect('|', prop.splitSelect, value), ';');
                }
            });
        });
        return code;
    }
    diagnostics() {
        return [
            ...this.uncoveredPropDiagnostics(),
        ];
    }
    *uncoveredPropDiagnostics() {
        for (const [name, definition] of cfn2ts_conventions_1.resourceProperties(this.cloudFormationResourceType)) {
            const l1Name = cfn2ts_conventions_1.l1PropertyName(name);
            if (!this.l1Props.has(l1Name)) {
                yield {
                    type: 'uncovered-property',
                    cat: definition.Required ? 'error' : 'warning',
                    message: `Property ${l1Name}: not wired`,
                    property: l1Name,
                };
            }
        }
    }
}
exports.L2Gen = L2Gen;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibDJnZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsMmdlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBc0Q7QUFDdEQseUNBQXlDO0FBQ3pDLCtCQUF5QztBQUN6Qyx5REFBa0c7QUFDbEcsbUNBQXdEO0FBQ3hELG1EQUE2QztBQUM3QyxxRUFBOEk7QUFFOUksMkRBQWtGO0FBQ2xGLDJDQUF3QztBQUN4QyxpQ0FBcUQ7QUFDckQseUNBQTJGO0FBQzNGLDJEQUFrRDtBQUNsRCx1REFBNkQ7QUFFN0QsTUFBYSxLQUFLO0lBNkJoQixZQUE0QiwwQkFBa0M7UUFBbEMsK0JBQTBCLEdBQTFCLDBCQUEwQixDQUFRO1FBUDdDLFlBQU8sR0FBRyxJQUFJLHFCQUFhLEVBQUUsQ0FBQztRQUc5Qix3QkFBbUIsR0FBRyxJQUFJLEtBQUssRUFBMEIsQ0FBQztRQUMxRCxZQUFPLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUlsRCxNQUFNLFlBQVksR0FBRywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGFBQWEsR0FBRyx3QkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLDBCQUFVLENBQUMscUJBQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHVDQUF1QixDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksdUNBQXVCLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxPQUFPLEVBQUUsSUFBSSxDQUFDLFVB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