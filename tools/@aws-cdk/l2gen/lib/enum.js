"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumMapping = exports.Enum = void 0;
const generatable_1 = require("./generatable");
const type_1 = require("./type");
const cm2_1 = require("./cm2");
const source_module_1 = require("./source-module");
const codemaker_1 = require("codemaker");
const well_known_values_1 = require("./well-known-values");
class Enum {
    constructor(enumName) {
        this.enumName = enumName;
        this.members = new Array();
        this.mappings = new Array();
        this.typeRefName = enumName;
        this.definingModule = new source_module_1.SourceFile(generatable_1.fileFor(this.typeRefName, 'public'));
    }
    addMember(props) {
        if (this.members.length && !!this.members[0].cloudFormationString !== !!props.cloudFormationString) {
            throw new Error('Either all enum members must have a cloudFormationString, or none of them should');
        }
        this.members.push(props);
        const value = {
            type: this,
            toString: () => {
                return `${this.typeRefName}.${props.name}`;
            },
            render: (code) => {
                code.add(this, '.', props.name);
            }
        };
        if (props.cloudFormationString) {
            if (!this.cloudFormationMapping) {
                this.cloudFormationMapping = new EnumMapping(codemaker_1.toCamelCase(`${this.enumName}ToCloudFormation`));
                this.mappings.push(this.cloudFormationMapping);
            }
            this.cloudFormationMapping.addMapping(value, well_known_values_1.jsVal(props.cloudFormationString));
        }
        return value;
    }
    toCloudFormation(value) {
        if (!this.cloudFormationMapping?.hasValues) {
            throw new Error('No CloudFormation mappings defined');
        }
        return this.cloudFormationMapping.map(value);
    }
    generateFiles() {
        const code = new cm2_1.CM2(this.definingModule.fileName);
        code.openBlock(`export enum ${this.enumName}`);
        for (const mem of this.members) {
            code.docBlock([
                mem.summary,
                '',
                mem.details ?? '',
            ]);
            code.line(`${mem.name} = \'${this.enumName}.${mem.name}\',`);
        }
        code.closeBlock();
        return [code, ...this.mappings.flatMap(m => m.generateFiles())];
    }
    render(code) {
        return type_1.standardTypeRender(this, code);
    }
    diagnostics() {
        return [];
    }
}
exports.Enum = Enum;
class EnumMapping {
    constructor(functionName) {
        this.functionName = functionName;
        this.mapping = new Array();
        this.sourceFile = new source_module_1.SourceFile(generatable_1.fileFor(this.functionName, 'private'));
    }
    get hasValues() {
        return this.mapping.length > 0;
    }
    addMapping(from, to) {
        if (this.fromType && from.type !== this.fromType) {
            throw new Error(`Mapping: all fromTypes must be the same`);
        }
        if (this.toType && to.type !== this.toType) {
            throw new Error(`Mapping: all toTypes must be the same`);
        }
        this.fromType = from.type;
        this.toType = to.type;
        this.mapping.push([from, to]);
    }
    diagnostics() {
        return [];
    }
    generateFiles() {
        if (!this.fromType || !this.toType) {
            return [];
        }
        const code = new cm2_1.CM2(this.sourceFile);
        code.block(['export function ', this.functionName, '(x: ', this.fromType, '): ', this.toType], () => {
            code.block('switch (x)', () => {
                for (const [enumMember, str] of this.mapping) {
                    code.line('case ', enumMember, ': return ', str, ';');
                }
            });
        });
        return [code];
    }
    map(value) {
        return {
            type: type_1.STRING,
            toString: () => `${this.functionName}(${value})`,
            render: (code) => {
                code.addHelper(new cm2_1.SymbolImport(this.functionName, this.sourceFile));
                code.add(this.functionName, '(', value, ')');
            },
        };
    }
}
exports.EnumMapping = EnumMapping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXNEO0FBQ3RELGlDQUEyRDtBQUMzRCwrQkFBMEM7QUFFMUMsbURBQTZDO0FBRTdDLHlDQUF3QztBQUN4QywyREFBNEM7QUFFNUMsTUFBYSxJQUFJO0lBT2YsWUFBNEIsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUozQixZQUFPLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUNuQyxhQUFRLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUluRCxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQztRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksMEJBQVUsQ0FBQyxxQkFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRU0sU0FBUyxDQUFDLEtBQWtCO1FBQ2pDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtZQUNsRyxNQUFNLElBQUksS0FBSyxDQUFDLGtGQUFrRixDQUFDLENBQUM7U0FDckc7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixNQUFNLEtBQUssR0FBRztZQUNaLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQkFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDN0MsQ0FBQztZQUNELE1BQU0sRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFO2dCQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFB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