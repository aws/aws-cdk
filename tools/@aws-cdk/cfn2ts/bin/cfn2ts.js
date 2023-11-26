#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const yargs = require("yargs");
const lib_1 = require("../lib");
/* eslint-disable no-console */
/* eslint-disable max-len */
async function main() {
    const argv = yargs.usage('Usage: cfn2ts')
        .option('scope', { type: 'string', array: true, desc: 'Scope to generate TypeScript for (e.g: AWS::IAM)' })
        .option('out', { type: 'string', desc: 'Path to the directory where the TypeScript files should be written', default: 'lib' })
        .option('core-import', { type: 'string', desc: 'The typescript import to use for the CDK core module. Can also be defined in package.json under "cdk-build.cfn2ts-core-import"', default: '@aws-cdk/core' })
        .epilog('if --scope is not defined, cfn2ts will try to obtain the scope from the local package.json under the "cdk-build.cloudformation" key.')
        .argv;
    const pkg = await tryReadPackageJson();
    if (!argv.scope) {
        argv.scope = await tryAutoDetectScope(pkg);
    }
    // read "cfn2ts-core-import" from package.json
    const coreImport = pkg?.['cdk-build']?.['cfn2ts-core-import'];
    if (coreImport) {
        argv['core-import'] = coreImport;
    }
    if (!argv.scope) {
        throw new Error('--scope is not provided and cannot be auto-detected from package.json (under "cdk-build.cloudformation")');
    }
    await (0, lib_1.default)(argv.scope, argv.out, {
        coreImport: argv['core-import'],
    });
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
async function tryAutoDetectScope(pkg) {
    const value = pkg['cdk-build'] && pkg['cdk-build'].cloudformation;
    return value && (typeof value === 'string' ? [value] : value);
}
async function tryReadPackageJson() {
    if (!await fs.pathExists('./package.json')) {
        return undefined;
    }
    return fs.readJSON('./package.json');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuMnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuMnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDL0IsZ0NBQThCO0FBRTlCLCtCQUErQjtBQUMvQiw0QkFBNEI7QUFFNUIsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7U0FDdEMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsa0RBQWtELEVBQUUsQ0FBQztTQUMxRyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsb0VBQW9FLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQzdILE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnSUFBZ0ksRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLENBQUM7U0FDM00sTUFBTSxDQUFDLHNJQUFzSSxDQUFDO1NBQzlJLElBQUksQ0FBQztJQUVSLE1BQU0sR0FBRyxHQUFHLE1BQU0sa0JBQWtCLEVBQUUsQ0FBQztJQUV2QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM1QztJQUVELDhDQUE4QztJQUM5QyxNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDOUQsSUFBSSxVQUFVLEVBQUU7UUFDZCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsVUFBVSxDQUFDO0tBQ2xDO0lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDZixNQUFNLElBQUksS0FBSyxDQUFDLDBHQUEwRyxDQUFDLENBQUM7S0FDN0g7SUFFRCxNQUFNLElBQUEsYUFBUSxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNuQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUNoQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxHQUFRO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsY0FBYyxDQUFDO0lBQ2xFLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsS0FBSyxVQUFVLGtCQUFrQjtJQUMvQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDMUMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN2QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IGdlbmVyYXRlIGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgYXJndiA9IHlhcmdzLnVzYWdlKCdVc2FnZTogY2ZuMnRzJylcbiAgICAub3B0aW9uKCdzY29wZScsIHsgdHlwZTogJ3N0cmluZycsIGFycmF5OiB0cnVlLCBkZXNjOiAnU2NvcGUgdG8gZ2VuZXJhdGUgVHlwZVNjcmlwdCBmb3IgKGUuZzogQVdTOjpJQU0pJyB9KVxuICAgIC5vcHRpb24oJ291dCcsIHsgdHlwZTogJ3N0cmluZycsIGRlc2M6ICdQYXRoIHRvIHRoZSBkaXJlY3Rvcnkgd2hlcmUgdGhlIFR5cGVTY3JpcHQgZmlsZXMgc2hvdWxkIGJlIHdyaXR0ZW4nLCBkZWZhdWx0OiAnbGliJyB9KVxuICAgIC5vcHRpb24oJ2NvcmUtaW1wb3J0JywgeyB0eXBlOiAnc3RyaW5nJywgZGVzYzogJ1RoZSB0eXBlc2NyaXB0IGltcG9ydCB0byB1c2UgZm9yIHRoZSBDREsgY29yZSBtb2R1bGUuIENhbiBhbHNvIGJlIGRlZmluZWQgaW4gcGFja2FnZS5qc29uIHVuZGVyIFwiY2RrLWJ1aWxkLmNmbjJ0cy1jb3JlLWltcG9ydFwiJywgZGVmYXVsdDogJ0Bhd3MtY2RrL2NvcmUnIH0pXG4gICAgLmVwaWxvZygnaWYgLS1zY29wZSBpcyBub3QgZGVmaW5lZCwgY2ZuMnRzIHdpbGwgdHJ5IHRvIG9idGFpbiB0aGUgc2NvcGUgZnJvbSB0aGUgbG9jYWwgcGFja2FnZS5qc29uIHVuZGVyIHRoZSBcImNkay1idWlsZC5jbG91ZGZvcm1hdGlvblwiIGtleS4nKVxuICAgIC5hcmd2O1xuXG4gIGNvbnN0IHBrZyA9IGF3YWl0IHRyeVJlYWRQYWNrYWdlSnNvbigpO1xuXG4gIGlmICghYXJndi5zY29wZSkge1xuICAgIGFyZ3Yuc2NvcGUgPSBhd2FpdCB0cnlBdXRvRGV0ZWN0U2NvcGUocGtnKTtcbiAgfVxuXG4gIC8vIHJlYWQgXCJjZm4ydHMtY29yZS1pbXBvcnRcIiBmcm9tIHBhY2thZ2UuanNvblxuICBjb25zdCBjb3JlSW1wb3J0ID0gcGtnPy5bJ2Nkay1idWlsZCddPy5bJ2NmbjJ0cy1jb3JlLWltcG9ydCddO1xuICBpZiAoY29yZUltcG9ydCkge1xuICAgIGFyZ3ZbJ2NvcmUtaW1wb3J0J10gPSBjb3JlSW1wb3J0O1xuICB9XG5cbiAgaWYgKCFhcmd2LnNjb3BlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCctLXNjb3BlIGlzIG5vdCBwcm92aWRlZCBhbmQgY2Fubm90IGJlIGF1dG8tZGV0ZWN0ZWQgZnJvbSBwYWNrYWdlLmpzb24gKHVuZGVyIFwiY2RrLWJ1aWxkLmNsb3VkZm9ybWF0aW9uXCIpJyk7XG4gIH1cblxuICBhd2FpdCBnZW5lcmF0ZShhcmd2LnNjb3BlLCBhcmd2Lm91dCwge1xuICAgIGNvcmVJbXBvcnQ6IGFyZ3ZbJ2NvcmUtaW1wb3J0J10sXG4gIH0pO1xufVxuXG5tYWluKCkuY2F0Y2goZXJyID0+IHtcbiAgY29uc29sZS5lcnJvcihlcnIpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gdHJ5QXV0b0RldGVjdFNjb3BlKHBrZzogYW55KTogUHJvbWlzZTx1bmRlZmluZWQgfCBzdHJpbmdbXT4ge1xuICBjb25zdCB2YWx1ZSA9IHBrZ1snY2RrLWJ1aWxkJ10gJiYgcGtnWydjZGstYnVpbGQnXS5jbG91ZGZvcm1hdGlvbjtcbiAgcmV0dXJuIHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gW3ZhbHVlXSA6IHZhbHVlKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJ5UmVhZFBhY2thZ2VKc29uKCkge1xuICBpZiAoIWF3YWl0IGZzLnBhdGhFeGlzdHMoJy4vcGFja2FnZS5qc29uJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIGZzLnJlYWRKU09OKCcuL3BhY2thZ2UuanNvbicpO1xufSJdfQ==