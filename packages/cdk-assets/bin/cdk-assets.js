"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const list_1 = require("./list");
const logging_1 = require("./logging");
const publish_1 = require("./publish");
const lib_1 = require("../lib");
async function main() {
    const argv = yargs
        .usage('$0 <cmd> [args]')
        .option('verbose', {
        alias: 'v',
        type: 'boolean',
        desc: 'Increase logging verbosity',
        count: true,
        default: 0,
    })
        .option('path', {
        alias: 'p',
        type: 'string',
        desc: 'The path (file or directory) to load the assets from. If a directory, ' +
            `the file '${lib_1.AssetManifest.DEFAULT_FILENAME}' will be loaded from it.`,
        default: '.',
        requiresArg: true,
    })
        .command('ls', 'List assets from the given manifest', command => command, wrapHandler(async (args) => {
        await (0, list_1.list)(args);
    }))
        .command('publish [ASSET..]', 'Publish assets in the given manifest', command => command
        .option('profile', { type: 'string', describe: 'Profile to use from AWS Credentials file' })
        .positional('ASSET', { type: 'string', array: true, describe: 'Assets to publish (format: "ASSET[:DEST]"), default all' }), wrapHandler(async (args) => {
        await (0, publish_1.publish)({
            path: args.path,
            assets: args.ASSET,
            profile: args.profile,
        });
    }))
        .demandCommand()
        .help()
        .strict() // Error on wrong command
        .version(logging_1.VERSION)
        .showHelpOnFail(false)
        .argv;
    // Evaluating .argv triggers the parsing but the command gets implicitly executed,
    // so we don't need the output.
    Array.isArray(argv);
}
/**
 * Wrap a command's handler with standard pre- and post-work
 */
