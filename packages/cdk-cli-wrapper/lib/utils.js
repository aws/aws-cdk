"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
// Helper functions for CDK Exec
const child_process_1 = require("child_process");
/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine, options = {}) {
    const proc = child_process_1.spawnSync(commandLine[0], commandLine.slice(1), {
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
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Not JSON: ' + output);
        throw new Error('Command output is not JSON');
    }
}
exports.exec = exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnQ0FBZ0M7QUFDaEMsaURBQTBDO0FBRTFDOztHQUVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLFdBQXFCLEVBQUUsVUFBMEUsRUFBRztJQUN2SCxNQUFNLElBQUksR0FBRyx5QkFBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzNELEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDL0QsR0FBRyxFQUFFO1lBQ0gsR0FBRyxPQUFPLENBQUMsR0FBRztZQUNkLEdBQUcsT0FBTyxDQUFDLEdBQUc7U0FDZjtRQUNELEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztLQUNqQixDQUFDLENBQUM7SUFFSCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFBRSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUM7S0FBRTtJQUNyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3JCLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLGlDQUFpQztZQUNyRCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkM7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzNHO0lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFcEQsSUFBSTtRQUNGLElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNoQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUFFLE9BQU8sRUFBRSxDQUFDO2FBQUU7WUFFdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Ysc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUM7QUFoQ0Qsb0JBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgQ0RLIEV4ZWNcbmltcG9ydCB7IHNwYXduU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG4vKipcbiAqIE91ciBvd24gZXhlY3V0ZSBmdW5jdGlvbiB3aGljaCBkb2Vzbid0IHVzZSBzaGVsbHMgYW5kIHN0cmluZ3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGVjKGNvbW1hbmRMaW5lOiBzdHJpbmdbXSwgb3B0aW9uczogeyBjd2Q/OiBzdHJpbmcsIGpzb24/OiBib29sZWFuLCB2ZXJib3NlPzogYm9vbGVhbiwgZW52PzogYW55IH0gPSB7IH0pOiBhbnkge1xuICBjb25zdCBwcm9jID0gc3Bhd25TeW5jKGNvbW1hbmRMaW5lWzBdLCBjb21tYW5kTGluZS5zbGljZSgxKSwge1xuICAgIHN0ZGlvOiBbJ2lnbm9yZScsICdwaXBlJywgb3B0aW9ucy52ZXJib3NlID8gJ2luaGVyaXQnIDogJ3BpcGUnXSwgLy8gaW5oZXJpdCBTVERFUlIgaW4gdmVyYm9zZSBtb2RlXG4gICAgZW52OiB7XG4gICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgIC4uLm9wdGlvbnMuZW52LFxuICAgIH0sXG4gICAgY3dkOiBvcHRpb25zLmN3ZCxcbiAgfSk7XG5cbiAgaWYgKHByb2MuZXJyb3IpIHsgdGhyb3cgcHJvYy5lcnJvcjsgfVxuICBpZiAocHJvYy5zdGF0dXMgIT09IDApIHtcbiAgICBpZiAocHJvY2Vzcy5zdGRlcnIpIHsgLy8gd2lsbCBiZSAnbnVsbCcgaW4gdmVyYm9zZSBtb2RlXG4gICAgICBwcm9jZXNzLnN0ZGVyci53cml0ZShwcm9jLnN0ZGVycik7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgQ29tbWFuZCBleGl0ZWQgd2l0aCAke3Byb2Muc3RhdHVzID8gYHN0YXR1cyAke3Byb2Muc3RhdHVzfWAgOiBgc2lnbmFsICR7cHJvYy5zaWduYWx9YH1gKTtcbiAgfVxuXG4gIGNvbnN0IG91dHB1dCA9IHByb2Muc3Rkb3V0LnRvU3RyaW5nKCd1dGYtOCcpLnRyaW0oKTtcblxuICB0cnkge1xuICAgIGlmIChvcHRpb25zLmpzb24pIHtcbiAgICAgIGlmIChvdXRwdXQubGVuZ3RoID09PSAwKSB7IHJldHVybiB7fTsgfVxuXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShvdXRwdXQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmVycm9yKCdOb3QgSlNPTjogJyArIG91dHB1dCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb21tYW5kIG91dHB1dCBpcyBub3QgSlNPTicpO1xuICB9XG59XG4iXX0=