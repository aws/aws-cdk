"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliHelpers = void 0;
exports.renderYargs = renderYargs;
const typewriter_1 = require("@cdklabs/typewriter");
const eslint_rules_1 = require("@cdklabs/typewriter/lib/eslint-rules");
const prettier = require("prettier");
// to import lodash.clonedeep properly, we would need to set esModuleInterop: true
// however that setting does not work in the CLI, so we fudge it.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloneDeep = require('lodash.clonedeep');
class CliHelpers extends typewriter_1.ExternalModule {
    constructor() {
        super(...arguments);
        this.browserForPlatform = makeCallableExpr(this, 'browserForPlatform');
        this.cliVersion = makeCallableExpr(this, 'cliVersion');
        this.isCI = makeCallableExpr(this, 'isCI');
        this.yargsNegativeAlias = makeCallableExpr(this, 'yargsNegativeAlias');
    }
}
exports.CliHelpers = CliHelpers;
function makeCallableExpr(scope, name) {
    return (0, typewriter_1.$E)(typewriter_1.expr.sym(new typewriter_1.ThingSymbol(name, scope)));
}
async function renderYargs(config, helpers) {
    const scope = new typewriter_1.Module('aws-cdk');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
    scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    scope.addImport(new typewriter_1.SelectiveModuleImport(scope, 'yargs', ['Argv']));
    helpers.import(scope, 'helpers');
    // 'https://github.com/yargs/yargs/issues/1929',
    // 'https://github.com/evanw/esbuild/issues/1492',
    scope.addInitialization(typewriter_1.code.comment('eslint-disable-next-line @typescript-eslint/no-require-imports'));
    scope.addInitialization(typewriter_1.code.stmt.constVar(typewriter_1.code.expr.ident('yargs'), typewriter_1.code.expr.directCode("require('yargs')")));
    const parseCommandLineArguments = new typewriter_1.FreeFunction(scope, {
        name: 'parseCommandLineArguments',
        export: true,
        returnType: typewriter_1.Type.ANY,
        parameters: [
            { name: 'args', type: typewriter_1.Type.arrayOf(typewriter_1.Type.STRING) },
        ],
    });
    parseCommandLineArguments.addBody(makeYargs(config, helpers));
    const ts = new typewriter_1.TypeScriptRenderer({
        disabledEsLintRules: [
            eslint_rules_1.EsLintRules.COMMA_DANGLE,
            eslint_rules_1.EsLintRules.COMMA_SPACING,
            eslint_rules_1.EsLintRules.MAX_LEN,
            eslint_rules_1.EsLintRules.QUOTES,
            eslint_rules_1.EsLintRules.QUOTE_PROPS,
        ],
    }).render(scope);
    return prettier.format(ts, {
        parser: 'typescript',
        printWidth: 150,
        singleQuote: true,
    });
}
// Use the following configuration for array arguments:
//
//     { type: 'array', default: [], nargs: 1, requiresArg: true }
//
// The default behavior of yargs is to eat all strings following an array argument:
//
//   ./prog --arg one two positional  => will parse to { arg: ['one', 'two', 'positional'], _: [] } (so no positional arguments)
//   ./prog --arg one two -- positional  => does not help, for reasons that I can't understand. Still gets parsed incorrectly.
//
// By using the config above, every --arg will only consume one argument, so you can do the following:
//
//   ./prog --arg one --arg two position  =>  will parse to  { arg: ['one', 'two'], _: ['positional'] }.
function makeYargs(config, helpers) {
    let yargsExpr = typewriter_1.code.expr.ident('yargs');
    yargsExpr = yargsExpr
        .callMethod('env', lit('CDK'))
        .callMethod('usage', lit('Usage: cdk -a <cdk-app> COMMAND'));
    // we must compute global options first, as they are not part of an argument to a command call
    yargsExpr = makeOptions(yargsExpr, config.globalOptions, helpers);
    for (const command of Object.keys(config.commands)) {
        const commandFacts = config.commands[command];
        const commandArg = commandFacts.arg
            ? ` [${commandFacts.arg?.name}${commandFacts.arg?.variadic ? '..' : ''}]`
            : '';
        const aliases = commandFacts.aliases
            ? commandFacts.aliases.map((alias) => `, '${alias}${commandArg}'`)
            : '';
        // must compute options before we compute the full command, because in yargs, the options are an argument to the command call.
        let optionsExpr = typewriter_1.code.expr.directCode('(yargs: Argv) => yargs');
        optionsExpr = makeOptions(optionsExpr, commandFacts.options ?? {}, helpers);
        const commandCallArgs = [];
        if (aliases) {
            commandCallArgs.push(typewriter_1.code.expr.directCode(`['${command}${commandArg}'${aliases}]`));
        }
        else {
            commandCallArgs.push(typewriter_1.code.expr.directCode(`'${command}${commandArg}'`));
        }
        commandCallArgs.push(lit(commandFacts.description));
        if (commandFacts.options) {
            commandCallArgs.push(optionsExpr);
        }
        yargsExpr = yargsExpr.callMethod('command', ...commandCallArgs);
    }
    return typewriter_1.code.stmt.ret(makeEpilogue(yargsExpr, helpers));
}
function makeOptions(prefix, options, helpers) {
    let optionsExpr = prefix;
    for (const option of Object.keys(options)) {
        const theOption = options[option];
        const optionProps = cloneDeep(theOption);
        const optionArgs = {};
        // Array defaults
        if (optionProps.type === 'array') {
            optionProps.nargs = 1;
            optionProps.requiresArg = true;
        }
        for (const optionProp of Object.keys(optionProps).filter(opt => !['negativeAlias'].includes(opt))) {
            const optionValue = optionProps[optionProp];
            if (optionValue instanceof typewriter_1.Expression) {
                optionArgs[optionProp] = optionValue;
            }
            else {
                optionArgs[optionProp] = lit(optionValue);
            }
        }
        // Register the option with yargs
        optionsExpr = optionsExpr.callMethod('option', lit(option), typewriter_1.code.expr.object(optionArgs));
        // Special case for negativeAlias
        // We need an additional option and a middleware:
        // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
        if (theOption.negativeAlias) {
            const middleware = helpers.yargsNegativeAlias.call(lit(theOption.negativeAlias), lit(option));
            optionsExpr = optionsExpr.callMethod('option', lit(theOption.negativeAlias), typewriter_1.code.expr.lit({
                type: 'boolean',
                hidden: true,
            }));
            optionsExpr = optionsExpr.callMethod('middleware', middleware, lit(true));
        }
    }
    return optionsExpr;
}
function makeEpilogue(prefix, helpers) {
    let completeDefinition = prefix.callMethod('version', helpers.cliVersion());
    completeDefinition = completeDefinition.callMethod('demandCommand', lit(1), lit('')); // just print help
    completeDefinition = completeDefinition.callMethod('recommendCommands');
    completeDefinition = completeDefinition.callMethod('help');
    completeDefinition = completeDefinition.callMethod('alias', lit('h'), lit('help'));
    completeDefinition = completeDefinition.callMethod('epilogue', lit([
        'If your app has a single stack, there is no need to specify the stack name',
        'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
    ].join('\n\n')));
    completeDefinition = completeDefinition.callMethod('parse', typewriter_1.code.expr.ident('args'));
    return completeDefinition;
}
function lit(value) {
    switch (value) {
        case undefined:
            return typewriter_1.code.expr.UNDEFINED;
        case null:
            return typewriter_1.code.expr.NULL;
        default:
            return typewriter_1.code.expr.lit(value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFyZ3MtZ2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsieWFyZ3MtZ2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXFCQSxrQ0F5Q0M7QUE5REQsb0RBQXdMO0FBQ3hMLHVFQUFtRTtBQUNuRSxxQ0FBcUM7QUFHckMsa0ZBQWtGO0FBQ2xGLGlFQUFpRTtBQUNqRSxpRUFBaUU7QUFDakUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFOUMsTUFBYSxVQUFXLFNBQVEsMkJBQWM7SUFBOUM7O1FBQ2tCLHVCQUFrQixHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xFLGVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDbEQsU0FBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0Qyx1QkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQUE7QUFMRCxnQ0FLQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsS0FBYSxFQUFFLElBQVk7SUFDbkQsT0FBTyxJQUFBLGVBQUUsRUFBQyxpQkFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLHdCQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxNQUFpQixFQUFFLE9BQW1CO0lBQ3RFLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUVwQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBRSw2RkFBNkYsQ0FBQyxDQUFDO0lBQ3pILEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7SUFDM0UsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJ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QUMsa0JBQWtCO0lBQ3hHLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hFLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzRCxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNuRixrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztRQUNqRSw0RUFBNEU7UUFDNUUsbUlBQW1JO0tBQ3BJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqQixrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLGlCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRXJGLE9BQU8sa0JBQWtCLENBQUM7QUFDNUIsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLEtBQVU7SUFDckIsUUFBUSxLQUFLLEVBQUUsQ0FBQztRQUNkLEtBQUssU0FBUztZQUNaLE9BQU8saUJBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLEtBQUssSUFBSTtZQUNQLE9BQU8saUJBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCO1lBQ0UsT0FBTyxpQkFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkRSwgRXhwcmVzc2lvbiwgRXh0ZXJuYWxNb2R1bGUsIEZyZWVGdW5jdGlvbiwgSVNjb3BlLCBNb2R1bGUsIFNlbGVjdGl2ZU1vZHVsZUltcG9ydCwgU3RhdGVtZW50LCBUaGluZ1N5bWJvbCwgVHlwZSwgVHlwZVNjcmlwdFJlbmRlcmVyLCBjb2RlLCBleHByIH0gZnJvbSAnQGNka2xhYnMvdHlwZXdyaXRlcic7XG5pbXBvcnQgeyBFc0xpbnRSdWxlcyB9IGZyb20gJ0BjZGtsYWJzL3R5cGV3cml0ZXIvbGliL2VzbGludC1ydWxlcyc7XG5pbXBvcnQgKiBhcyBwcmV0dGllciBmcm9tICdwcmV0dGllcic7XG5pbXBvcnQgeyBDbGlDb25maWcsIENsaU9wdGlvbiwgWWFyZ3NPcHRpb24gfSBmcm9tICcuL3lhcmdzLXR5cGVzJztcblxuLy8gdG8gaW1wb3J0IGxvZGFzaC5jbG9uZWRlZXAgcHJvcGVybHksIHdlIHdvdWxkIG5lZWQgdG8gc2V0IGVzTW9kdWxlSW50ZXJvcDogdHJ1ZVxuLy8gaG93ZXZlciB0aGF0IHNldHRpbmcgZG9lcyBub3Qgd29yayBpbiB0aGUgQ0xJLCBzbyB3ZSBmdWRnZSBpdC5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCBjbG9uZURlZXAgPSByZXF1aXJlKCdsb2Rhc2guY2xvbmVkZWVwJyk7XG5cbmV4cG9ydCBjbGFzcyBDbGlIZWxwZXJzIGV4dGVuZHMgRXh0ZXJuYWxNb2R1bGUge1xuICBwdWJsaWMgcmVhZG9ubHkgYnJvd3NlckZvclBsYXRmb3JtID0gbWFrZUNhbGxhYmxlRXhwcih0aGlzLCAnYnJvd3NlckZvclBsYXRmb3JtJyk7XG4gIHB1YmxpYyByZWFkb25seSBjbGlWZXJzaW9uID0gbWFrZUNhbGxhYmxlRXhwcih0aGlzLCAnY2xpVmVyc2lvbicpO1xuICBwdWJsaWMgcmVhZG9ubHkgaXNDSSA9IG1ha2VDYWxsYWJsZUV4cHIodGhpcywgJ2lzQ0knKTtcbiAgcHVibGljIHJlYWRvbmx5IHlhcmdzTmVnYXRpdmVBbGlhcyA9IG1ha2VDYWxsYWJsZUV4cHIodGhpcywgJ3lhcmdzTmVnYXRpdmVBbGlhcycpO1xufVxuXG5mdW5jdGlvbiBtYWtlQ2FsbGFibGVFeHByKHNjb3BlOiBJU2NvcGUsIG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gJEUoZXhwci5zeW0obmV3IFRoaW5nU3ltYm9sKG5hbWUsIHNjb3BlKSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyWWFyZ3MoY29uZmlnOiBDbGlDb25maWcsIGhlbHBlcnM6IENsaUhlbHBlcnMpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzY29wZSA9IG5ldyBNb2R1bGUoJ2F3cy1jZGsnKTtcblxuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIHNjb3BlLmRvY3VtZW50YXRpb24ucHVzaCgnR0VORVJBVEVEIEZST00gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzLicpO1xuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goJ0RvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS4nKTtcbiAgc2NvcGUuZG9jdW1lbnRhdGlvbi5wdXNoKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cbiAgc2NvcGUuYWRkSW1wb3J0KG5ldyBTZWxlY3RpdmVNb2R1bGVJbXBvcnQoc2NvcGUsICd5YXJncycsIFsnQXJndiddKSk7XG4gIGhlbHBlcnMuaW1wb3J0KHNjb3BlLCAnaGVscGVycycpO1xuXG4gIC8vICdodHRwczovL2dpdGh1Yi5jb20veWFyZ3MveWFyZ3MvaXNzdWVzLzE5MjknLFxuICAvLyAnaHR0cHM6Ly9naXRodWIuY29tL2V2YW53L2VzYnVpbGQvaXNzdWVzLzE0OTInLFxuICBzY29wZS5hZGRJbml0aWFsaXphdGlvbihjb2RlLmNvbW1lbnQoJ2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzJykpO1xuICBzY29wZS5hZGRJbml0aWFsaXphdGlvbihjb2RlLnN0bXQuY29uc3RWYXIoY29kZS5leHByLmlkZW50KCd5YXJncycpLCBjb2RlLmV4cHIuZGlyZWN0Q29kZShcInJlcXVpcmUoJ3lhcmdzJylcIikpKTtcblxuICBjb25zdCBwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzID0gbmV3IEZyZWVGdW5jdGlvbihzY29wZSwge1xuICAgIG5hbWU6ICdwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzJyxcbiAgICBleHBvcnQ6IHRydWUsXG4gICAgcmV0dXJuVHlwZTogVHlwZS5BTlksXG4gICAgcGFyYW1ldGVyczogW1xuICAgICAgeyBuYW1lOiAnYXJncycsIHR5cGU6IFR5cGUuYXJyYXlPZihUeXBlLlNUUklORykgfSxcbiAgICBdLFxuICB9KTtcbiAgcGFyc2VDb21tYW5kTGluZUFyZ3VtZW50cy5hZGRCb2R5KG1ha2VZYXJncyhjb25maWcsIGhlbHBlcnMpKTtcblxuICBjb25zdCB0cyA9IG5ldyBUeXBlU2NyaXB0UmVuZGVyZXIoe1xuICAgIGRpc2FibGVkRXNMaW50UnVsZXM6IFtcbiAgICAgIEVzTGludFJ1bGVzLkNPTU1BX0RBTkdMRSxcbiAgICAgIEVzTGludFJ1bGVzLkNPTU1BX1NQQUNJTkcsXG4gICAgICBFc0xpbnRSdWxlcy5NQVhfTEVOLFxuICAgICAgRXNMaW50UnVsZXMuUVVPVEVTLFxuICAgICAgRXNMaW50UnVsZXMuUVVPVEVfUFJPUFMsXG4gICAgXSxcbiAgfSkucmVuZGVyKHNjb3BlKTtcblxuICByZXR1cm4gcHJldHRpZXIuZm9ybWF0KHRzLCB7XG4gICAgcGFyc2VyOiAndHlwZXNjcmlwdCcsXG4gICAgcHJpbnRXaWR0aDogMTUwLFxuICAgIHNpbmdsZVF1b3RlOiB0cnVlLFxuICB9KTtcbn1cblxuLy8gVXNlIHRoZSBmb2xsb3dpbmcgY29uZmlndXJhdGlvbiBmb3IgYXJyYXkgYXJndW1lbnRzOlxuLy9cbi8vICAgICB7IHR5cGU6ICdhcnJheScsIGRlZmF1bHQ6IFtdLCBuYXJnczogMSwgcmVxdWlyZXNBcmc6IHRydWUgfVxuLy9cbi8vIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHlhcmdzIGlzIHRvIGVhdCBhbGwgc3RyaW5ncyBmb2xsb3dpbmcgYW4gYXJyYXkgYXJndW1lbnQ6XG4vL1xuLy8gICAuL3Byb2cgLS1hcmcgb25lIHR3byBwb3NpdGlvbmFsICA9PiB3aWxsIHBhcnNlIHRvIHsgYXJnOiBbJ29uZScsICd0d28nLCAncG9zaXRpb25hbCddLCBfOiBbXSB9IChzbyBubyBwb3NpdGlvbmFsIGFyZ3VtZW50cylcbi8vICAgLi9wcm9nIC0tYXJnIG9uZSB0d28gLS0gcG9zaXRpb25hbCAgPT4gZG9lcyBub3QgaGVscCwgZm9yIHJlYXNvbnMgdGhhdCBJIGNhbid0IHVuZGVyc3RhbmQuIFN0aWxsIGdldHMgcGFyc2VkIGluY29ycmVjdGx5LlxuLy9cbi8vIEJ5IHVzaW5nIHRoZSBjb25maWcgYWJvdmUsIGV2ZXJ5IC0tYXJnIHdpbGwgb25seSBjb25zdW1lIG9uZSBhcmd1bWVudCwgc28geW91IGNhbiBkbyB0aGUgZm9sbG93aW5nOlxuLy9cbi8vICAgLi9wcm9nIC0tYXJnIG9uZSAtLWFyZyB0d28gcG9zaXRpb24gID0+ICB3aWxsIHBhcnNlIHRvICB7IGFyZzogWydvbmUnLCAndHdvJ10sIF86IFsncG9zaXRpb25hbCddIH0uXG5mdW5jdGlvbiBtYWtlWWFyZ3MoY29uZmlnOiBDbGlDb25maWcsIGhlbHBlcnM6IENsaUhlbHBlcnMpOiBTdGF0ZW1lbnQge1xuICBsZXQgeWFyZ3NFeHByOiBFeHByZXNzaW9uID0gY29kZS5leHByLmlkZW50KCd5YXJncycpO1xuICB5YXJnc0V4cHIgPSB5YXJnc0V4cHJcbiAgICAuY2FsbE1ldGhvZCgnZW52JywgbGl0KCdDREsnKSlcbiAgICAuY2FsbE1ldGhvZCgndXNhZ2UnLCBsaXQoJ1VzYWdlOiBjZGsgLWEgPGNkay1hcHA+IENPTU1BTkQnKSk7XG5cbiAgLy8gd2UgbXVzdCBjb21wdXRlIGdsb2JhbCBvcHRpb25zIGZpcnN0LCBhcyB0aGV5IGFyZSBub3QgcGFydCBvZiBhbiBhcmd1bWVudCB0byBhIGNvbW1hbmQgY2FsbFxuICB5YXJnc0V4cHIgPSBtYWtlT3B0aW9ucyh5YXJnc0V4cHIsIGNvbmZpZy5nbG9iYWxPcHRpb25zLCBoZWxwZXJzKTtcblxuICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgT2JqZWN0LmtleXMoY29uZmlnLmNvbW1hbmRzKSkge1xuICAgIGNvbnN0IGNvbW1hbmRGYWN0cyA9IGNvbmZpZy5jb21tYW5kc1tjb21tYW5kXTtcbiAgICBjb25zdCBjb21tYW5kQXJnID0gY29tbWFuZEZhY3RzLmFyZ1xuICAgICAgPyBgIFske2NvbW1hbmRGYWN0cy5hcmc/Lm5hbWV9JHtjb21tYW5kRmFjdHMuYXJnPy52YXJpYWRpYyA/ICcuLicgOiAnJ31dYFxuICAgICAgOiAnJztcbiAgICBjb25zdCBhbGlhc2VzID0gY29tbWFuZEZhY3RzLmFsaWFzZXNcbiAgICAgID8gY29tbWFuZEZhY3RzLmFsaWFzZXMubWFwKChhbGlhcykgPT4gYCwgJyR7YWxpYXN9JHtjb21tYW5kQXJnfSdgKVxuICAgICAgOiAnJztcblxuICAgIC8vIG11c3QgY29tcHV0ZSBvcHRpb25zIGJlZm9yZSB3ZSBjb21wdXRlIHRoZSBmdWxsIGNvbW1hbmQsIGJlY2F1c2UgaW4geWFyZ3MsIHRoZSBvcHRpb25zIGFyZSBhbiBhcmd1bWVudCB0byB0aGUgY29tbWFuZCBjYWxsLlxuICAgIGxldCBvcHRpb25zRXhwcjogRXhwcmVzc2lvbiA9IGNvZGUuZXhwci5kaXJlY3RDb2RlKCcoeWFyZ3M6IEFyZ3YpID0+IHlhcmdzJyk7XG4gICAgb3B0aW9uc0V4cHIgPSBtYWtlT3B0aW9ucyhvcHRpb25zRXhwciwgY29tbWFuZEZhY3RzLm9wdGlvbnMgPz8ge30sIGhlbHBlcnMpO1xuXG4gICAgY29uc3QgY29tbWFuZENhbGxBcmdzOiBBcnJheTxFeHByZXNzaW9uPiA9IFtdO1xuICAgIGlmIChhbGlhc2VzKSB7XG4gICAgICBjb21tYW5kQ2FsbEFyZ3MucHVzaChjb2RlLmV4cHIuZGlyZWN0Q29kZShgWycke2NvbW1hbmR9JHtjb21tYW5kQXJnfScke2FsaWFzZXN9XWApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tbWFuZENhbGxBcmdzLnB1c2goY29kZS5leHByLmRpcmVjdENvZGUoYCcke2NvbW1hbmR9JHtjb21tYW5kQXJnfSdgKSk7XG4gICAgfVxuICAgIGNvbW1hbmRDYWxsQXJncy5wdXNoKGxpdChjb21tYW5kRmFjdHMuZGVzY3JpcHRpb24pKTtcblxuICAgIGlmIChjb21tYW5kRmFjdHMub3B0aW9ucykge1xuICAgICAgY29tbWFuZENhbGxBcmdzLnB1c2gob3B0aW9uc0V4cHIpO1xuICAgIH1cblxuICAgIHlhcmdzRXhwciA9IHlhcmdzRXhwci5jYWxsTWV0aG9kKCdjb21tYW5kJywgLi4uY29tbWFuZENhbGxBcmdzKTtcbiAgfVxuXG4gIHJldHVybiBjb2RlLnN0bXQucmV0KG1ha2VFcGlsb2d1ZSh5YXJnc0V4cHIsIGhlbHBlcnMpKTtcbn1cblxuZnVuY3Rpb24gbWFrZU9wdGlvbnMocHJlZml4OiBFeHByZXNzaW9uLCBvcHRpb25zOiB7IFtvcHRpb25OYW1lOiBzdHJpbmddOiBDbGlPcHRpb24gfSwgaGVscGVyczogQ2xpSGVscGVycykge1xuICBsZXQgb3B0aW9uc0V4cHIgPSBwcmVmaXg7XG4gIGZvciAoY29uc3Qgb3B0aW9uIG9mIE9iamVjdC5rZXlzKG9wdGlvbnMpKSB7XG4gICAgY29uc3QgdGhlT3B0aW9uOiBDbGlPcHRpb24gPSBvcHRpb25zW29wdGlvbl07XG4gICAgY29uc3Qgb3B0aW9uUHJvcHM6IFlhcmdzT3B0aW9uID0gY2xvbmVEZWVwKHRoZU9wdGlvbik7XG4gICAgY29uc3Qgb3B0aW9uQXJnczogeyBba2V5OiBzdHJpbmddOiBFeHByZXNzaW9uIH0gPSB7fTtcblxuICAgIC8vIEFycmF5IGRlZmF1bHRzXG4gICAgaWYgKG9wdGlvblByb3BzLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgIG9wdGlvblByb3BzLm5hcmdzID0gMTtcbiAgICAgIG9wdGlvblByb3BzLnJlcXVpcmVzQXJnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG9wdGlvblByb3Agb2YgT2JqZWN0LmtleXMob3B0aW9uUHJvcHMpLmZpbHRlcihvcHQgPT4gIVsnbmVnYXRpdmVBbGlhcyddLmluY2x1ZGVzKG9wdCkpKSB7XG4gICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IChvcHRpb25Qcm9wcyBhcyBhbnkpW29wdGlvblByb3BdO1xuICAgICAgaWYgKG9wdGlvblZhbHVlIGluc3RhbmNlb2YgRXhwcmVzc2lvbikge1xuICAgICAgICBvcHRpb25BcmdzW29wdGlvblByb3BdID0gb3B0aW9uVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25BcmdzW29wdGlvblByb3BdID0gbGl0KG9wdGlvblZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlciB0aGUgb3B0aW9uIHdpdGggeWFyZ3NcbiAgICBvcHRpb25zRXhwciA9IG9wdGlvbnNFeHByLmNhbGxNZXRob2QoJ29wdGlvbicsIGxpdChvcHRpb24pLCBjb2RlLmV4cHIub2JqZWN0KG9wdGlvbkFyZ3MpKTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgbmVnYXRpdmVBbGlhc1xuICAgIC8vIFdlIG5lZWQgYW4gYWRkaXRpb25hbCBvcHRpb24gYW5kIGEgbWlkZGxld2FyZTpcbiAgICAvLyAub3B0aW9uKCdSJywgeyB0eXBlOiAnYm9vbGVhbicsIGhpZGRlbjogdHJ1ZSB9KS5taWRkbGV3YXJlKHlhcmdzTmVnYXRpdmVBbGlhcygnUicsICdyb2xsYmFjaycpLCB0cnVlKVxuICAgIGlmICh0aGVPcHRpb24ubmVnYXRpdmVBbGlhcykge1xuICAgICAgY29uc3QgbWlkZGxld2FyZSA9IGhlbHBlcnMueWFyZ3NOZWdhdGl2ZUFsaWFzLmNhbGwobGl0KHRoZU9wdGlvbi5uZWdhdGl2ZUFsaWFzKSwgbGl0KG9wdGlvbikpO1xuICAgICAgb3B0aW9uc0V4cHIgPSBvcHRpb25zRXhwci5jYWxsTWV0aG9kKCdvcHRpb24nLCBsaXQodGhlT3B0aW9uLm5lZ2F0aXZlQWxpYXMpLCBjb2RlLmV4cHIubGl0KHtcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICBoaWRkZW46IHRydWUsXG4gICAgICB9KSk7XG4gICAgICBvcHRpb25zRXhwciA9IG9wdGlvbnNFeHByLmNhbGxNZXRob2QoJ21pZGRsZXdhcmUnLCBtaWRkbGV3YXJlLCBsaXQodHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpb25zRXhwcjtcbn1cblxuZnVuY3Rpb24gbWFrZUVwaWxvZ3VlKHByZWZpeDogRXhwcmVzc2lvbiwgaGVscGVyczogQ2xpSGVscGVycykge1xuICBsZXQgY29tcGxldGVEZWZpbml0aW9uID0gcHJlZml4LmNhbGxNZXRob2QoJ3ZlcnNpb24nLCBoZWxwZXJzLmNsaVZlcnNpb24oKSk7XG4gIGNvbXBsZXRlRGVmaW5pdGlvbiA9IGNvbXBsZXRlRGVmaW5pdGlvbi5jYWxsTWV0aG9kKCdkZW1hbmRDb21tYW5kJywgbGl0KDEpLCBsaXQoJycpKTsgLy8ganVzdCBwcmludCBoZWxwXG4gIGNvbXBsZXRlRGVmaW5pdGlvbiA9IGNvbXBsZXRlRGVmaW5pdGlvbi5jYWxsTWV0aG9kKCdyZWNvbW1lbmRDb21tYW5kcycpO1xuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgnaGVscCcpO1xuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgnYWxpYXMnLCBsaXQoJ2gnKSwgbGl0KCdoZWxwJykpO1xuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgnZXBpbG9ndWUnLCBsaXQoW1xuICAgICdJZiB5b3VyIGFwcCBoYXMgYSBzaW5nbGUgc3RhY2ssIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3BlY2lmeSB0aGUgc3RhY2sgbmFtZScsXG4gICAgJ0lmIG9uZSBvZiBjZGsuanNvbiBvciB+Ly5jZGsuanNvbiBleGlzdHMsIG9wdGlvbnMgc3BlY2lmaWVkIHRoZXJlIHdpbGwgYmUgdXNlZCBhcyBkZWZhdWx0cy4gU2V0dGluZ3MgaW4gY2RrLmpzb24gdGFrZSBwcmVjZWRlbmNlLicsXG4gIF0uam9pbignXFxuXFxuJykpKTtcblxuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgncGFyc2UnLCBjb2RlLmV4cHIuaWRlbnQoJ2FyZ3MnKSk7XG5cbiAgcmV0dXJuIGNvbXBsZXRlRGVmaW5pdGlvbjtcbn1cblxuZnVuY3Rpb24gbGl0KHZhbHVlOiBhbnkpOiBFeHByZXNzaW9uIHtcbiAgc3dpdGNoICh2YWx1ZSkge1xuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgcmV0dXJuIGNvZGUuZXhwci5VTkRFRklORUQ7XG4gICAgY2FzZSBudWxsOlxuICAgICAgcmV0dXJuIGNvZGUuZXhwci5OVUxMO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gY29kZS5leHByLmxpdCh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==