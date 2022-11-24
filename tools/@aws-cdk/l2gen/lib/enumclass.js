"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alternative = exports.EnumClass = void 0;
const type_1 = require("./type");
const generatable_1 = require("./generatable");
const cm2_1 = require("./cm2");
const source_module_1 = require("./source-module");
const interfacetype_1 = require("./private/interfacetype");
const well_known_types_1 = require("./well-known-types");
const arguments_1 = require("./arguments");
const value_1 = require("./value");
const well_known_values_1 = require("./well-known-values");
const codemaker_1 = require("codemaker");
class EnumClass {
    constructor(className, props = {}) {
        this.className = className;
        this.props = props;
        this.alternatives = new Array();
        this.typeRefName = className;
        this.definingModule = new source_module_1.SourceFile(generatable_1.fileFor(className));
    }
    alternative(name, build) {
        const alt = new Alternative(this, name);
        build(alt);
        this.alternatives.push(alt);
        return this;
    }
    generateFiles() {
        const code = new cm2_1.CM2(this.definingModule.fileName);
        // FIXME: DocBlock
        code.openBlock('export abstract class ', this.typeRefName);
        for (const alt of this.alternatives) {
            code.add(alt.factoryMethod(this.props.typeCheckedReturnType));
        }
        code.line('public abstract render(): ', this.props.declaredReturnType ?? well_known_types_1.ANY, ';');
        code.closeBlock();
        return [code];
    }
    diagnostics() {
        return [];
    }
    render(code) {
        return type_1.standardTypeRender(this, code);
    }
    unfold(v) {
        return {
            type: this.props.declaredReturnType ?? well_known_types_1.ANY,
            render: (code) => {
                code.add(v, '.render()');
            },
            toString: () => v.toString(),
        };
    }
    toString() {
        return this.className;
    }
}
exports.EnumClass = EnumClass;
class Alternative {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.positionalArgs = new arguments_1.Arguments();
        this.retVal = new value_1.ObjectLiteral();
        this.optionsType = new interfacetype_1.InterfaceTypeDefinition({
            typeName: `${codemaker_1.toPascalCase(this.name)}Options`,
            sourceFile: parent.definingModule,
        });
    }
    positional(name, type, options = {}) {
        this.positionalArgs.arg(name, type, options);
        return well_known_values_1.literalValue(name);
    }
    option(opt) {
        return this.optionsType.addInputProperty('options', opt);
    }
    wire(props) {
        this.retVal.set(props);
    }
    factoryMethod(typeCheckedReturnType) {
        return {
            render: (code) => {
                const args = this.positionalArgs.copy();
                if (this.optionsType.hasProps) {
                    code.addHelper(this.optionsType.toHelper('bottom'));
                    args.arg('options', this.optionsType.typeReference, { defaultValue: this.optionsType.defaultValue });
                }
                code.block(['public static ', this.name, '(', args, '): ', this.parent], () => {
                    code.block(['return new class extends ', this.parent], () => {
                        code.block(['public render(): ', typeCheckedReturnType ?? well_known_types_1.ANY], () => {
                            code.line('return ', this.retVal, ';');
                        });
                    });
                });
            },
        };
    }
}
exports.Alternative = Alternative;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bWNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW51bWNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFtRDtBQUNuRCwrQ0FBc0Q7QUFDdEQsK0JBQXlDO0FBRXpDLG1EQUE2QztBQUM3QywyREFBcUY7QUFDckYseURBQXlDO0FBQ3pDLDJDQUF5RDtBQUN6RCxtQ0FBZ0Q7QUFDaEQsMkRBQW1EO0FBQ25ELHlDQUF5QztBQU96QyxNQUFhLFNBQVM7SUFLcEIsWUFBNEIsU0FBaUIsRUFBbUIsUUFBd0IsRUFBRTtRQUE5RCxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQXFCO1FBRnpFLGlCQUFZLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUd2RCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksMEJBQVUsQ0FBQyxxQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBeUI7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLFNBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5ELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUzRCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7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