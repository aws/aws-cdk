"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const os_1 = require("../lib/os");
const package_info_1 = require("../lib/package-info");
async function main() {
    const args = yargs
        .env('CDK_WATCH')
        .usage('Usage: cdk-watch')
        .option('jsii', {
        type: 'string',
        desc: 'Specify a different jsii executable',
        defaultDescription: 'jsii provided by node dependencies',
    })
        .option('tsc', {
        type: 'string',
        desc: 'Specify a different tsc executable',
        defaultDescription: 'tsc provided by node dependencies',
    })
        .argv;
    await os_1.shell(package_info_1.packageCompiler({ jsii: args.jsii, tsc: args.tsc }).concat(['-w']));
}
main().catch(e => {
    process.stderr.write(`${e.toString()}\n`);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXdhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXdhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLGtDQUFrQztBQUNsQyxzREFBc0Q7QUFPdEQsS0FBSyxVQUFVLElBQUk7SUFDakIsTUFBTSxJQUFJLEdBQWMsS0FBSztTQUMxQixHQUFHLENBQUMsV0FBVyxDQUFDO1NBQ2hCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztTQUN6QixNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2QsSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUscUNBQXFDO1FBQzNDLGtCQUFrQixFQUFFLG9DQUFvQztLQUN6RCxDQUFDO1NBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNiLElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLG9DQUFvQztRQUMxQyxrQkFBa0IsRUFBRSxtQ0FBbUM7S0FDeEQsQ0FBQztTQUNELElBQVcsQ0FBQztJQUVmLE1BQU0sVUFBSyxDQUFDLDhCQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDZixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsQ0FBQyJ9