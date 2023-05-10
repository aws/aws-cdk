"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
// Helper functions for CDK Exec
const child_process_1 = require("child_process");
/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine, options = {}) {
    const proc = (0, child_process_1.spawnSync)(commandLine[0], commandLine.slice(1), {
        stdio: ['ignore', 'pipe', options.verbose ? 'inherit' : 'pipe'],
        env: {
            ...process.env,
            ...options.env,
        },
        cwd: options.cwd,
    });
    if (proc.error) {
        throw proc.error;
    }
    if (proc.status !== 0) {
        if (process.stderr) { // will be 'null' in verbose mode
            process.stderr.write(proc.stderr);
        }
        throw new Error(`Command exited with ${proc.status ? `status ${proc.status}` : `signal ${proc.signal}`}`);
    }
    const output = proc.stdout.toString('utf-8').trim();
    try {
        if (options.json) {
            if (output.length === 0) {
                return {};
            }
            return JSON.parse(output);
        }
        return output;
    }
    catch {
        // eslint-disable-next-line no-console
        console.error('Not JSON: ' + output);
        throw new Error('Command output is not JSON');
    }
}
exports.exec = exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnQ0FBZ0M7QUFDaEMsaURBQTBDO0FBRTFDOztHQUVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLFdBQXFCLEVBQUUsVUFBMEUsRUFBRztJQUN2SCxNQUFNLElBQUksR0FBRyxJQUFBLHlCQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDM0QsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMvRCxHQUFHLEVBQUU7WUFDSCxHQUFHLE9BQU8sQ0FBQyxHQUFHO1lBQ2QsR0FBRyxPQUFPLENBQUMsR0FBRztTQUNmO1FBQ0QsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO0tBQ2pCLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtRQUFFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUFFO0lBQ3JDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsaUNBQWlDO1lBQ3JELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNuQztRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDM0c7SUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVwRCxJQUFJO1FBQ0YsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ2hCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxFQUFFLENBQUM7YUFBRTtZQUV2QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBQUMsTUFBTTtRQUNOLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FDL0M7QUFDSCxDQUFDO0FBaENELG9CQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIENESyBFeGVjXG5pbXBvcnQgeyBzcGF3blN5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuLyoqXG4gKiBPdXIgb3duIGV4ZWN1dGUgZnVuY3Rpb24gd2hpY2ggZG9lc24ndCB1c2Ugc2hlbGxzIGFuZCBzdHJpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhlYyhjb21tYW5kTGluZTogc3RyaW5nW10sIG9wdGlvbnM6IHsgY3dkPzogc3RyaW5nLCBqc29uPzogYm9vbGVhbiwgdmVyYm9zZT86IGJvb2xlYW4sIGVudj86IGFueSB9ID0geyB9KTogYW55IHtcbiAgY29uc3QgcHJvYyA9IHNwYXduU3luYyhjb21tYW5kTGluZVswXSwgY29tbWFuZExpbmUuc2xpY2UoMSksIHtcbiAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsIG9wdGlvbnMudmVyYm9zZSA/ICdpbmhlcml0JyA6ICdwaXBlJ10sIC8vIGluaGVyaXQgU1RERVJSIGluIHZlcmJvc2UgbW9kZVxuICAgIGVudjoge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAuLi5vcHRpb25zLmVudixcbiAgICB9LFxuICAgIGN3ZDogb3B0aW9ucy5jd2QsXG4gIH0pO1xuXG4gIGlmIChwcm9jLmVycm9yKSB7IHRocm93IHByb2MuZXJyb3I7IH1cbiAgaWYgKHByb2Muc3RhdHVzICE9PSAwKSB7XG4gICAgaWYgKHByb2Nlc3Muc3RkZXJyKSB7IC8vIHdpbGwgYmUgJ251bGwnIGluIHZlcmJvc2UgbW9kZVxuICAgICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUocHJvYy5zdGRlcnIpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvbW1hbmQgZXhpdGVkIHdpdGggJHtwcm9jLnN0YXR1cyA/IGBzdGF0dXMgJHtwcm9jLnN0YXR1c31gIDogYHNpZ25hbCAke3Byb2Muc2lnbmFsfWB9YCk7XG4gIH1cblxuICBjb25zdCBvdXRwdXQgPSBwcm9jLnN0ZG91dC50b1N0cmluZygndXRmLTgnKS50cmltKCk7XG5cbiAgdHJ5IHtcbiAgICBpZiAob3B0aW9ucy5qc29uKSB7XG4gICAgICBpZiAob3V0cHV0Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4ge307IH1cblxuICAgICAgcmV0dXJuIEpTT04ucGFyc2Uob3V0cHV0KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSBjYXRjaCB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKCdOb3QgSlNPTjogJyArIG91dHB1dCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb21tYW5kIG91dHB1dCBpcyBub3QgSlNPTicpO1xuICB9XG59XG4iXX0=