function wrapHandler(handler) {
    return async (argv) => {
        if (argv.verbose) {
            (0, logging_1.setLogThreshold)('verbose');
        }
        await handler(argv);
    };
}
main().catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    process.exitCode = 1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWFzc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IsaUNBQThCO0FBQzlCLHVDQUFxRDtBQUNyRCx1Q0FBb0M7QUFDcEMsZ0NBQXVDO0FBRXZDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sSUFBSSxHQUFHLEtBQUs7U0FDZixLQUFLLENBQUMsaUJBQWlCLENBQUM7U0FDeEIsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxLQUFLLEVBQUUsSUFBSTtRQUNYLE9BQU8sRUFBRSxDQUFDO0tBQ1gsQ0FBQztTQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDZCxLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLHdFQUF3RTtZQUNoRixhQUFhLG1CQUFhLENBQUMsZ0JBQWdCLDJCQUEyQjtRQUNwRSxPQUFPLEVBQUUsR0FBRztRQUNaLFdBQVcsRUFBRSxJQUFJO0tBQ2xCLENBQUM7U0FDRCxPQUFPLENBQUMsSUFBSSxFQUFFLHFDQUFxQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUNwRSxXQUFXLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxFQUFFO1FBQ3pCLE1BQU0sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7U0FDSixPQUFPLENBQUMsbUJBQW1CLEVBQUUsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPO1NBQ3JGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSwwQ0FBMEMsRUFBRSxDQUFDO1NBQzNGLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLHlEQUF5RCxFQUFFLENBQUMsRUFDMUgsV0FBVyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRTtRQUN6QixNQUFNLElBQUEsaUJBQU8sRUFBQztZQUNaLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSztZQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDRixhQUFhLEVBQUU7U0FDZixJQUFJLEVBQUU7U0FDTixNQUFNLEVBQUUsQ0FBQyx5QkFBeUI7U0FDbEMsT0FBTyxDQUFDLGlCQUFPLENBQUM7U0FDaEIsY0FBYyxDQUFDLEtBQUssQ0FBQztTQUNyQixJQUFJLENBQUM7SUFFUixrRkFBa0Y7SUFDbEYsK0JBQStCO0lBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQW9DLE9BQTZCO0lBQ25GLE9BQU8sS0FBSyxFQUFFLElBQU8sRUFBRSxFQUFFO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLElBQUEseUJBQWUsRUFBQyxTQUFTLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBQ0QsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNmLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QixPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCB7IGxpc3QgfSBmcm9tICcuL2xpc3QnO1xuaW1wb3J0IHsgc2V0TG9nVGhyZXNob2xkLCBWRVJTSU9OIH0gZnJvbSAnLi9sb2dnaW5nJztcbmltcG9ydCB7IHB1Ymxpc2ggfSBmcm9tICcuL3B1Ymxpc2gnO1xuaW1wb3J0IHsgQXNzZXRNYW5pZmVzdCB9IGZyb20gJy4uL2xpYic7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IGFyZ3YgPSB5YXJnc1xuICAgIC51c2FnZSgnJDAgPGNtZD4gW2FyZ3NdJylcbiAgICAub3B0aW9uKCd2ZXJib3NlJywge1xuICAgICAgYWxpYXM6ICd2JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlc2M6ICdJbmNyZWFzZSBsb2dnaW5nIHZlcmJvc2l0eScsXG4gICAgICBjb3VudDogdHJ1ZSxcbiAgICAgIGRlZmF1bHQ6IDAsXG4gICAgfSlcbiAgICAub3B0aW9uKCdwYXRoJywge1xuICAgICAgYWxpYXM6ICdwJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVzYzogJ1RoZSBwYXRoIChmaWxlIG9yIGRpcmVjdG9yeSkgdG8gbG9hZCB0aGUgYXNzZXRzIGZyb20uIElmIGEgZGlyZWN0b3J5LCAnICtcbiAgICBgdGhlIGZpbGUgJyR7QXNzZXRNYW5pZmVzdC5ERUZBVUxUX0ZJTEVOQU1FfScgd2lsbCBiZSBsb2FkZWQgZnJvbSBpdC5gLFxuICAgICAgZGVmYXVsdDogJy4nLFxuICAgICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgfSlcbiAgICAuY29tbWFuZCgnbHMnLCAnTGlzdCBhc3NldHMgZnJvbSB0aGUgZ2l2ZW4gbWFuaWZlc3QnLCBjb21tYW5kID0+IGNvbW1hbmRcbiAgICAgICwgd3JhcEhhbmRsZXIoYXN5bmMgYXJncyA9PiB7XG4gICAgICAgIGF3YWl0IGxpc3QoYXJncyk7XG4gICAgICB9KSlcbiAgICAuY29tbWFuZCgncHVibGlzaCBbQVNTRVQuLl0nLCAnUHVibGlzaCBhc3NldHMgaW4gdGhlIGdpdmVuIG1hbmlmZXN0JywgY29tbWFuZCA9PiBjb21tYW5kXG4gICAgICAub3B0aW9uKCdwcm9maWxlJywgeyB0eXBlOiAnc3RyaW5nJywgZGVzY3JpYmU6ICdQcm9maWxlIHRvIHVzZSBmcm9tIEFXUyBDcmVkZW50aWFscyBmaWxlJyB9KVxuICAgICAgLnBvc2l0aW9uYWwoJ0FTU0VUJywgeyB0eXBlOiAnc3RyaW5nJywgYXJyYXk6IHRydWUsIGRlc2NyaWJlOiAnQXNzZXRzIHRvIHB1Ymxpc2ggKGZvcm1hdDogXCJBU1NFVFs6REVTVF1cIiksIGRlZmF1bHQgYWxsJyB9KVxuICAgICwgd3JhcEhhbmRsZXIoYXN5bmMgYXJncyA9PiB7XG4gICAgICBhd2FpdCBwdWJsaXNoKHtcbiAgICAgICAgcGF0aDogYXJncy5wYXRoLFxuICAgICAgICBhc3NldHM6IGFyZ3MuQVNTRVQsXG4gICAgICAgIHByb2ZpbGU6IGFyZ3MucHJvZmlsZSxcbiAgICAgIH0pO1xuICAgIH0pKVxuICAgIC5kZW1hbmRDb21tYW5kKClcbiAgICAuaGVscCgpXG4gICAgLnN0cmljdCgpIC8vIEVycm9yIG9uIHdyb25nIGNvbW1hbmRcbiAgICAudmVyc2lvbihWRVJTSU9OKVxuICAgIC5zaG93SGVscE9uRmFpbChmYWxzZSlcbiAgICAuYXJndjtcblxuICAvLyBFdmFsdWF0aW5nIC5hcmd2IHRyaWdnZXJzIHRoZSBwYXJzaW5nIGJ1dCB0aGUgY29tbWFuZCBnZXRzIGltcGxpY2l0bHkgZXhlY3V0ZWQsXG4gIC8vIHNvIHdlIGRvbid0IG5lZWQgdGhlIG91dHB1dC5cbiAgQXJyYXkuaXNBcnJheShhcmd2KTtcbn1cblxuLyoqXG4gKiBXcmFwIGEgY29tbWFuZCdzIGhhbmRsZXIgd2l0aCBzdGFuZGFyZCBwcmUtIGFuZCBwb3N0LXdvcmtcbiAqL1xuZnVuY3Rpb24gd3JhcEhhbmRsZXI8QSBleHRlbmRzIHsgdmVyYm9zZT86IG51bWJlciB9LCBSPihoYW5kbGVyOiAoeDogQSkgPT4gUHJvbWlzZTxSPikge1xuICByZXR1cm4gYXN5bmMgKGFyZ3Y6IEEpID0+IHtcbiAgICBpZiAoYXJndi52ZXJib3NlKSB7XG4gICAgICBzZXRMb2dUaHJlc2hvbGQoJ3ZlcmJvc2UnKTtcbiAgICB9XG4gICAgYXdhaXQgaGFuZGxlcihhcmd2KTtcbiAgfTtcbn1cblxubWFpbigpLmNhdGNoKGUgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbn0pO1xuIl19