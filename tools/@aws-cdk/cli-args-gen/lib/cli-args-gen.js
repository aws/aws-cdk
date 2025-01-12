"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCliArgsType = renderCliArgsType;
const typewriter_1 = require("@cdklabs/typewriter");
const eslint_rules_1 = require("@cdklabs/typewriter/lib/eslint-rules");
const prettier = require("prettier");
const util_1 = require("./util");
async function renderCliArgsType(config) {
    const scope = new typewriter_1.Module('aws-cdk');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    scope.documentation.push('GENERATED FROM packages/aws-cdk/lib/config.ts.');
    scope.documentation.push('Do not edit by hand; all changes will be overwritten at build time from the config file.');
    scope.documentation.push('-------------------------------------------------------------------------------------------');
    const cliArgType = new typewriter_1.StructType(scope, {
        export: true,
        name: 'CliArguments',
        docs: {
            summary: 'The structure of the CLI configuration, generated from packages/aws-cdk/lib/config.ts',
        },
    });
    // add required command
    scope.addImport(new typewriter_1.SelectiveModuleImport(scope, './settings', ['Command']));
    const commandEnum = typewriter_1.Type.fromName(scope, 'Command');
    cliArgType.addProperty({
        name: '_',
        type: commandEnum,
        docs: {
            summary: 'The CLI command name',
        },
    });
    // add global options
    const globalOptionType = new typewriter_1.StructType(scope, {
        export: true,
        name: 'GlobalOptions',
        docs: {
            summary: 'Global options available to all CLI commands',
        },
    });
    for (const [optionName, option] of Object.entries(config.globalOptions)) {
        globalOptionType.addProperty({
            name: (0, util_1.kebabToCamelCase)(optionName),
            type: convertType(option.type, option.count),
            docs: {
                default: normalizeDefault(option.default, option.type),
                summary: option.desc,
                deprecated: option.deprecated ? String(option.deprecated) : undefined,
            },
            optional: true,
        });
    }
    cliArgType.addProperty({
        name: 'globalOptions',
        type: typewriter_1.Type.fromName(scope, globalOptionType.name),
        docs: {
            summary: 'Global options available to all CLI commands',
        },
        optional: true,
    });
    // add command-specific options
    for (const [commandName, command] of Object.entries(config.commands)) {
        const commandType = new typewriter_1.StructType(scope, {
            export: true,
            name: `${(0, util_1.kebabToPascal)(commandName)}Options`,
            docs: {
                summary: command.description,
                remarks: command.aliases ? `aliases: ${command.aliases.join(' ')}` : undefined,
            },
        });
        // add command level options
        for (const [optionName, option] of Object.entries(command.options ?? {})) {
            commandType.addProperty({
                name: (0, util_1.kebabToCamelCase)(optionName),
                type: convertType(option.type, option.count),
                docs: {
                    // Notification Arns is a special property where undefined and [] mean different things
                    default: optionName === 'notification-arns' ? 'undefined' : normalizeDefault(option.default, option.type),
                    summary: option.desc,
                    deprecated: option.deprecated ? String(option.deprecated) : undefined,
                    remarks: option.alias ? `aliases: ${Array.isArray(option.alias) ? option.alias.join(' ') : option.alias}` : undefined,
                },
                optional: true,
            });
        }
        // add positional argument associated with the command
        if (command.arg) {
            commandType.addProperty({
                name: command.arg.name,
                type: command.arg.variadic ? typewriter_1.Type.arrayOf(typewriter_1.Type.STRING) : typewriter_1.Type.STRING,
                docs: {
                    summary: `Positional argument for ${commandName}`,
                },
                optional: true,
            });
        }
        cliArgType.addProperty({
            name: (0, util_1.kebabToCamelCase)(commandName),
            type: typewriter_1.Type.fromName(scope, commandType.name),
            docs: {
                summary: command.description,
                remarks: command.aliases ? `aliases: ${command.aliases.join(' ')}` : undefined,
            },
            optional: true,
        });
    }
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
function convertType(type, count) {
    switch (type) {
        case 'boolean':
            return count ? typewriter_1.Type.NUMBER : typewriter_1.Type.BOOLEAN;
        case 'string':
            return typewriter_1.Type.STRING;
        case 'number':
            return typewriter_1.Type.NUMBER;
        case 'array':
            return typewriter_1.Type.arrayOf(typewriter_1.Type.STRING);
        case 'count':
            return typewriter_1.Type.NUMBER;
    }
}
function normalizeDefault(defaultValue, type) {
    switch (typeof defaultValue) {
        case 'boolean':
        case 'string':
        case 'number':
        case 'object':
            return JSON.stringify(defaultValue);
        // In these cases we cannot use the given defaultValue, so we then check the type
        // of the option to determine the default value
        case 'undefined':
        case 'function':
        default:
            const generatedDefault = (0, util_1.generateDefault)(type);
            return generatedDefault ? JSON.stringify(generatedDefault) : 'undefined';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWFyZ3MtZ2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLWFyZ3MtZ2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsOENBc0hDO0FBNUhELG9EQUEwRztBQUMxRyx1RUFBbUU7QUFDbkUscUNBQXFDO0FBQ3JDLGlDQUEwRTtBQUduRSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsTUFBaUI7SUFDdkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXBDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFFLDZGQUE2RixDQUFDLENBQUM7SUFDekgsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUMzRSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO0lBQ3JILEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDZGQUE2RixDQUFDLENBQUM7SUFFeEgsTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUFDLEtBQUssRUFBRTtRQUN2QyxNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSx1RkFBdUY7U0FDakc7S0FDRixDQUFDLENBQUM7SUFFSCx1QkFBdUI7SUFDdkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtDQUFxQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsTUFBTSxXQUFXLEdBQUcsaUJBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXBELFVBQVUsQ0FBQyxXQUFXLENBQUM7UUFDckIsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsV0FBVztRQUNqQixJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsc0JBQXNCO1NBQ2hD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LElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdEMsaUZBQWlGO1FBQ2pGLCtDQUErQztRQUMvQyxLQUFLLFdBQVcsQ0FBQztRQUNqQixLQUFLLFVBQVUsQ0FBQztRQUNoQjtZQUNFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxzQkFBZSxFQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQzdFLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlLCBTZWxlY3RpdmVNb2R1bGVJbXBvcnQsIFN0cnVjdFR5cGUsIFR5cGUsIFR5cGVTY3JpcHRSZW5kZXJlciB9IGZyb20gJ0BjZGtsYWJzL3R5cGV3cml0ZXInO1xuaW1wb3J0IHsgRXNMaW50UnVsZXMgfSBmcm9tICdAY2RrbGFicy90eXBld3JpdGVyL2xpYi9lc2xpbnQtcnVsZXMnO1xuaW1wb3J0ICogYXMgcHJldHRpZXIgZnJvbSAncHJldHRpZXInO1xuaW1wb3J0IHsgZ2VuZXJhdGVEZWZhdWx0LCBrZWJhYlRvQ2FtZWxDYXNlLCBrZWJhYlRvUGFzY2FsIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IENsaUNvbmZpZyB9IGZyb20gJy4veWFyZ3MtdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVuZGVyQ2xpQXJnc1R5cGUoY29uZmlnOiBDbGlDb25maWcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzY29wZSA9IG5ldyBNb2R1bGUoJ2F3cy1jZGsnKTtcblxuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goICctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gIHNjb3BlLmRvY3VtZW50YXRpb24ucHVzaCgnR0VORVJBVEVEIEZST00gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzLicpO1xuICBzY29wZS5kb2N1bWVudGF0aW9uLnB1c2goJ0RvIG5vdCBlZGl0IGJ5IGhhbmQ7IGFsbCBjaGFuZ2VzIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYXQgYnVpbGQgdGltZSBmcm9tIHRoZSBjb25maWcgZmlsZS4nKTtcbiAgc2NvcGUuZG9jdW1lbnRhdGlvbi5wdXNoKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cbiAgY29uc3QgY2xpQXJnVHlwZSA9IG5ldyBTdHJ1Y3RUeXBlKHNjb3BlLCB7XG4gICAgZXhwb3J0OiB0cnVlLFxuICAgIG5hbWU6ICdDbGlBcmd1bWVudHMnLFxuICAgIGRvY3M6IHtcbiAgICAgIHN1bW1hcnk6ICdUaGUgc3RydWN0dXJlIG9mIHRoZSBDTEkgY29uZmlndXJhdGlvbiwgZ2VuZXJhdGVkIGZyb20gcGFja2FnZXMvYXdzLWNkay9saWIvY29uZmlnLnRzJyxcbiAgICB9LFxuICB9KTtcblxuICAvLyBhZGQgcmVxdWlyZWQgY29tbWFuZFxuICBzY29wZS5hZGRJbXBvcnQobmV3IFNlbGVjdGl2ZU1vZHVsZUltcG9ydChzY29wZSwgJy4vc2V0dGluZ3MnLCBbJ0NvbW1hbmQnXSkpO1xuICBjb25zdCBjb21tYW5kRW51bSA9IFR5cGUuZnJvbU5hbWUoc2NvcGUsICdDb21tYW5kJyk7XG5cbiAgY2xpQXJnVHlwZS5hZGRQcm9wZXJ0eSh7XG4gICAgbmFtZTogJ18nLFxuICAgIHR5cGU6IGNvbW1hbmRFbnVtLFxuICAgIGRvY3M6IHtcbiAgICAgIHN1bW1hcnk6ICdUaGUgQ0xJIGNvbW1hbmQgbmFtZScsXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gYWRkIGdsb2JhbCBvcHRpb25zXG4gIGNvbnN0IGdsb2JhbE9wdGlvblR5cGUgPSBuZXcgU3RydWN0VHlwZShzY29wZSwge1xuICAgIGV4cG9ydDogdHJ1ZSxcbiAgICBuYW1lOiAnR2xvYmFsT3B0aW9ucycsXG4gICAgZG9jczoge1xuICAgICAgc3VtbWFyeTogJ0dsb2JhbCBvcHRpb25zIGF2YWlsYWJsZSB0byBhbGwgQ0xJIGNvbW1hbmRzJyxcbiAgICB9LFxuICB9KTtcbiAgZm9yIChjb25zdCBbb3B0aW9uTmFtZSwgb3B0aW9uXSBvZiBPYmplY3QuZW50cmllcyhjb25maWcuZ2xvYmFsT3B0aW9ucykpIHtcbiAgICBnbG9iYWxPcHRpb25UeXBlLmFkZFByb3BlcnR5KHtcbiAgICAgIG5hbWU6IGtlYmFiVG9DYW1lbENhc2Uob3B0aW9uTmFtZSksXG4gICAgICB0eXBlOiBjb252ZXJ0VHlwZShvcHRpb24udHlwZSwgb3B0aW9uLmNvdW50KSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgZGVmYXVsdDogbm9ybWFsaXplRGVmYXVsdChvcHRpb24uZGVmYXVsdCwgb3B0aW9uLnR5cGUpLFxuICAgICAgICBzdW1tYXJ5OiBvcHRpb24uZGVzYyxcbiAgICAgICAgZGVwcmVjYXRlZDogb3B0aW9uLmRlcHJlY2F0ZWQgPyBTdHJpbmcob3B0aW9uLmRlcHJlY2F0ZWQpIDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgY2xpQXJnVHlwZS5hZGRQcm9wZXJ0eSh7XG4gICAgbmFtZTogJ2dsb2JhbE9wdGlvbnMnLFxuICAgIHR5cGU6IFR5cGUuZnJvbU5hbWUoc2NvcGUsIGdsb2JhbE9wdGlvblR5cGUubmFtZSksXG4gICAgZG9jczoge1xuICAgICAgc3VtbWFyeTogJ0dsb2JhbCBvcHRpb25zIGF2YWlsYWJsZSB0byBhbGwgQ0xJIGNvbW1hbmRzJyxcbiAgICB9LFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9KTtcblxuICAvLyBhZGQgY29tbWFuZC1zcGVjaWZpYyBvcHRpb25zXG4gIGZvciAoY29uc3QgW2NvbW1hbmROYW1lLCBjb21tYW5kXSBvZiBPYmplY3QuZW50cmllcyhjb25maWcuY29tbWFuZHMpKSB7XG4gICAgY29uc3QgY29tbWFuZFR5cGUgPSBuZXcgU3RydWN0VHlwZShzY29wZSwge1xuICAgICAgZXhwb3J0OiB0cnVlLFxuICAgICAgbmFtZTogYCR7a2ViYWJUb1Bhc2NhbChjb21tYW5kTmFtZSl9T3B0aW9uc2AsXG4gICAgICBkb2NzOiB7XG4gICAgICAgIHN1bW1hcnk6IGNvbW1hbmQuZGVzY3JpcHRpb24sXG4gICAgICAgIHJlbWFya3M6IGNvbW1hbmQuYWxpYXNlcyA/IGBhbGlhc2VzOiAke2NvbW1hbmQuYWxpYXNlcy5qb2luKCcgJyl9YCA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBhZGQgY29tbWFuZCBsZXZlbCBvcHRpb25zXG4gICAgZm9yIChjb25zdCBbb3B0aW9uTmFtZSwgb3B0aW9uXSBvZiBPYmplY3QuZW50cmllcyhjb21tYW5kLm9wdGlvbnMgPz8ge30pKSB7XG4gICAgICBjb21tYW5kVHlwZS5hZGRQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6IGtlYmFiVG9DYW1lbENhc2Uob3B0aW9uTmFtZSksXG4gICAgICAgIHR5cGU6IGNvbnZlcnRUeXBlKG9wdGlvbi50eXBlLCBvcHRpb24uY291bnQpLFxuICAgICAgICBkb2NzOiB7XG4gICAgICAgICAgLy8gTm90aWZpY2F0aW9uIEFybnMgaXMgYSBzcGVjaWFsIHByb3BlcnR5IHdoZXJlIHVuZGVmaW5lZCBhbmQgW10gbWVhbiBkaWZmZXJlbnQgdGhpbmdzXG4gICAgICAgICAgZGVmYXVsdDogb3B0aW9uTmFtZSA9PT0gJ25vdGlmaWNhdGlvbi1hcm5zJyA/ICd1bmRlZmluZWQnIDogbm9ybWFsaXplRGVmYXVsdChvcHRpb24uZGVmYXVsdCwgb3B0aW9uLnR5cGUpLFxuICAgICAgICAgIHN1bW1hcnk6IG9wdGlvbi5kZXNjLFxuICAgICAgICAgIGRlcHJlY2F0ZWQ6IG9wdGlvbi5kZXByZWNhdGVkID8gU3RyaW5nKG9wdGlvbi5kZXByZWNhdGVkKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICByZW1hcmtzOiBvcHRpb24uYWxpYXMgPyBgYWxpYXNlczogJHtBcnJheS5pc0FycmF5KG9wdGlvbi5hbGlhcykgPyBvcHRpb24uYWxpYXMuam9pbignICcpIDogb3B0aW9uLmFsaWFzfWAgOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHBvc2l0aW9uYWwgYXJndW1lbnQgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb21tYW5kXG4gICAgaWYgKGNvbW1hbmQuYXJnKSB7XG4gICAgICBjb21tYW5kVHlwZS5hZGRQcm9wZXJ0eSh7XG4gICAgICAgIG5hbWU6IGNvbW1hbmQuYXJnLm5hbWUsXG4gICAgICAgIHR5cGU6IGNvbW1hbmQuYXJnLnZhcmlhZGljID8gVHlwZS5hcnJheU9mKFR5cGUuU1RSSU5HKSA6IFR5cGUuU1RSSU5HLFxuICAgICAgICBkb2NzOiB7XG4gICAgICAgICAgc3VtbWFyeTogYFBvc2l0aW9uYWwgYXJndW1lbnQgZm9yICR7Y29tbWFuZE5hbWV9YCxcbiAgICAgICAgfSxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjbGlBcmdUeXBlLmFkZFByb3BlcnR5KHtcbiAgICAgIG5hbWU6IGtlYmFiVG9DYW1lbENhc2UoY29tbWFuZE5hbWUpLFxuICAgICAgdHlwZTogVHlwZS5mcm9tTmFtZShzY29wZSwgY29tbWFuZFR5cGUubmFtZSksXG4gICAgICBkb2NzOiB7XG4gICAgICAgIHN1bW1hcnk6IGNvbW1hbmQuZGVzY3JpcHRpb24sXG4gICAgICAgIHJlbWFya3M6IGNvbW1hbmQuYWxpYXNlcyA/IGBhbGlhc2VzOiAke2NvbW1hbmQuYWxpYXNlcy5qb2luKCcgJyl9YCA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHRzID0gbmV3IFR5cGVTY3JpcHRSZW5kZXJlcih7XG4gICAgZGlzYWJsZWRFc0xpbnRSdWxlczogW0VzTGludFJ1bGVzLk1BWF9MRU5dLCAvLyB0aGUgZGVmYXVsdCBkaXNhYmxlZCBydWxlcyByZXN1bHQgaW4gJ0RlZmluaXRpb24gZm9yIHJ1bGUgJ3ByZXR0aWVyL3ByZXR0aWVyJyB3YXMgbm90IGZvdW5kJ1xuICB9KS5yZW5kZXIoc2NvcGUpO1xuXG4gIHJldHVybiBwcmV0dGllci5mb3JtYXQodHMsIHtcbiAgICBwYXJzZXI6ICd0eXBlc2NyaXB0JyxcbiAgICBwcmludFdpZHRoOiAxNTAsXG4gICAgc2luZ2xlUXVvdGU6IHRydWUsXG4gICAgcXVvdGVQcm9wczogJ2NvbnNpc3RlbnQnLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gY29udmVydFR5cGUodHlwZTogJ3N0cmluZycgfCAnYXJyYXknIHwgJ251bWJlcicgfCAnYm9vbGVhbicgfCAnY291bnQnLCBjb3VudD86IGJvb2xlYW4pOiBUeXBlIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gY291bnQgPyBUeXBlLk5VTUJFUiA6IFR5cGUuQk9PTEVBTjtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIFR5cGUuU1RSSU5HO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gVHlwZS5OVU1CRVI7XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIFR5cGUuYXJyYXlPZihUeXBlLlNUUklORyk7XG4gICAgY2FzZSAnY291bnQnOlxuICAgICAgcmV0dXJuIFR5cGUuTlVNQkVSO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZURlZmF1bHQoZGVmYXVsdFZhbHVlOiBhbnksIHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHN3aXRjaCAodHlwZW9mIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRlZmF1bHRWYWx1ZSk7XG5cbiAgICAvLyBJbiB0aGVzZSBjYXNlcyB3ZSBjYW5ub3QgdXNlIHRoZSBnaXZlbiBkZWZhdWx0VmFsdWUsIHNvIHdlIHRoZW4gY2hlY2sgdGhlIHR5cGVcbiAgICAvLyBvZiB0aGUgb3B0aW9uIHRvIGRldGVybWluZSB0aGUgZGVmYXVsdCB2YWx1ZVxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgIGRlZmF1bHQ6XG4gICAgICBjb25zdCBnZW5lcmF0ZWREZWZhdWx0ID0gZ2VuZXJhdGVEZWZhdWx0KHR5cGUpO1xuICAgICAgcmV0dXJuIGdlbmVyYXRlZERlZmF1bHQgPyBKU09OLnN0cmluZ2lmeShnZW5lcmF0ZWREZWZhdWx0KSA6ICd1bmRlZmluZWQnO1xuICB9XG59XG4iXX0=