"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alternative = exports.EnumClass = void 0;
const type_1 = require("./type");
const generatable_1 = require("./generatable");
const cm2_1 = require("./cm2");
const source_module_1 = require("./source-module");
const interfacetype_1 = require("./private/interfacetype");
const arguments_1 = require("./arguments");
const value_1 = require("./value");
const codemaker_1 = require("codemaker");
const integrationtype_1 = require("./integrationtype");
class EnumClass {
    constructor(className, props = {}) {
        this.className = className;
        this.props = props;
        this.alternatives = new Array();
        this._summary = new Array();
        this._details = new Array();
        this.typeRefName = className;
        this.definingModule = new source_module_1.SourceFile(generatable_1.fileFor(className, props.private ? 'private' : 'public'));
    }
    summary(summary) {
        this._summary.push(summary, '');
    }
    details(...lines) {
        this._details.push(...lines);
    }
    alternative(name, build) {
        const alt = new Alternative(this, name);
        build(alt);
        this.alternatives.push(alt);
        return this;
    }
    generateFiles() {
        const code = new cm2_1.CM2(this.definingModule.fileName);
        code.docBlock([
            ...this._summary,
            ...this._details,
        ]);
        code.openBlock('export abstract class ', this.typeRefName);
        for (const alt of this.alternatives) {
            code.add(alt.factoryMethod(this.props.typeCheckedReturnType));
        }
        code.line('public abstract render(): ', this.props.declaredReturnType ?? type_1.ANY, ';');
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
            type: this.props.declaredReturnType ?? type_1.ANY,
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
        this._summary = new Array();
        this._details = new Array();
        this.optionsType = new interfacetype_1.InterfaceTypeDefinition(`${codemaker_1.toPascalCase(this.name)}Options`, parent.definingModule, {
            automaticallyRender: 'bottom',
        });
    }
    summary(summary) {
        this._summary.push(summary, '');
    }
    details(...lines) {
        this._details.push(...lines);
    }
    positional(arg) {
        this.positionalArgs.arg(arg.name, arg.type, arg);
        return integrationtype_1.maybeWire(this, arg, value_1.litVal(arg.name));
    }
    option(opt) {
        const ret = this.optionsType.addInputProperty('options', opt);
        return integrationtype_1.maybeWire(this, opt, ret);
    }
    wire(props) {
        this.retVal.set(props);
    }
    factoryMethod(typeCheckedReturnType) {
        return {
            render: (code) => {
                const args = this.factoryArguments();
                code.docBlock([
                    ...this._summary,
                    ...this._details,
                    '',
                    ...args.docBlockLines()
                ]);
                code.block(['public static ', this.name, '(', args, '): ', this.parent], () => {
                    code.block(['return new class extends ', this.parent], () => {
                        code.block(['public render(): ', typeCheckedReturnType ?? type_1.ANY], () => {
                            code.line('return ', this.retVal, ';');
                        });
                    });
                });
            },
        };
    }
    factoryArguments() {
        const args = this.positionalArgs.copy();
        if (this.optionsType.hasProps) {
            args.arg('options', this.optionsType, {
                defaultValue: this.optionsType.defaultValue,
                summary: `Options for the ${this.name} method`,
            });
        }
        return args;
    }
}
exports.Alternative = Alternative;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bWNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW51bWNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUF3RDtBQUN4RCwrQ0FBc0Q7QUFDdEQsK0JBQXlDO0FBRXpDLG1EQUE2QztBQUM3QywyREFBa0Y7QUFDbEYsMkNBQXlEO0FBQ3pELG1DQUF3RDtBQUN4RCx5Q0FBeUM7QUFDekMsdURBQTZEO0FBUTdELE1BQWEsU0FBUztJQU9wQixZQUE0QixTQUFpQixFQUFtQixRQUF3QixFQUFFO1FBQTlELGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBcUI7UUFKekUsaUJBQVksR0FBRyxJQUFJLEtBQUssRUFBZSxDQUFDO1FBQ3hDLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQy9CLGFBQVEsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRzlDLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSwwQkFBVSxDQUFDLHFCQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQWU7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxPQUFPLENBQUMsR0FBRyxLQUFlO1FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBeUI7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUss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