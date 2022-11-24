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
class L2Gen {
    constructor(cloudFormationResourceType) {
        this.cloudFormationResourceType = cloudFormationResourceType;
        this.l1Props = new value_1.ObjectLiteral();
        const resourceName = cloudFormationResourceType.split('::')[2];
        const className = codemaker_1.toPascalCase(resourceName);
        this.genClassName = `${className}Gen`;
        this.sourceFile = new source_module_1.SourceFile(generatable_1.fileFor(this.genClassName));
        this.props = new interfacetype_1.InterfaceTypeDefinition({
            typeName: `${this.genClassName}Props`,
            sourceFile: this.sourceFile,
        });
    }
    /**
     * Return a reference to the L1 type for the given property
     */
    static genTypeForProperty(typeName, ...propertyPath) {
        return cfn2ts_conventions_1.genTypeForProperty(typeName, ...propertyPath);
    }
    static define(typeName, cb) {
        const ret = new L2Gen(typeName);
        cb(ret);
        return ret;
    }
    addProperty(prop) {
        const ret = this.props.addInputProperty('props', prop);
        if (prop.wire) {
            this.wire({ [prop.wire]: ret });
        }
        return ret;
    }
    wire(props) {
        this.l1Props.set(props);
    }
    generateFiles() {
        const l1Type = cfn2ts_conventions_1.l1ResourceType(this.cloudFormationResourceType);
        const code = new cm2_1.CM2(this.sourceFile.fileName);
        const propsType = code.typeInThisFile(`${this.genClassName}Props`);
        code.add(this.props);
        code.openBlock(`export class ${this.genClassName} extends `, well_known_types_1.RESOURCE);
        code.openBlock('constructor(', new arguments_1.Arguments()
            .arg('scope', well_known_types_1.CONSTRUCT)
            .arg('id', well_known_types_1.STRING)
            .arg('props', propsType, { defaultValue: this.props.defaultValue }), ')');
        code.line('super(scope, id);');
        code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');
        code.closeBlock(); //ctor
        code.closeBlock(); // class
        return [code];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibDJnZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsMmdlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBc0Q7QUFDdEQseUNBQXlDO0FBQ3pDLCtCQUE0QjtBQUM1Qix5REFBaUU7QUFDakUsbUNBQWdEO0FBQ2hELG1EQUE2QztBQUM3QyxxRUFBc0g7QUFFdEgsMkRBQXFGO0FBQ3JGLDJDQUF3QztBQUd4QyxNQUFhLEtBQUs7SUFtQmhCLFlBQTRCLDBCQUFrQztRQUFsQywrQkFBMEIsR0FBMUIsMEJBQTBCLENBQVE7UUFKN0MsWUFBTyxHQUFHLElBQUkscUJBQWEsRUFBRSxDQUFDO1FBSzdDLE1BQU0sWUFBWSxHQUFHLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxNQUFNLFNBQVMsR0FBRyx3QkFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxTQUFTLEtBQUssQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksMEJBQVUsQ0FBQyxxQkFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSx1Q0FBdUIsQ0FBQztZQUN2QyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxPQUFPO1lBQ3JDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBN0JEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQWdCLEVBQUUsR0FBRyxZQUFzQjtRQUMxRSxPQUFPLHVDQUFrQixDQUFDLFFBQVEsRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWdCLEVBQUUsRUFBc0I7UUFDM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxL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