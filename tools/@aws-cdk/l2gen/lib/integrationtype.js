"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeWire = exports.Integration = exports.IntegrationType = void 0;
const type_1 = require("./type");
const generatable_1 = require("./generatable");
const cm2_1 = require("./cm2");
const source_module_1 = require("./source-module");
const interfacetype_1 = require("./private/interfacetype");
const well_known_types_1 = require("./well-known-types");
const arguments_1 = require("./arguments");
const value_1 = require("./value");
const codemaker_1 = require("codemaker");
class IntegrationType {
    constructor(className) {
        this.className = className;
        this.integrations = new Array();
        this.typeRefName = className;
        this.definingModule = new source_module_1.SourceFile(generatable_1.fileFor(className, 'public'));
        this.bindOptionsType = new interfacetype_1.InterfaceTypeDefinition(`${className}BindOptions`, this.definingModule, {
            automaticallyRender: 'bottom',
        });
        this.bindResultType = new interfacetype_1.InterfaceTypeDefinition(`${className}BindResult`, this.definingModule, {
            automaticallyRender: 'bottom',
        });
    }
    integration(name, build) {
        const alt = new Integration(this, name);
        build(alt);
        this.integrations.push(alt);
        return this;
    }
    bindOption(opt) {
        return this.bindOptionsType.addInputProperty('options', opt);
    }
    bindResult(opt) {
        this.bindResultType.addProperty(opt);
    }
    generateFiles() {
        return [
            ...this.generateThis(),
            ...this.integrations.flatMap(i => i.generateFiles()),
        ];
    }
    generateThis() {
        const code = new cm2_1.CM2(this.definingModule.fileName);
        // FIXME: DocBlock
        code.openBlock('export abstract class ', this.typeRefName);
        code.line('public abstract bind(', this.bindArguments(), '): ', this.bindReturnType(), ';');
        code.closeBlock();
        return [code];
    }
    bindArguments() {
        const args = new arguments_1.Arguments().arg('scope', well_known_types_1.CONSTRUCT);
        if (this.bindOptionsType.hasProps) {
            args.arg('options', this.bindOptionsType, { defaultValue: this.bindOptionsType.defaultValue });
        }
        return args;
    }
    bindReturnType() {
        return this.bindResultType.hasProps ? this.bindResultType : type_1.VOID;
    }
    diagnostics() {
        return [];
    }
    render(code) {
        return type_1.standardTypeRender(this, code);
    }
    toString() {
        return this.className;
    }
}
exports.IntegrationType = IntegrationType;
class Integration {
    constructor(parent, name) {
        this.parent = parent;
        this.name = name;
        this.positionalArgs = new arguments_1.Arguments();
        this.bindResult = new value_1.ObjectLiteral();
        // FIXME: These should go into an integration package
        this.sourceFile = new source_module_1.SourceFile(generatable_1.fileFor(name, 'public')); // FIXME: Or private?
        this.optionsType = new interfacetype_1.InterfaceTypeDefinition(`${codemaker_1.toPascalCase(this.name)}Options`, parent.definingModule, {
            automaticallyRender: 'top',
        });
    }
    constructorArguments() {
        const args = this.positionalArgs.copy();
        if (this.optionsType.hasProps) {
            args.arg('options', this.optionsType, { defaultValue: this.optionsType.defaultValue });
        }
        return args;
    }
    wireBindResult(props) {
        this.bindResult.set(props);
    }
    generateFiles() {
        const code = new cm2_1.CM2(this.sourceFile.fileName);
        // FIXME: DocBlock
        code.block(['export class ', this.name, ' extends ', this.parent], () => {
            const ctorArgs = this.constructorArguments();
            for (const arg of ctorArgs.args) {
                code.line('private readonly ', arg.name, !arg.required ? '?' : '', ': ', arg.type, ';');
            }
            code.block(['constructor(', ctorArgs, ')'], () => {
                code.line('super();');
                // FIXME: Validation
                for (const arg of ctorArgs.args) {
                    code.line('this.', arg.name, ' = ', arg.name, ';');
                }
            });
            code.block(['public bind(', this.parent.bindArguments(), '): ', this.parent.bindReturnType()], () => {
                code.line('void(scope);');
                // FIXME: Uhm.
                code.line('return ', this.bindResult, ';');
            });
        });
        return [code];
    }
    diagnostics() {
        return [];
    }
    positional(name, type, options = {}) {
        this.positionalArgs.arg(name, type, options);
        return value_1.litVal(`this.${name}`);
    }
    option(opt) {
        return this.optionsType.addInputProperty('this.options', opt);
    }
}
exports.Integration = Integration;
function maybeWire(receiver, props, value) {
    if (props.wire) {
        receiver.wire({
            [props.wire]: props.wireTransform ? props.wireTransform(value) : value,
        });
    }
    return value;
}
exports.maybeWire = maybeWire;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb250eXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWdyYXRpb250eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUF5RDtBQUN6RCwrQ0FBc0Q7QUFDdEQsK0JBQXlDO0FBRXpDLG1EQUE2QztBQUM3QywyREFBa0Y7QUFDbEYseURBQStDO0FBQy9DLDJDQUF5RDtBQUN6RCxtQ0FBd0Q7QUFDeEQseUNBQXlDO0FBRXpDLE1BQWEsZUFBZTtJQU8xQixZQUE0QixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBRjVCLGlCQUFZLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUd2RCxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksMEJBQVUsQ0FBQyxxQkFBTyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx1Q0FBdUIsQ0FBQyxHQUFHLFNBQVMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakcsbUJBQW1CLEVBQUUsUUFBUTtTQUM5QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksdUNBQXVCLENBQUMsR0FBRyxTQUFTLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQy9GLG1CQUFtQixFQUFFLFFBQVE7U0FDOUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFZLEVBQUUsS0FBeUI7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFtQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTSxVQUFVLENBQUMsR0FBbUI7UUFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPO1lBQ0wsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDckQsQ0FBQztJQUNKLENBQUM7SUFFTyxZQUFZO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksU0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbkQsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRU0sYUFBYTtRQUNsQixNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLDRCQUFTLENBQUMsQ0FBQztRQUNyRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ2hHO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUM7SUFDbkUsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBUztRQUNkLE9BQU8seUJBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQTdFRCwwQ0E2RUM7QUFJRCxNQUFhLFdBQVc7SUFNdEIsWUFBNkIsTUFBdUIsRUFBa0IsSUFBWTtRQUFyRCxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFrQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBTGpFLG1CQUFjLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7UUFHakMsZUFBVSxHQUFHLElBQUkscUJBQWEsRUFBRSxDQUFDO1FBR2hELHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksMEJBQVUsQ0FBQyxxQkFBTyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1Q0FBdUIsQ0FBQyxHQUFHLHdCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLGNBQWMsRUFBRTtZQUN6RyxtQkFBbUIsRUFBRSxLQUFLO1NBQzNCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxvQkFBb0I7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ3hGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sY0FBYyxDQUFDLEtBQTZCO1FBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTSxhQUFhO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksU0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0Msa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRTtZQUN0RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM3QyxLQUFLLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUV0QixvQkFBb0I7Z0JBQ3BCLEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtvQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDcEQ7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDbEcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDMUIsY0FBYztnQkFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sVUFBVSxDQUFDLElBQVksRUFBRSxJQUFXLEVBQUUsVUFBMkIsRUFBRTtRQUN4RSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sY0FBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQW1CO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNGO0FBbkVELGtDQW1FQztBQWFELFNBQWdCLFNBQVMsQ0FBd0IsUUFBbUIsRUFBRSxLQUFvQixFQUFFLEtBQVE7SUFDbEcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQztZQUNaLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7U0FDdkUsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCw4QkFPQyJ9