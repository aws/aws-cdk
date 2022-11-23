"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2 = void 0;
const generatable_1 = require("./generatable");
const cm2_1 = require("./cm2");
const type_1 = require("./type");
const well_known_types_1 = require("./well-known-types");
const value_1 = require("./value");
const source_module_1 = require("./source-module");
class L2 {
    constructor(className) {
        this.className = className;
        this.props = new Array();
        this.l1Props = new value_1.ObjectLiteral();
    }
    static define(className, cb) {
        const ret = new L2(className);
        cb(ret);
        return ret;
    }
    addProperty(prop) {
        this.props.push(prop);
        const ret = new PropertyValue(prop.name, prop.type);
        if (prop.wire) {
            this.wire({ [prop.wire]: ret });
        }
        return ret;
    }
    wire(props) {
        this.l1Props.set(props);
    }
    generateFiles() {
        const genClass = `${this.className}Gen`;
        const l1Type = type_1.existingType(`Cfn${this.className}`, new source_module_1.SourceFile('./lib/wafv2.generated'));
        const code = new cm2_1.CM2(generatable_1.fileFor(genClass));
        const propsType = code.typeInThisFile(`${genClass}Props`);
        code.openBlock('export interface ', propsType);
        for (const prop of this.props) {
            code.docBlock([
                prop.summary,
                '',
                prop.details ?? '',
                prop.defaultValue || prop.defaultDescription ? `@default ${prop.defaultDescription}` : '',
            ]);
            code.line(`readonly ${prop.name}${prop.required ? '' : '?'}: `, prop.type, ';');
        }
        code.closeBlock();
        const allOptional = this.props.every(p => !p.required);
        code.openBlock(`export class ${genClass} extends `, well_known_types_1.RESOURCE);
        code.openBlock(`constructor(scope: `, well_known_types_1.CONSTRUCT, ', id: ', well_known_types_1.STRING, ', props: ', propsType, allOptional ? ' = {}' : '', ')');
        code.line('super(scope, id);');
        code.line('const resource = new ', l1Type, "(this, 'Resource', ", this.l1Props, ');');
        code.closeBlock(); //ctor
        code.closeBlock(); // class
        return [code];
    }
}
exports.L2 = L2;
class PropertyValue {
    constructor(propName, type) {
        this.propName = propName;
        this.type = type;
    }
    render(code) {
        code.write(`props.${this.propName}`);
    }
    toString() {
        return `props.${this.propName}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibDIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBc0Q7QUFDdEQsK0JBQTRCO0FBQzVCLGlDQUE2QztBQUM3Qyx5REFBaUU7QUFDakUsbUNBQWdEO0FBQ2hELG1EQUE2QztBQUU3QyxNQUFhLEVBQUU7SUFVYixZQUE0QixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBSDVCLFVBQUssR0FBRyxJQUFJLEtBQUssRUFBaUIsQ0FBQztRQUNuQyxZQUFPLEdBQUcsSUFBSSxxQkFBYSxFQUFFLENBQUM7SUFHL0MsQ0FBQztJQVZNLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBaUIsRUFBRSxFQUFtQjtRQUN6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDUixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFRTSxXQUFXLENBQUMsSUFBbUI7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDakM7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxJQUFJLENBQUMsS0FBNkI7UUFDdkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVNLGFBQWE7UUFDbEIsTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxL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