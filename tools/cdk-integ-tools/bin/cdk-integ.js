#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exercise all integ stacks and if they deploy, update the expected synth files
const yargs = require("yargs");
const integ_helpers_1 = require("../lib/integ-helpers");
/* eslint-disable no-console */
async function main() {
    var _a;
    const argv = yargs
        .usage('Usage: cdk-integ [TEST...]')
        .option('list', { type: 'boolean', default: false, desc: 'List tests instead of running them' })
        .option('clean', { type: 'boolean', default: true, desc: 'Skips stack clean up after test is completed (use --no-clean to negate)' })
        .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'Verbose logs' })
        .option('dry-run', { type: 'boolean', default: false, desc: 'do not actually deploy the stack. just update the snapshot (not recommended!)' })
        .argv;
    const tests = await new integ_helpers_1.IntegrationTests('test').fromCliArgs(argv._.map(x => x.toString()));
    if (argv.list) {
        process.stdout.write(tests.map(t => t.name).join(' ') + '\n');
        return;
    }
    for (const test of tests) {
        console.error(`Synthesizing ${test.name}.`);
        const stackToDeploy = await test.determineTestStack();
        console.error(`Selected stack: ${stackToDeploy}`);
        const args = new Array();
        // inject "--verbose" to the command line of "cdk" if we are in verbose mode
        if (argv.verbose) {
            args.push('--verbose');
        }
        const dryRun = (_a = argv['dry-run']) !== null && _a !== void 0 ? _a : false;
        try {
            if (dryRun) {
                console.error('Skipping deployment (--dry-run), updating snapshot.');
            }
            else {
                console.error(`Deploying ${test.name}...`);
                await test.invokeCli([...args, 'deploy', '--require-approval', 'never', ...stackToDeploy], {
                    verbose: argv.verbose,
                });
                console.error('Deployment succeeded, updating snapshot.');
            }
            // If this all worked, write the new expectation file
            const actual = await test.cdkSynthFast(integ_helpers_1.DEFAULT_SYNTH_OPTIONS);
            await test.writeExpected(actual);
        }
        finally {
            if (!dryRun) {
                if (argv.clean) {
                    console.error('Cleaning up.');
                    await test.invokeCli(['destroy', '--force', ...stackToDeploy]);
                }
                else {
                    console.error('Skipping clean up (--no-clean).');
                }
            }
        }
    }
}
main().catch(e => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWludGVnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLWludGVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGdGQUFnRjtBQUNoRiwrQkFBK0I7QUFDL0Isd0RBQStFO0FBRS9FLCtCQUErQjtBQUUvQixLQUFLLFVBQVUsSUFBSTs7SUFDakIsTUFBTSxJQUFJLEdBQUcsS0FBSztTQUNmLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQztTQUNuQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxvQ0FBb0MsRUFBRSxDQUFDO1NBQy9GLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLHlFQUF5RSxFQUFFLENBQUM7U0FDcEksTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQztTQUN4RixNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSwrRUFBK0UsRUFBRSxDQUFDO1NBQzdJLElBQUksQ0FBQztJQUVSLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxnQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRTVDLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDdEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUVsRCxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRWpDLDRFQUE0RTtRQUM1RSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN4QjtRQUVELE1BQU0sTUFBTSxTQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUNBQUksS0FBSyxDQUFDO1FBRXhDLElBQUk7WUFFRixJQUFJLE1BQU0sRUFBRTtnQkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7YUFDdEU7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsT0FBTyxFQUFFLEdBQUcsYUFBYSxDQUFDLEVBQUU7b0JBQ3pGLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFFdEIsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQzthQUMzRDtZQUVELHFEQUFxRDtZQUNyRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMscUNBQXFCLENBQUMsQ0FBQztZQUU5RCxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEM7Z0JBQVM7WUFFUixJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2lCQUNsRDthQUNGO1NBRUY7S0FDRjtBQUNILENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4vLyBFeGVyY2lzZSBhbGwgaW50ZWcgc3RhY2tzIGFuZCBpZiB0aGV5IGRlcGxveSwgdXBkYXRlIHRoZSBleHBlY3RlZCBzeW50aCBmaWxlc1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgREVGQVVMVF9TWU5USF9PUFRJT05TLCBJbnRlZ3JhdGlvblRlc3RzIH0gZnJvbSAnLi4vbGliL2ludGVnLWhlbHBlcnMnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IGFyZ3YgPSB5YXJnc1xuICAgIC51c2FnZSgnVXNhZ2U6IGNkay1pbnRlZyBbVEVTVC4uLl0nKVxuICAgIC5vcHRpb24oJ2xpc3QnLCB7IHR5cGU6ICdib29sZWFuJywgZGVmYXVsdDogZmFsc2UsIGRlc2M6ICdMaXN0IHRlc3RzIGluc3RlYWQgb2YgcnVubmluZyB0aGVtJyB9KVxuICAgIC5vcHRpb24oJ2NsZWFuJywgeyB0eXBlOiAnYm9vbGVhbicsIGRlZmF1bHQ6IHRydWUsIGRlc2M6ICdTa2lwcyBzdGFjayBjbGVhbiB1cCBhZnRlciB0ZXN0IGlzIGNvbXBsZXRlZCAodXNlIC0tbm8tY2xlYW4gdG8gbmVnYXRlKScgfSlcbiAgICAub3B0aW9uKCd2ZXJib3NlJywgeyB0eXBlOiAnYm9vbGVhbicsIGRlZmF1bHQ6IGZhbHNlLCBhbGlhczogJ3YnLCBkZXNjOiAnVmVyYm9zZSBsb2dzJyB9KVxuICAgIC5vcHRpb24oJ2RyeS1ydW4nLCB7IHR5cGU6ICdib29sZWFuJywgZGVmYXVsdDogZmFsc2UsIGRlc2M6ICdkbyBub3QgYWN0dWFsbHkgZGVwbG95IHRoZSBzdGFjay4ganVzdCB1cGRhdGUgdGhlIHNuYXBzaG90IChub3QgcmVjb21tZW5kZWQhKScgfSlcbiAgICAuYXJndjtcblxuICBjb25zdCB0ZXN0cyA9IGF3YWl0IG5ldyBJbnRlZ3JhdGlvblRlc3RzKCd0ZXN0JykuZnJvbUNsaUFyZ3MoYXJndi5fLm1hcCh4ID0+IHgudG9TdHJpbmcoKSkpO1xuXG4gIGlmIChhcmd2Lmxpc3QpIHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSh0ZXN0cy5tYXAodCA9PiB0Lm5hbWUpLmpvaW4oJyAnKSArICdcXG4nKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IHRlc3Qgb2YgdGVzdHMpIHtcbiAgICBjb25zb2xlLmVycm9yKGBTeW50aGVzaXppbmcgJHt0ZXN0Lm5hbWV9LmApO1xuXG4gICAgY29uc3Qgc3RhY2tUb0RlcGxveSA9IGF3YWl0IHRlc3QuZGV0ZXJtaW5lVGVzdFN0YWNrKCk7XG4gICAgY29uc29sZS5lcnJvcihgU2VsZWN0ZWQgc3RhY2s6ICR7c3RhY2tUb0RlcGxveX1gKTtcblxuICAgIGNvbnN0IGFyZ3MgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgLy8gaW5qZWN0IFwiLS12ZXJib3NlXCIgdG8gdGhlIGNvbW1hbmQgbGluZSBvZiBcImNka1wiIGlmIHdlIGFyZSBpbiB2ZXJib3NlIG1vZGVcbiAgICBpZiAoYXJndi52ZXJib3NlKSB7XG4gICAgICBhcmdzLnB1c2goJy0tdmVyYm9zZScpO1xuICAgIH1cblxuICAgIGNvbnN0IGRyeVJ1biA9IGFyZ3ZbJ2RyeS1ydW4nXSA/PyBmYWxzZTtcblxuICAgIHRyeSB7XG5cbiAgICAgIGlmIChkcnlSdW4pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignU2tpcHBpbmcgZGVwbG95bWVudCAoLS1kcnktcnVuKSwgdXBkYXRpbmcgc25hcHNob3QuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBEZXBsb3lpbmcgJHt0ZXN0Lm5hbWV9Li4uYCk7XG4gICAgICAgIGF3YWl0IHRlc3QuaW52b2tlQ2xpKFsuLi5hcmdzLCAnZGVwbG95JywgJy0tcmVxdWlyZS1hcHByb3ZhbCcsICduZXZlcicsIC4uLnN0YWNrVG9EZXBsb3ldLCB7XG4gICAgICAgICAgdmVyYm9zZTogYXJndi52ZXJib3NlLFxuICAgICAgICAgIC8vIE5vdGU6IG5vIFwiY29udGV4dFwiIGFuZCBcImVudlwiLCBzbyB1c2UgZGVmYXVsdCB1c2VyIHNldHRpbmdzIVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5lcnJvcignRGVwbG95bWVudCBzdWNjZWVkZWQsIHVwZGF0aW5nIHNuYXBzaG90LicpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGFsbCB3b3JrZWQsIHdyaXRlIHRoZSBuZXcgZXhwZWN0YXRpb24gZmlsZVxuICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgdGVzdC5jZGtTeW50aEZhc3QoREVGQVVMVF9TWU5USF9PUFRJT05TKTtcblxuICAgICAgYXdhaXQgdGVzdC53cml0ZUV4cGVjdGVkKGFjdHVhbCk7XG4gICAgfSBmaW5hbGx5IHtcblxuICAgICAgaWYgKCFkcnlSdW4pIHtcbiAgICAgICAgaWYgKGFyZ3YuY2xlYW4pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdDbGVhbmluZyB1cC4nKTtcbiAgICAgICAgICBhd2FpdCB0ZXN0Lmludm9rZUNsaShbJ2Rlc3Ryb3knLCAnLS1mb3JjZScsIC4uLnN0YWNrVG9EZXBsb3ldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdTa2lwcGluZyBjbGVhbiB1cCAoLS1uby1jbGVhbikuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfVxufVxuXG5tYWluKCkuY2F0Y2goZSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IoZSk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn0pO1xuIl19