"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCliArgsFunc = renderCliArgsFunc;
const typewriter_1 = require("@cdklabs/typewriter");
const eslint_rules_1 = require("@cdklabs/typewriter/lib/eslint-rules");
const prettier = require("prettier");
const util_1 = require("./util");
async function renderCliArgsFunc(config) {
    const scope = new typewriter_1.Module('aws-cdk');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
    scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    scope.addImport(new typewriter_1.SelectiveModuleImport(scope, './cli-arguments', ['CliArguments', 'GlobalOptions']));
    const cliArgType = typewriter_1.Type.fromName(scope, 'CliArguments');
    scope.addImport(new typewriter_1.SelectiveModuleImport(scope, './settings', ['Command']));
    const createCliArguments = new typewriter_1.FreeFunction(scope, {
        name: 'convertToCliArgs',
        export: true,
        returnType: cliArgType,
        parameters: [
            { name: 'args', type: typewriter_1.Type.ANY },
        ],
    });
    createCliArguments.addBody(typewriter_1.code.expr.directCode(buildCliArgsFunction(config)));
    const ts = new typewriter_1.TypeScriptRenderer({
        disabledEsLintRules: [eslint_rules_1.EsLintRules.MAX_LEN], // the default disabled rules result in 'Definition for rule 'prettier/prettier' was not found'
    }).render(scope);
    return prettier.format(ts, {
        parser: 'typescript',
        printWidth: 150,
        singleQuote: true,
        quoteProps: 'consistent',
    });
}
function buildCliArgsFunction(config) {
    const globalOptions = buildGlobalOptions(config);
    const commandSwitch = buildCommandSwitch(config);
    const cliArgs = buildCliArgs();
    return [
        globalOptions,
        commandSwitch,
        cliArgs,
    ].join('\n');
}
function buildGlobalOptions(config) {
    const globalOptionExprs = ['const globalOptions: GlobalOptions = {'];
    for (const optionName of Object.keys(config.globalOptions)) {
        const name = (0, util_1.kebabToCamelCase)(optionName);
        globalOptionExprs.push(`'${name}': args.${name},`);
    }
    globalOptionExprs.push('}');
    return globalOptionExprs.join('\n');
}
function buildCommandSwitch(config) {
    const commandSwitchExprs = ['let commandOptions;', 'switch (args._[0] as Command) {'];
    for (const commandName of Object.keys(config.commands)) {
        commandSwitchExprs.push(`case '${commandName}':`, 'commandOptions = {', ...buildCommandOptions(config.commands[commandName]), ...(config.commands[commandName].arg ? [buildPositionalArguments(config.commands[commandName].arg)] : []), '};', `break;
    `);
    }
    commandSwitchExprs.push('}');
    return commandSwitchExprs.join('\n');
}
function buildCommandOptions(options) {
    const commandOptions = [];
    for (const optionName of Object.keys(options.options ?? {})) {
        const name = (0, util_1.kebabToCamelCase)(optionName);
        commandOptions.push(`'${name}': args.${name},`);
    }
    return commandOptions;
}
function buildPositionalArguments(arg) {
    if (arg.variadic) {
        return `${arg.name}: args.${arg.name}`;
    }
    return `${arg.name}: args.${arg.name}`;
}
function buildCliArgs() {
    return [
        'const cliArguments: CliArguments = {',
        '_: args._[0],',
        'globalOptions,',
        '[args._[0]]: commandOptions',
        '}',
        '',
        'return cliArguments',
    ].join('\n');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWFyZ3MtZnVuY3Rpb24tZ2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLWFyZ3MtZnVuY3Rpb24tZ2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsOENBaUNDO0FBdkNELG9EQUFrSDtBQUNsSCx1RUFBbUU7QUFDbkUscUNBQXFDO0FBQ3JDLGlDQUEwQztBQUduQyxLQUFLLFVBQVUsaUJBQWlCLENBQUMsTUFBaUI7SUFDdkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLDZGQUE2RixDQUFDLENBQUM7SUFDekgsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUMzRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO0lBQ3JILEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDZGQUE2RixDQUFDLENBQUM7SUFFeEgsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtDQUFxQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEcsTUFBTSxVQUFVLEdBQUcsaUJBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRXhELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxrQ0FBcUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx5QkFBWSxDQUFDLEtBQUssRUFBRTtRQUNqRCxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLE1BQU0sRUFBRSxJQUFJO1FBQ1osVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBVSxFQUFFO1lBQ1YsRUFBRSxJQUFJLEVB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TUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBZ0IsRUFBQyxVQUFVLENBQUMsQ0FBQztRQUMxQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxXQUFXLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLEdBQXdDO0lBQ3hFLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBQ0QsT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pDLENBQUM7QUFFRCxTQUFTLFlBQVk7SUFDbkIsT0FBTztRQUNMLHNDQUFzQztRQUN0QyxlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLDZCQUE2QjtRQUM3QixHQUFHO1FBQ0gsRUFBRTtRQUNGLHFCQUFxQjtLQUN0QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb2RlLCBGcmVlRnVuY3Rpb24sIE1vZHVsZSwgU2VsZWN0aXZlTW9kdWxlSW1wb3J0LCBUeXBlLCBUeXBlU2NyaXB0UmVuZGVyZXIgfSBmcm9tICdAY2RrbGFicy90eXBld3JpdGVyJztcbmltcG9ydCB7IEVzTGludFJ1bGVzIH0gZnJvbSAnQGNka2xhYnMvdHlwZXdyaXRlci9saWIvZXNsaW50LXJ1bGVzJztcbmltcG9ydCAqIGFzIHByZXR0aWVyIGZyb20gJ3ByZXR0aWVyJztcbmltcG9ydCB7IGtlYmFiVG9DYW1lbENhc2UgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2xpQWN0aW9uLCBDbGlDb25maWcgfSBmcm9tICcuL3lhcmdzLXR5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlckNsaUFyZ3NGdW5jKGNvbmZpZzogQ2xpQ29uZmlnKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc2NvcGUgPSBuZXcgTW9kdWxlKCdhd3MtY2RrJyk7XG5cbiAgc2NvcGUuZG9jdW1lbnRhdGlvbi5wdXNoKCAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goJ0dFTkVSQVRFRCBGUk9NIHBhY2thZ2VzL2F3cy1jZGsvbGliL2NvbmZpZy50cy4nKTtcbiAgc2NvcGUuZG9jdW1lbnRhdGlvbi5wdXNoKCdEbyBub3QgZWRpdCBieSBoYW5kOyBhbGwgY2hhbmdlcyB3aWxsIGJlIG92ZXJ3cml0dGVuIGF0IGJ1aWxkIHRpbWUgZnJvbSB0aGUgY29uZmlnIGZpbGUuJyk7XG4gIHNjb3BlLmRvY3VtZW50YXRpb24ucHVzaCgnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG4gIHNjb3BlLmFkZEltcG9ydChuZXcgU2VsZWN0aXZlTW9kdWxlSW1wb3J0KHNjb3BlLCAnLi9jbGktYXJndW1lbnRzJywgWydDbGlBcmd1bWVudHMnLCAnR2xvYmFsT3B0aW9ucyddKSk7XG4gIGNvbnN0IGNsaUFyZ1R5cGUgPSBUeXBlLmZyb21OYW1lKHNjb3BlLCAnQ2xpQXJndW1lbnRzJyk7XG5cbiAgc2NvcGUuYWRkSW1wb3J0KG5ldyBTZWxlY3RpdmVNb2R1bGVJbXBvcnQoc2NvcGUsICcuL3NldHRpbmdzJywgWydDb21tYW5kJ10pKTtcblxuICBjb25zdCBjcmVhdGVDbGlBcmd1bWVudHMgPSBuZXcgRnJlZUZ1bmN0aW9uKHNjb3BlLCB7XG4gICAgbmFtZTogJ2NvbnZlcnRUb0NsaUFyZ3MnLFxuICAgIGV4cG9ydDogdHJ1ZSxcbiAgICByZXR1cm5UeXBlOiBjbGlBcmdUeXBlLFxuICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgIHsgbmFtZTogJ2FyZ3MnLCB0eXBlOiBUeXBlLkFOWSB9LFxuICAgIF0sXG4gIH0pO1xuICBjcmVhdGVDbGlBcmd1bWVudHMuYWRkQm9keShjb2RlLmV4cHIuZGlyZWN0Q29kZShidWlsZENsaUFyZ3NGdW5jdGlvbihjb25maWcpKSk7XG5cbiAgY29uc3QgdHMgPSBuZXcgVHlwZVNjcmlwdFJlbmRlcmVyKHtcbiAgICBkaXNhYmxlZEVzTGludFJ1bGVzOiBbRXNMaW50UnVsZXMuTUFYX0xFTl0sIC8vIHRoZSBkZWZhdWx0IGRpc2FibGVkIHJ1bGVzIHJlc3VsdCBpbiAnRGVmaW5pdGlvbiBmb3IgcnVsZSAncHJldHRpZXIvcHJldHRpZXInIHdhcyBub3QgZm91bmQnXG4gIH0pLnJlbmRlcihzY29wZSk7XG5cbiAgcmV0dXJuIHByZXR0aWVyLmZvcm1hdCh0cywge1xuICAgIHBhcnNlcjogJ3R5cGVzY3JpcHQnLFxuICAgIHByaW50V2lkdGg6IDE1MCxcbiAgICBzaW5nbGVRdW90ZTogdHJ1ZSxcbiAgICBxdW90ZVByb3BzOiAnY29uc2lzdGVudCcsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBidWlsZENsaUFyZ3NGdW5jdGlvbihjb25maWc6IENsaUNvbmZpZyk6IHN0cmluZyB7XG4gIGNvbnN0IGdsb2JhbE9wdGlvbnMgPSBidWlsZEdsb2JhbE9wdGlvbnMoY29uZmlnKTtcbiAgY29uc3QgY29tbWFuZFN3aXRjaCA9IGJ1aWxkQ29tbWFuZFN3aXRjaChjb25maWcpO1xuICBjb25zdCBjbGlBcmdzID0gYnVpbGRDbGlBcmdzKCk7XG4gIHJldHVybiBbXG4gICAgZ2xvYmFsT3B0aW9ucyxcbiAgICBjb21tYW5kU3dpdGNoLFxuICAgIGNsaUFyZ3MsXG4gIF0uam9pbignXFxuJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkR2xvYmFsT3B0aW9ucyhjb25maWc6IENsaUNvbmZpZyk6IHN0cmluZyB7XG4gIGNvbnN0IGdsb2JhbE9wdGlvbkV4cHJzID0gWydjb25zdCBnbG9iYWxPcHRpb25zOiBHbG9iYWxPcHRpb25zID0geyddO1xuICBmb3IgKGNvbnN0IG9wdGlvbk5hbWUgb2YgT2JqZWN0LmtleXMoY29uZmlnLmdsb2JhbE9wdGlvbnMpKSB7XG4gICAgY29uc3QgbmFtZSA9IGtlYmFiVG9DYW1lbENhc2Uob3B0aW9uTmFtZSk7XG4gICAgZ2xvYmFsT3B0aW9uRXhwcnMucHVzaChgJyR7bmFtZX0nOiBhcmdzLiR7bmFtZX0sYCk7XG4gIH1cbiAgZ2xvYmFsT3B0aW9uRXhwcnMucHVzaCgnfScpO1xuICByZXR1cm4gZ2xvYmFsT3B0aW9uRXhwcnMuam9pbignXFxuJyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29tbWFuZFN3aXRjaChjb25maWc6IENsaUNvbmZpZyk6IHN0cmluZyB7XG4gIGNvbnN0IGNvbW1hbmRTd2l0Y2hFeHBycyA9IFsnbGV0IGNvbW1hbmRPcHRpb25zOycsICdzd2l0Y2ggKGFyZ3MuX1swXSBhcyBDb21tYW5kKSB7J107XG4gIGZvciAoY29uc3QgY29tbWFuZE5hbWUgb2YgT2JqZWN0LmtleXMoY29uZmlnLmNvbW1hbmRzKSkge1xuICAgIGNvbW1hbmRTd2l0Y2hFeHBycy5wdXNoKFxuICAgICAgYGNhc2UgJyR7Y29tbWFuZE5hbWV9JzpgLFxuICAgICAgJ2NvbW1hbmRPcHRpb25zID0geycsXG4gICAgICAuLi5idWlsZENvbW1hbmRPcHRpb25zKGNvbmZpZy5jb21tYW5kc1tjb21tYW5kTmFtZV0pLFxuICAgICAgLi4uKGNvbmZpZy5jb21tYW5kc1tjb21tYW5kTmFtZV0uYXJnID8gW2J1aWxkUG9zaXRpb25hbEFyZ3VtZW50cyhjb25maWcuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFyZyldIDogW10pLFxuICAgICAgJ307JyxcbiAgICAgIGBicmVhaztcbiAgICBgKTtcbiAgfVxuICBjb21tYW5kU3dpdGNoRXhwcnMucHVzaCgnfScpO1xuICByZXR1cm4gY29tbWFuZFN3aXRjaEV4cHJzLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiBidWlsZENvbW1hbmRPcHRpb25zKG9wdGlvbnM6IENsaUFjdGlvbik6IHN0cmluZ1tdIHtcbiAgY29uc3QgY29tbWFuZE9wdGlvbnM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3Qgb3B0aW9uTmFtZSBvZiBPYmplY3Qua2V5cyhvcHRpb25zLm9wdGlvbnMgPz8ge30pKSB7XG4gICAgY29uc3QgbmFtZSA9IGtlYmFiVG9DYW1lbENhc2Uob3B0aW9uTmFtZSk7XG4gICAgY29tbWFuZE9wdGlvbnMucHVzaChgJyR7bmFtZX0nOiBhcmdzLiR7bmFtZX0sYCk7XG4gIH1cbiAgcmV0dXJuIGNvbW1hbmRPcHRpb25zO1xufVxuXG5mdW5jdGlvbiBidWlsZFBvc2l0aW9uYWxBcmd1bWVudHMoYXJnOiB7IG5hbWU6IHN0cmluZzsgdmFyaWFkaWM6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gIGlmIChhcmcudmFyaWFkaWMpIHtcbiAgICByZXR1cm4gYCR7YXJnLm5hbWV9OiBhcmdzLiR7YXJnLm5hbWV9YDtcbiAgfVxuICByZXR1cm4gYCR7YXJnLm5hbWV9OiBhcmdzLiR7YXJnLm5hbWV9YDtcbn1cblxuZnVuY3Rpb24gYnVpbGRDbGlBcmdzKCk6IHN0cmluZyB7XG4gIHJldHVybiBbXG4gICAgJ2NvbnN0IGNsaUFyZ3VtZW50czogQ2xpQXJndW1lbnRzID0geycsXG4gICAgJ186IGFyZ3MuX1swXSwnLFxuICAgICdnbG9iYWxPcHRpb25zLCcsXG4gICAgJ1thcmdzLl9bMF1dOiBjb21tYW5kT3B0aW9ucycsXG4gICAgJ30nLFxuICAgICcnLFxuICAgICdyZXR1cm4gY2xpQXJndW1lbnRzJyxcbiAgXS5qb2luKCdcXG4nKTtcbn1cbiJdfQ==