"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliHelpers = void 0;
exports.renderYargs = renderYargs;
const typewriter_1 = require("@cdklabs/typewriter");
const eslint_rules_1 = require("@cdklabs/typewriter/lib/eslint-rules");
const prettier = require("prettier");
const util_1 = require("./util");
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
        disabledEsLintRules: [eslint_rules_1.EsLintRules.MAX_LEN], // the default disabled rules result in 'Definition for rule 'prettier/prettier' was not found'
    }).render(scope);
    return prettier.format(ts, {
        parser: 'typescript',
        printWidth: 150,
        singleQuote: true,
        trailingComma: 'all',
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
        .callMethod('env', (0, util_1.lit)('CDK'))
        .callMethod('usage', (0, util_1.lit)('Usage: cdk -a <cdk-app> COMMAND'));
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
        commandCallArgs.push((0, util_1.lit)(commandFacts.description));
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
        const theOption = {
            // Make the default explicit (overridden if the option includes an actual default)
            // 'notification-arns' is a special snowflake that should be defaulted to 'undefined', but https://github.com/yargs/yargs/issues/2443
            // prevents us from doing so. This should be changed if the issue is resolved.
            ...(option === 'notification-arns' ? {} : { default: (0, util_1.generateDefault)(options[option].type) }),
            ...options[option],
        };
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
                optionArgs[optionProp] = (0, util_1.lit)(optionValue);
            }
        }
        // Register the option with yargs
        optionsExpr = optionsExpr.callMethod('option', (0, util_1.lit)(option), typewriter_1.code.expr.object(optionArgs));
        // Special case for negativeAlias
        // We need an additional option and a middleware:
        // .option('R', { type: 'boolean', hidden: true }).middleware(yargsNegativeAlias('R', 'rollback'), true)
        if (theOption.negativeAlias) {
            const middleware = helpers.yargsNegativeAlias.call((0, util_1.lit)(theOption.negativeAlias), (0, util_1.lit)(option));
            optionsExpr = optionsExpr.callMethod('option', (0, util_1.lit)(theOption.negativeAlias), typewriter_1.code.expr.lit({
                type: 'boolean',
                hidden: true,
            }));
            optionsExpr = optionsExpr.callMethod('middleware', middleware, (0, util_1.lit)(true));
        }
    }
    return optionsExpr;
}
function makeEpilogue(prefix, helpers) {
    let completeDefinition = prefix.callMethod('version', helpers.cliVersion());
    completeDefinition = completeDefinition.callMethod('demandCommand', (0, util_1.lit)(1), (0, util_1.lit)('')); // just print help
    completeDefinition = completeDefinition.callMethod('recommendCommands');
    completeDefinition = completeDefinition.callMethod('help');
    completeDefinition = completeDefinition.callMethod('alias', (0, util_1.lit)('h'), (0, util_1.lit)('help'));
    completeDefinition = completeDefinition.callMethod('epilogue', (0, util_1.lit)([
        'If your app has a single stack, there is no need to specify the stack name',
        'If one of cdk.json or ~/.cdk.json exists, options specified there will be used as defaults. Settings in cdk.json take precedence.',
    ].join('\n\n')));
    completeDefinition = completeDefinition.callMethod('parse', typewriter_1.code.expr.ident('args'));
    return completeDefinition;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFyZ3MtZ2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsieWFyZ3MtZ2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXNCQSxrQ0FvQ0M7QUExREQsb0RBQXdMO0FBQ3hMLHVFQUFtRTtBQUNuRSxxQ0FBcUM7QUFDckMsaUNBQThDO0FBRzlDLGtGQUFrRjtBQUNsRixpRUFBaUU7QUFDakUsaUVBQWlFO0FBQ2pFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTlDLE1BQWEsVUFBVyxTQUFRLDJCQUFjO0lBQTlDOztRQUNrQix1QkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNsRSxlQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2xELFNBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEMsdUJBQWtCLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUFBO0FBTEQsZ0NBS0M7QUFFRCxTQUFTLGdCQUFnQixDQUFDLEtBQWEsRUFBRSxJQUFZO0lBQ25ELE9BQU8sSUFBQSxlQUFFLEVBQUMsaUJBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSx3QkFBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsTUFBaUIsRUFBRSxPQUFtQjtJQUN0RSxNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFcEMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUUsNkZBQTZGLENBQUMsQ0FBQztJQUN6SCxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0lBQzNFLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDBGQUEwRixDQUFDLENBQUM7SUFDckgsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsNkZBQTZGLENBQUMsQ0FBQztJQUV4SCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksa0NBQXFCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVqQyxnREFBZ0Q7SUFDaEQsa0RBQWtEO0lBQ2xELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBSSxDQUFDLE9BQU8sQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDLENBQUM7SUFDeEcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLGlCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsaUJBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhILE1BQU0seUJBQXlCLEdBQUcsSUFBSSx5QkFBWSxDQUFDLEtBQUssRUFBRTtRQUN4RCxJQUFJLEVBQUUsMkJBQTJCO1FBQ2pDLE1BQU0sRUFBRSxJQUFJO1FBQ1osVUFBVSxFQUFFLGlCQUFJLENBQUMsR0FBRztRQUNwQixVQUFVLEVBQUU7WUFDVixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGlCQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7U0FDbEQ7S0FDRixDQUFDLENBQUM7SUFDSCx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRTlELE1BQU0sRUFBRSxHQUFHLElBQUksK0JBQWtCLENBQUM7UUFDaEMsbUJBQW1CLEVBQUUsQ0FBQywwQkFBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLCtGQUErRjtLQUM1SSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpCLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7UUFDekIsTUFBTSxFQUFFLFlBQVk7UUFDcEIsVUFBVSxFQUFFLEdBQUc7UUFDZixXQUFXLEVBQUUsSUFBSTtRQUNqQixhQUFhLEVBQUUsS0FBSztLQUNyQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsdURBQXVEO0FBQ3ZELEVBQUU7QUFDRixrRUFBa0U7QUFDbEUsRUFBRTtBQUNGLG1GQUFtRjtBQUNuRixFQUFFO0FBQ0YsZ0lBQWdJO0FBQ2hJLDhIQUE4SDtBQUM5SCxFQUFFO0FBQ0Ysc0dBQXNHO0FBQ3RHLEVBQUU7QUFDRix3R0FBd0c7QUFDeEcsU0FBUyxTQUFTLENBQUMsTUFBaUIsRUFBRSxPQUFtQjtJQUN2RCxJQUFJLFNBQVMsR0FBZSxpQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsU0FBUyxHQUFHLFNBQVM7U0FDbEIsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFBLFVBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQztTQUM3QixVQUFVLENBQUMsT0FBTyxFQUFFLElBQUEsVUFBRyxFQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztJQUUvRCw4RkFBOEY7SUFDOUYsU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUVsRSxLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7UUFDbkQsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsR0FBRztZQUNqQyxDQUFDLENBQUMsS0FBSyxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxZQUFZLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7WUFDekUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNQLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFPO1lBQ2xDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxLQUFLLEdBQUcsVUFBVSxHQUFHLENBQUM7WUFDbEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLDhIQUE4SDtRQUM5SCxJQUFJLFdBQVcsR0FBZSxpQkFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUM3RSxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU1RSxNQUFNLGVBQWUsR0FBc0IsRUFBRSxDQUFDO1FBQzlDLElBQUksT0FBTyxFQUFFLENBQUM7WUFDWixlQUFlLENBQUMsSUFBSSxDQUFDLGlCQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLE9BQU8sR0FBRyxVQUFVLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7YUFBTSxDQUFDO1lBQ04sZUFBZSxDQUFDLElBQUksQ0FBQyxpQkFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxPQUFPLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFDRCxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUEsVUFBRyxFQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRXBELElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELFNBQVMsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxPQUFPLGlCQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLE1BQWtCLEVBQUUsT0FBNEMsRUFBRSxPQUFtQjtJQUN4RyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUM7SUFDekIsS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDMUMsTUFBTSxTQUFTLEdBQWM7WUFDM0Isa0ZBQWtGO1lBQ2xGLHFJQUFxSTtZQUNySSw4RUFBOEU7WUFDOUUsR0FBRyxDQUFDLE1BQU0sS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFBLHNCQUFlLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDN0YsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1NBQ25CLENBQUM7UUFDRixNQUFNLFdBQVcsR0FBZ0IsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sVUFBVSxHQUFrQyxFQUFFLENBQUM7UUFFckQsaUJBQWlCO1FBQ2pCLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUNqQyxXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUN0QixXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUNqQyxDQUFDO1FBRUQsS0FBSyxNQUFNLFVBQVUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xHLE1BQU0sV0FBVyxHQUFJLFdBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckQsSUFBSSxXQUFXLFlBQVksdUJBQVUsRUFBRSxDQUFDO2dCQUN0QyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsV0FBVyxDQUFDO1lBQ3ZDLENBQUM7aUJBQU0sQ0FBQztnQkFDTixVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBQSxVQUFHLEVBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUMsQ0FBQztRQUNILENBQUM7UUFFRCxpQ0FBaUM7UUFDakMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUEsVUFBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFLGlCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRTFGLGlDQUFpQztRQUNqQyxpREFBaUQ7UUFDakQsd0dBQXdHO1FBQ3hHLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzVCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBQSxVQUFHLEVBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUEsVUFBRyxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUYsV0FBVyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUEsVUFBRyxFQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxpQkFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3pGLElBQUksRUFBRSxTQUFTO2dCQUNmLE1BQU0sRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUFDLENBQUM7WUFDSixXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLElBQUEsVUFBRyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBa0IsRUFBRSxPQUFtQjtJQUMzRCxJQUFJLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsSUFBQSxVQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBQSxVQUFHLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtJQUN4RyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN4RSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0Qsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFBLFVBQUcsRUFBQyxHQUFHLENBQUMsRUFBRSxJQUFBLFVBQUcsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25GLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBQSxVQUFHLEVBQUM7UUFDakUsNEVBQTRFO1FBQzVFLG1JQUFtSTtLQUNwSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakIsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxpQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUVyRixPQUFPLGtCQUFrQixDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkRSwgRXhwcmVzc2lvbiwgRXh0ZXJuYWxNb2R1bGUsIEZyZWVGdW5jdGlvbiwgSVNjb3BlLCBNb2R1bGUsIFNlbGVjdGl2ZU1vZHVsZUltcG9ydCwgU3RhdGVtZW50LCBUaGluZ1N5bWJvbCwgVHlwZSwgVHlwZVNjcmlwdFJlbmRlcmVyLCBjb2RlLCBleHByIH0gZnJvbSAnQGNka2xhYnMvdHlwZXdyaXRlcic7XG5pbXBvcnQgeyBFc0xpbnRSdWxlcyB9IGZyb20gJ0BjZGtsYWJzL3R5cGV3cml0ZXIvbGliL2VzbGludC1ydWxlcyc7XG5pbXBvcnQgKiBhcyBwcmV0dGllciBmcm9tICdwcmV0dGllcic7XG5pbXBvcnQgeyBnZW5lcmF0ZURlZmF1bHQsIGxpdCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDbGlDb25maWcsIENsaU9wdGlvbiwgWWFyZ3NPcHRpb24gfSBmcm9tICcuL3lhcmdzLXR5cGVzJztcblxuLy8gdG8gaW1wb3J0IGxvZGFzaC5jbG9uZWRlZXAgcHJvcGVybHksIHdlIHdvdWxkIG5lZWQgdG8gc2V0IGVzTW9kdWxlSW50ZXJvcDogdHJ1ZVxuLy8gaG93ZXZlciB0aGF0IHNldHRpbmcgZG9lcyBub3Qgd29yayBpbiB0aGUgQ0xJLCBzbyB3ZSBmdWRnZSBpdC5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCBjbG9uZURlZXAgPSByZXF1aXJlKCdsb2Rhc2guY2xvbmVkZWVwJyk7XG5cbmV4cG9ydCBjbGFzcyBDbGlIZWxwZXJzIGV4dGVuZHMgRXh0ZXJuYWxNb2R1bGUge1xuICBwdWJsaWMgcmVhZG9ubHkgYnJvd3NlckZvclBsYXRmb3JtID0gbWFrZUNhbGxhYmxlRXhwcih0aGlzLCAnYnJvd3NlckZvclBsYXRmb3JtJyk7XG4gIHB1YmxpYyByZWFkb25seSBjbGlWZXJzaW9uID0gbWFrZUNhbGxhYmxlRXhwcih0aGlzLCAnY2xpVmVyc2lvbicpO1xuICBwdWJsaWMgcmVhZG9ubHkgaXNDSSA9IG1ha2VDYWxsYWJsZUV4cHIodGhpcywgJ2lzQ0knKTtcbiAgcHVibGljIHJlYWRvbmx5IHlhcmdzTmVnYXRpdmVBbGlhcyA9IG1ha2VDYWxsYWJsZUV4cHIodGhpcywgJ3lhcmdzTmVnYXRpdmVBbGlhcycpO1xufVxuXG5mdW5jdGlvbiBtYWtlQ2FsbGFibGVFeHByKHNjb3BlOiBJU2NvcGUsIG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gJEUoZXhwci5zeW0obmV3IFRoaW5nU3ltYm9sKG5hbWUsIHNjb3BlKSkpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyWWFyZ3MoY29uZmlnOiBDbGlDb25maWcsIGhlbHBlcnM6IENsaUhlbHBlcnMpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzY29wZSA9IG5ldyBNb2R1bGUoJ2F3cy1jZGsnKTtcblxuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIHNjb3BlLmRvY3VtZW50YXRpb24ucHVzaCgnR0VORVJBVEVEIEZST00gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzLicpO1xuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goJ0RvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS4nKTtcbiAgc2NvcGUuZG9jdW1lbnRhdGlvbi5wdXNoKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cbiAgc2NvcGUuYWRkSW1wb3J0KG5ldyBTZWxlY3RpdmVNb2R1bGVJbXBvcnQoc2NvcGUsICd5YXJncycsIFsnQXJndiddKSk7XG4gIGhlbHBlcnMuaW1wb3J0KHNjb3BlLCAnaGVscGVycycpO1xuXG4gIC8vICdodHRwczovL2dpdGh1Yi5jb20veWFyZ3MveWFyZ3MvaXNzdWVzLzE5MjknLFxuICAvLyAnaHR0cHM6Ly9naXRodWIuY29tL2V2YW53L2VzYnVpbGQvaXNzdWVzLzE0OTInLFxuICBzY29wZS5hZGRJbml0aWFsaXphdGlvbihjb2RlLmNvbW1lbnQoJ2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzJykpO1xuICBzY29wZS5hZGRJbml0aWFsaXphdGlvbihjb2RlLnN0bXQuY29uc3RWYXIoY29kZS5leHByLmlkZW50KCd5YXJncycpLCBjb2RlLmV4cHIuZGlyZWN0Q29kZShcInJlcXVpcmUoJ3lhcmdzJylcIikpKTtcblxuICBjb25zdCBwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzID0gbmV3IEZyZWVGdW5jdGlvbihzY29wZSwge1xuICAgIG5hbWU6ICdwYXJzZUNvbW1hbmRMaW5lQXJndW1lbnRzJyxcbiAgICBleHBvcnQ6IHRydWUsXG4gICAgcmV0dXJuVHlwZTogVHlwZS5BTlksXG4gICAgcGFyYW1ldGVyczogW1xuICAgICAgeyBuYW1lOiAnYXJncycsIHR5cGU6IFR5cGUuYXJyYXlPZihUeXBlLlNUUklORykgfSxcbiAgICBdLFxuICB9KTtcbiAgcGFyc2VDb21tYW5kTGluZUFyZ3VtZW50cy5hZGRCb2R5KG1ha2VZYXJncyhjb25maWcsIGhlbHBlcnMpKTtcblxuICBjb25zdCB0cyA9IG5ldyBUeXBlU2NyaXB0UmVuZGVyZXIoe1xuICAgIGRpc2FibGVkRXNMaW50UnVsZXM6IFtFc0xpbnRSdWxlcy5NQVhfTEVOXSwgLy8gdGhlIGRlZmF1bHQgZGlzYWJsZWQgcnVsZXMgcmVzdWx0IGluICdEZWZpbml0aW9uIGZvciBydWxlICdwcmV0dGllci9wcmV0dGllcicgd2FzIG5vdCBmb3VuZCdcbiAgfSkucmVuZGVyKHNjb3BlKTtcblxuICByZXR1cm4gcHJldHRpZXIuZm9ybWF0KHRzLCB7XG4gICAgcGFyc2VyOiAndHlwZXNjcmlwdCcsXG4gICAgcHJpbnRXaWR0aDogMTUwLFxuICAgIHNpbmdsZVF1b3RlOiB0cnVlLFxuICAgIHRyYWlsaW5nQ29tbWE6ICdhbGwnLFxuICB9KTtcbn1cblxuLy8gVXNlIHRoZSBmb2xsb3dpbmcgY29uZmlndXJhdGlvbiBmb3IgYXJyYXkgYXJndW1lbnRzOlxuLy9cbi8vICAgICB7IHR5cGU6ICdhcnJheScsIGRlZmF1bHQ6IFtdLCBuYXJnczogMSwgcmVxdWlyZXNBcmc6IHRydWUgfVxuLy9cbi8vIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHlhcmdzIGlzIHRvIGVhdCBhbGwgc3RyaW5ncyBmb2xsb3dpbmcgYW4gYXJyYXkgYXJndW1lbnQ6XG4vL1xuLy8gICAuL3Byb2cgLS1hcmcgb25lIHR3byBwb3NpdGlvbmFsICA9PiB3aWxsIHBhcnNlIHRvIHsgYXJnOiBbJ29uZScsICd0d28nLCAncG9zaXRpb25hbCddLCBfOiBbXSB9IChzbyBubyBwb3NpdGlvbmFsIGFyZ3VtZW50cylcbi8vICAgLi9wcm9nIC0tYXJnIG9uZSB0d28gLS0gcG9zaXRpb25hbCAgPT4gZG9lcyBub3QgaGVscCwgZm9yIHJlYXNvbnMgdGhhdCBJIGNhbid0IHVuZGVyc3RhbmQuIFN0aWxsIGdldHMgcGFyc2VkIGluY29ycmVjdGx5LlxuLy9cbi8vIEJ5IHVzaW5nIHRoZSBjb25maWcgYWJvdmUsIGV2ZXJ5IC0tYXJnIHdpbGwgb25seSBjb25zdW1lIG9uZSBhcmd1bWVudCwgc28geW91IGNhbiBkbyB0aGUgZm9sbG93aW5nOlxuLy9cbi8vICAgLi9wcm9nIC0tYXJnIG9uZSAtLWFyZyB0d28gcG9zaXRpb24gID0+ICB3aWxsIHBhcnNlIHRvICB7IGFyZzogWydvbmUnLCAndHdvJ10sIF86IFsncG9zaXRpb25hbCddIH0uXG5mdW5jdGlvbiBtYWtlWWFyZ3MoY29uZmlnOiBDbGlDb25maWcsIGhlbHBlcnM6IENsaUhlbHBlcnMpOiBTdGF0ZW1lbnQge1xuICBsZXQgeWFyZ3NFeHByOiBFeHByZXNzaW9uID0gY29kZS5leHByLmlkZW50KCd5YXJncycpO1xuICB5YXJnc0V4cHIgPSB5YXJnc0V4cHJcbiAgICAuY2FsbE1ldGhvZCgnZW52JywgbGl0KCdDREsnKSlcbiAgICAuY2FsbE1ldGhvZCgndXNhZ2UnLCBsaXQoJ1VzYWdlOiBjZGsgLWEgPGNkay1hcHA+IENPTU1BTkQnKSk7XG5cbiAgLy8gd2UgbXVzdCBjb21wdXRlIGdsb2JhbCBvcHRpb25zIGZpcnN0LCBhcyB0aGV5IGFyZSBub3QgcGFydCBvZiBhbiBhcmd1bWVudCB0byBhIGNvbW1hbmQgY2FsbFxuICB5YXJnc0V4cHIgPSBtYWtlT3B0aW9ucyh5YXJnc0V4cHIsIGNvbmZpZy5nbG9iYWxPcHRpb25zLCBoZWxwZXJzKTtcblxuICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgT2JqZWN0LmtleXMoY29uZmlnLmNvbW1hbmRzKSkge1xuICAgIGNvbnN0IGNvbW1hbmRGYWN0cyA9IGNvbmZpZy5jb21tYW5kc1tjb21tYW5kXTtcbiAgICBjb25zdCBjb21tYW5kQXJnID0gY29tbWFuZEZhY3RzLmFyZ1xuICAgICAgPyBgIFske2NvbW1hbmRGYWN0cy5hcmc/Lm5hbWV9JHtjb21tYW5kRmFjdHMuYXJnPy52YXJpYWRpYyA/ICcuLicgOiAnJ31dYFxuICAgICAgOiAnJztcbiAgICBjb25zdCBhbGlhc2VzID0gY29tbWFuZEZhY3RzLmFsaWFzZXNcbiAgICAgID8gY29tbWFuZEZhY3RzLmFsaWFzZXMubWFwKChhbGlhcykgPT4gYCwgJyR7YWxpYXN9JHtjb21tYW5kQXJnfSdgKVxuICAgICAgOiAnJztcblxuICAgIC8vIG11c3QgY29tcHV0ZSBvcHRpb25zIGJlZm9yZSB3ZSBjb21wdXRlIHRoZSBmdWxsIGNvbW1hbmQsIGJlY2F1c2UgaW4geWFyZ3MsIHRoZSBvcHRpb25zIGFyZSBhbiBhcmd1bWVudCB0byB0aGUgY29tbWFuZCBjYWxsLlxuICAgIGxldCBvcHRpb25zRXhwcjogRXhwcmVzc2lvbiA9IGNvZGUuZXhwci5kaXJlY3RDb2RlKCcoeWFyZ3M6IEFyZ3YpID0+IHlhcmdzJyk7XG4gICAgb3B0aW9uc0V4cHIgPSBtYWtlT3B0aW9ucyhvcHRpb25zRXhwciwgY29tbWFuZEZhY3RzLm9wdGlvbnMgPz8ge30sIGhlbHBlcnMpO1xuXG4gICAgY29uc3QgY29tbWFuZENhbGxBcmdzOiBBcnJheTxFeHByZXNzaW9uPiA9IFtdO1xuICAgIGlmIChhbGlhc2VzKSB7XG4gICAgICBjb21tYW5kQ2FsbEFyZ3MucHVzaChjb2RlLmV4cHIuZGlyZWN0Q29kZShgWycke2NvbW1hbmR9JHtjb21tYW5kQXJnfScke2FsaWFzZXN9XWApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tbWFuZENhbGxBcmdzLnB1c2goY29kZS5leHByLmRpcmVjdENvZGUoYCcke2NvbW1hbmR9JHtjb21tYW5kQXJnfSdgKSk7XG4gICAgfVxuICAgIGNvbW1hbmRDYWxsQXJncy5wdXNoKGxpdChjb21tYW5kRmFjdHMuZGVzY3JpcHRpb24pKTtcblxuICAgIGlmIChjb21tYW5kRmFjdHMub3B0aW9ucykge1xuICAgICAgY29tbWFuZENhbGxBcmdzLnB1c2gob3B0aW9uc0V4cHIpO1xuICAgIH1cblxuICAgIHlhcmdzRXhwciA9IHlhcmdzRXhwci5jYWxsTWV0aG9kKCdjb21tYW5kJywgLi4uY29tbWFuZENhbGxBcmdzKTtcbiAgfVxuXG4gIHJldHVybiBjb2RlLnN0bXQucmV0KG1ha2VFcGlsb2d1ZSh5YXJnc0V4cHIsIGhlbHBlcnMpKTtcbn1cblxuZnVuY3Rpb24gbWFrZU9wdGlvbnMocHJlZml4OiBFeHByZXNzaW9uLCBvcHRpb25zOiB7IFtvcHRpb25OYW1lOiBzdHJpbmddOiBDbGlPcHRpb24gfSwgaGVscGVyczogQ2xpSGVscGVycykge1xuICBsZXQgb3B0aW9uc0V4cHIgPSBwcmVmaXg7XG4gIGZvciAoY29uc3Qgb3B0aW9uIG9mIE9iamVjdC5rZXlzKG9wdGlvbnMpKSB7XG4gICAgY29uc3QgdGhlT3B0aW9uOiBDbGlPcHRpb24gPSB7XG4gICAgICAvLyBNYWtlIHRoZSBkZWZhdWx0IGV4cGxpY2l0IChvdmVycmlkZGVuIGlmIHRoZSBvcHRpb24gaW5jbHVkZXMgYW4gYWN0dWFsIGRlZmF1bHQpXG4gICAgICAvLyAnbm90aWZpY2F0aW9uLWFybnMnIGlzIGEgc3BlY2lhbCBzbm93Zmxha2UgdGhhdCBzaG91bGQgYmUgZGVmYXVsdGVkIHRvICd1bmRlZmluZWQnLCBidXQgaHR0cHM6Ly9naXRodWIuY29tL3lhcmdzL3lhcmdzL2lzc3Vlcy8yNDQzXG4gICAgICAvLyBwcmV2ZW50cyB1cyBmcm9tIGRvaW5nIHNvLiBUaGlzIHNob3VsZCBiZSBjaGFuZ2VkIGlmIHRoZSBpc3N1ZSBpcyByZXNvbHZlZC5cbiAgICAgIC4uLihvcHRpb24gPT09ICdub3RpZmljYXRpb24tYXJucycgPyB7fSA6IHsgZGVmYXVsdDogZ2VuZXJhdGVEZWZhdWx0KG9wdGlvbnNbb3B0aW9uXS50eXBlKSB9KSxcbiAgICAgIC4uLm9wdGlvbnNbb3B0aW9uXSxcbiAgICB9O1xuICAgIGNvbnN0IG9wdGlvblByb3BzOiBZYXJnc09wdGlvbiA9IGNsb25lRGVlcCh0aGVPcHRpb24pO1xuICAgIGNvbnN0IG9wdGlvbkFyZ3M6IHsgW2tleTogc3RyaW5nXTogRXhwcmVzc2lvbiB9ID0ge307XG5cbiAgICAvLyBBcnJheSBkZWZhdWx0c1xuICAgIGlmIChvcHRpb25Qcm9wcy50eXBlID09PSAnYXJyYXknKSB7XG4gICAgICBvcHRpb25Qcm9wcy5uYXJncyA9IDE7XG4gICAgICBvcHRpb25Qcm9wcy5yZXF1aXJlc0FyZyA9IHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBvcHRpb25Qcm9wIG9mIE9iamVjdC5rZXlzKG9wdGlvblByb3BzKS5maWx0ZXIob3B0ID0+ICFbJ25lZ2F0aXZlQWxpYXMnXS5pbmNsdWRlcyhvcHQpKSkge1xuICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSAob3B0aW9uUHJvcHMgYXMgYW55KVtvcHRpb25Qcm9wXTtcbiAgICAgIGlmIChvcHRpb25WYWx1ZSBpbnN0YW5jZW9mIEV4cHJlc3Npb24pIHtcbiAgICAgICAgb3B0aW9uQXJnc1tvcHRpb25Qcm9wXSA9IG9wdGlvblZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9uQXJnc1tvcHRpb25Qcm9wXSA9IGxpdChvcHRpb25WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVnaXN0ZXIgdGhlIG9wdGlvbiB3aXRoIHlhcmdzXG4gICAgb3B0aW9uc0V4cHIgPSBvcHRpb25zRXhwci5jYWxsTWV0aG9kKCdvcHRpb24nLCBsaXQob3B0aW9uKSwgY29kZS5leHByLm9iamVjdChvcHRpb25BcmdzKSk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIG5lZ2F0aXZlQWxpYXNcbiAgICAvLyBXZSBuZWVkIGFuIGFkZGl0aW9uYWwgb3B0aW9uIGFuZCBhIG1pZGRsZXdhcmU6XG4gICAgLy8gLm9wdGlvbignUicsIHsgdHlwZTogJ2Jvb2xlYW4nLCBoaWRkZW46IHRydWUgfSkubWlkZGxld2FyZSh5YXJnc05lZ2F0aXZlQWxpYXMoJ1InLCAncm9sbGJhY2snKSwgdHJ1ZSlcbiAgICBpZiAodGhlT3B0aW9uLm5lZ2F0aXZlQWxpYXMpIHtcbiAgICAgIGNvbnN0IG1pZGRsZXdhcmUgPSBoZWxwZXJzLnlhcmdzTmVnYXRpdmVBbGlhcy5jYWxsKGxpdCh0aGVPcHRpb24ubmVnYXRpdmVBbGlhcyksIGxpdChvcHRpb24pKTtcbiAgICAgIG9wdGlvbnNFeHByID0gb3B0aW9uc0V4cHIuY2FsbE1ldGhvZCgnb3B0aW9uJywgbGl0KHRoZU9wdGlvbi5uZWdhdGl2ZUFsaWFzKSwgY29kZS5leHByLmxpdCh7XG4gICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgaGlkZGVuOiB0cnVlLFxuICAgICAgfSkpO1xuICAgICAgb3B0aW9uc0V4cHIgPSBvcHRpb25zRXhwci5jYWxsTWV0aG9kKCdtaWRkbGV3YXJlJywgbWlkZGxld2FyZSwgbGl0KHRydWUpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3B0aW9uc0V4cHI7XG59XG5cbmZ1bmN0aW9uIG1ha2VFcGlsb2d1ZShwcmVmaXg6IEV4cHJlc3Npb24sIGhlbHBlcnM6IENsaUhlbHBlcnMpIHtcbiAgbGV0IGNvbXBsZXRlRGVmaW5pdGlvbiA9IHByZWZpeC5jYWxsTWV0aG9kKCd2ZXJzaW9uJywgaGVscGVycy5jbGlWZXJzaW9uKCkpO1xuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgnZGVtYW5kQ29tbWFuZCcsIGxpdCgxKSwgbGl0KCcnKSk7IC8vIGp1c3QgcHJpbnQgaGVscFxuICBjb21wbGV0ZURlZmluaXRpb24gPSBjb21wbGV0ZURlZmluaXRpb24uY2FsbE1ldGhvZCgncmVjb21tZW5kQ29tbWFuZHMnKTtcbiAgY29tcGxldGVEZWZpbml0aW9uID0gY29tcGxldGVEZWZpbml0aW9uLmNhbGxNZXRob2QoJ2hlbHAnKTtcbiAgY29tcGxldGVEZWZpbml0aW9uID0gY29tcGxldGVEZWZpbml0aW9uLmNhbGxNZXRob2QoJ2FsaWFzJywgbGl0KCdoJyksIGxpdCgnaGVscCcpKTtcbiAgY29tcGxldGVEZWZpbml0aW9uID0gY29tcGxldGVEZWZpbml0aW9uLmNhbGxNZXRob2QoJ2VwaWxvZ3VlJywgbGl0KFtcbiAgICAnSWYgeW91ciBhcHAgaGFzIGEgc2luZ2xlIHN0YWNrLCB0aGVyZSBpcyBubyBuZWVkIHRvIHNwZWNpZnkgdGhlIHN0YWNrIG5hbWUnLFxuICAgICdJZiBvbmUgb2YgY2RrLmpzb24gb3Igfi8uY2RrLmpzb24gZXhpc3RzLCBvcHRpb25zIHNwZWNpZmllZCB0aGVyZSB3aWxsIGJlIHVzZWQgYXMgZGVmYXVsdHMuIFNldHRpbmdzIGluIGNkay5qc29uIHRha2UgcHJlY2VkZW5jZS4nLFxuICBdLmpvaW4oJ1xcblxcbicpKSk7XG5cbiAgY29tcGxldGVEZWZpbml0aW9uID0gY29tcGxldGVEZWZpbml0aW9uLmNhbGxNZXRob2QoJ3BhcnNlJywgY29kZS5leHByLmlkZW50KCdhcmdzJykpO1xuXG4gIHJldHVybiBjb21wbGV0ZURlZmluaXRpb247XG59XG5cbiJdfQ==