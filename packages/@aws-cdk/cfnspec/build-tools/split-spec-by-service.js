"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
/**
 * Split the given CloudFormation resource specification up into a patch set, by service
 *
 * After splitting, only write out those fragments that are valid.(*)
 *
 * The reason for this is that some service updates sometimes contain mistakes,
 * and we want to be able to take partial upgrades. By splitting the spec, we can
 * take updates to some services while leaving updates to other services behind.
 *
 * (*) If `NO_VALIDATE` is set, all pieces are written out. In normal operation this
 *     should not be used.
 */
const path = require("path");
const fs = require("fs-extra");
const patch_set_1 = require("./patch-set");
const validate_cfn_1 = require("./validate-cfn");
async function main(args) {
    if (args.length < 3) {
        throw new Error('Usage: split-spec-by-service <SPECFILE> <DIRECTORY> [<SERVICES>]');
    }
    const [specFile, outDir, services] = args;
    const allowedServices = services.trim().split(' ').filter(Boolean);
    log(`Loading specification: ${specFile}`);
    const spec = await fs.readJson(specFile);
    // Split
    log('Splitting');
    const byService = {};
    for (const [propTypeName, propType] of Object.entries(spec.PropertyTypes)) {
        const svcName = serviceName(propTypeName);
        serviceSpec(svcName).PropertyTypes[propTypeName] = propType;
    }
    for (const [resTypeName, resType] of Object.entries(spec.ResourceTypes)) {
        const svcName = serviceName(resTypeName);
        serviceSpec(svcName).ResourceTypes[resTypeName] = resType;
    }
    // Write out
    if (allowedServices.length > 0) {
        log(`Writing: ${allowedServices.join(' ')}`);
    }
    else {
        log('Writing all services');
    }
    for (const [svcName, svcSpec] of Object.entries(byService)) {
        // Skip services that are not explicitly allowed
        if (allowedServices.length > 0 && !allowedServices.includes(svcName)) {
            continue;
        }
        const successTarget = path.join(outDir, `000_${svcName}.json`);
        const rejectedTarget = path.join(outDir, `.000_${svcName}.rejected.json`);
        const errors = !process.env.NO_VALIDATE ? validate_cfn_1.CfnSpecValidator.validate(svcSpec) : [];
        if (errors.length === 0) {
            // Change 'ResourceSpecificationVersion' to '$version', otherwise they will all conflict
            const toWrite = {
                PropertyTypes: svcSpec.PropertyTypes,
                ResourceTypes: svcSpec.ResourceTypes,
                $version: svcSpec.ResourceSpecificationVersion,
            };
            await (0, patch_set_1.writeSorted)(successTarget, toWrite);
            await ensureGone(rejectedTarget);
        }
        else {
            console.warn('='.repeat(70));
            console.warn(' '.repeat(Math.floor(35 - svcName.length / 2)) + svcName);
            console.warn('='.repeat(70));
            for (const error of errors) {
                console.warn((0, validate_cfn_1.formatErrorInContext)(error));
            }
            await (0, patch_set_1.writeSorted)(rejectedTarget, svcSpec);
            // Make sure that the success file exists. If not, the initial import of a
            // new service failed.
            if (!await fs.pathExists(successTarget)) {
                await (0, patch_set_1.writeSorted)(successTarget, {
                    PropertyTypes: {},
                    ResourceTypes: {},
                    $version: '0.0.0',
                });
            }
        }
    }
    await fs.writeJson(path.join(outDir, '001_Version.json'), {
        ResourceSpecificationVersion: spec.ResourceSpecificationVersion,
    }, { spaces: 2 });
    function serviceSpec(svcName) {
        if (!(svcName in byService)) {
            byService[svcName] = {
                PropertyTypes: {},
                ResourceTypes: {},
                ResourceSpecificationVersion: spec.ResourceSpecificationVersion,
            };
        }
        return byService[svcName];
    }
}
async function ensureGone(fileName) {
    try {
        await fs.unlink(fileName);
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            return;
        }
        throw e;
    }
}
function serviceName(x) {
    return x.split('::').slice(0, 2).join('_');
}
function log(x) {
    // eslint-disable-next-line no-console
    console.log(x);
}
main(process.argv.slice(2)).catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQtc3BlYy1ieS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3BsaXQtc3BlYy1ieS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9COzs7Ozs7Ozs7OztHQVdHO0FBQ0gsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUUvQiwyQ0FBMEM7QUFDMUMsaURBQWlGO0FBRWpGLEtBQUssVUFBVSxJQUFJLENBQUMsSUFBYztJQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztLQUNyRjtJQUVELE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMxQyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuRSxHQUFHLENBQUMsMEJBQTBCLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDMUMsTUFBTSxJQUFJLEdBQVksTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRWxELFFBQVE7SUFDUixHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakIsTUFBTSxTQUFTLEdBQTRCLEVBQUUsQ0FBQztJQUM5QyxLQUFLLE1BQU0sQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7UUFDekUsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzdEO0lBQ0QsS0FBSyxNQUFNLENBQUMsV0FBVyxF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QUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4vKipcbiAqIFNwbGl0IHRoZSBnaXZlbiBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBzcGVjaWZpY2F0aW9uIHVwIGludG8gYSBwYXRjaCBzZXQsIGJ5IHNlcnZpY2VcbiAqXG4gKiBBZnRlciBzcGxpdHRpbmcsIG9ubHkgd3JpdGUgb3V0IHRob3NlIGZyYWdtZW50cyB0aGF0IGFyZSB2YWxpZC4oKilcbiAqXG4gKiBUaGUgcmVhc29uIGZvciB0aGlzIGlzIHRoYXQgc29tZSBzZXJ2aWNlIHVwZGF0ZXMgc29tZXRpbWVzIGNvbnRhaW4gbWlzdGFrZXMsXG4gKiBhbmQgd2Ugd2FudCB0byBiZSBhYmxlIHRvIHRha2UgcGFydGlhbCB1cGdyYWRlcy4gQnkgc3BsaXR0aW5nIHRoZSBzcGVjLCB3ZSBjYW5cbiAqIHRha2UgdXBkYXRlcyB0byBzb21lIHNlcnZpY2VzIHdoaWxlIGxlYXZpbmcgdXBkYXRlcyB0byBvdGhlciBzZXJ2aWNlcyBiZWhpbmQuXG4gKlxuICogKCopIElmIGBOT19WQUxJREFURWAgaXMgc2V0LCBhbGwgcGllY2VzIGFyZSB3cml0dGVuIG91dC4gSW4gbm9ybWFsIG9wZXJhdGlvbiB0aGlzXG4gKiAgICAgc2hvdWxkIG5vdCBiZSB1c2VkLlxuICovXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgeyB3cml0ZVNvcnRlZCB9IGZyb20gJy4vcGF0Y2gtc2V0JztcbmltcG9ydCB7IENmblNwZWMsIENmblNwZWNWYWxpZGF0b3IsIGZvcm1hdEVycm9ySW5Db250ZXh0IH0gZnJvbSAnLi92YWxpZGF0ZS1jZm4nO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKGFyZ3M6IHN0cmluZ1tdKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA8IDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzYWdlOiBzcGxpdC1zcGVjLWJ5LXNlcnZpY2UgPFNQRUNGSUxFPiA8RElSRUNUT1JZPiBbPFNFUlZJQ0VTPl0nKTtcbiAgfVxuXG4gIGNvbnN0IFtzcGVjRmlsZSwgb3V0RGlyLCBzZXJ2aWNlc10gPSBhcmdzO1xuICBjb25zdCBhbGxvd2VkU2VydmljZXMgPSBzZXJ2aWNlcy50cmltKCkuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgbG9nKGBMb2FkaW5nIHNwZWNpZmljYXRpb246ICR7c3BlY0ZpbGV9YCk7XG4gIGNvbnN0IHNwZWM6IENmblNwZWMgPSBhd2FpdCBmcy5yZWFkSnNvbihzcGVjRmlsZSk7XG5cbiAgLy8gU3BsaXRcbiAgbG9nKCdTcGxpdHRpbmcnKTtcbiAgY29uc3QgYnlTZXJ2aWNlOiBSZWNvcmQ8c3RyaW5nLCBDZm5TcGVjPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtwcm9wVHlwZU5hbWUsIHByb3BUeXBlXSBvZiBPYmplY3QuZW50cmllcyhzcGVjLlByb3BlcnR5VHlwZXMpKSB7XG4gICAgY29uc3Qgc3ZjTmFtZSA9IHNlcnZpY2VOYW1lKHByb3BUeXBlTmFtZSk7XG4gICAgc2VydmljZVNwZWMoc3ZjTmFtZSkuUHJvcGVydHlUeXBlc1twcm9wVHlwZU5hbWVdID0gcHJvcFR5cGU7XG4gIH1cbiAgZm9yIChjb25zdCBbcmVzVHlwZU5hbWUsIHJlc1R5cGVdIG9mIE9iamVjdC5lbnRyaWVzKHNwZWMuUmVzb3VyY2VUeXBlcykpIHtcbiAgICBjb25zdCBzdmNOYW1lID0gc2VydmljZU5hbWUocmVzVHlwZU5hbWUpO1xuICAgIHNlcnZpY2VTcGVjKHN2Y05hbWUpLlJlc291cmNlVHlwZXNbcmVzVHlwZU5hbWVdID0gcmVzVHlwZTtcbiAgfVxuXG4gIC8vIFdyaXRlIG91dFxuICBpZiAoYWxsb3dlZFNlcnZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICBsb2coYFdyaXRpbmc6ICR7YWxsb3dlZFNlcnZpY2VzLmpvaW4oJyAnKX1gKTtcbiAgfSBlbHNlIHtcbiAgICBsb2coJ1dyaXRpbmcgYWxsIHNlcnZpY2VzJyk7XG4gIH1cbiAgZm9yIChjb25zdCBbc3ZjTmFtZSwgc3ZjU3BlY10gb2YgT2JqZWN0LmVudHJpZXMoYnlTZXJ2aWNlKSkge1xuICAgIC8vIFNraXAgc2VydmljZXMgdGhhdCBhcmUgbm90IGV4cGxpY2l0bHkgYWxsb3dlZFxuICAgIGlmIChhbGxvd2VkU2VydmljZXMubGVuZ3RoID4gMCAmJiAhYWxsb3dlZFNlcnZpY2VzLmluY2x1ZGVzKHN2Y05hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdWNjZXNzVGFyZ2V0ID0gcGF0aC5qb2luKG91dERpciwgYDAwMF8ke3N2Y05hbWV9Lmpzb25gKTtcbiAgICBjb25zdCByZWplY3RlZFRhcmdldCA9IHBhdGguam9pbihvdXREaXIsIGAuMDAwXyR7c3ZjTmFtZX0ucmVqZWN0ZWQuanNvbmApO1xuXG4gICAgY29uc3QgZXJyb3JzID0gIXByb2Nlc3MuZW52Lk5PX1ZBTElEQVRFID8gQ2ZuU3BlY1ZhbGlkYXRvci52YWxpZGF0ZShzdmNTcGVjKSA6IFtdO1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBDaGFuZ2UgJ1Jlc291cmNlU3BlY2lmaWNhdGlvblZlcnNpb24nIHRvICckdmVyc2lvbicsIG90aGVyd2lzZSB0aGV5IHdpbGwgYWxsIGNvbmZsaWN0XG4gICAgICBjb25zdCB0b1dyaXRlID0ge1xuICAgICAgICBQcm9wZXJ0eVR5cGVzOiBzdmNTcGVjLlByb3BlcnR5VHlwZXMsXG4gICAgICAgIFJlc291cmNlVHlwZXM6IHN2Y1NwZWMuUmVzb3VyY2VUeXBlcyxcbiAgICAgICAgJHZlcnNpb246IHN2Y1NwZWMuUmVzb3VyY2VTcGVjaWZpY2F0aW9uVmVyc2lvbixcbiAgICAgIH07XG5cbiAgICAgIGF3YWl0IHdyaXRlU29ydGVkKHN1Y2Nlc3NUYXJnZXQsIHRvV3JpdGUpO1xuICAgICAgYXdhaXQgZW5zdXJlR29uZShyZWplY3RlZFRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignPScucmVwZWF0KDcwKSk7XG4gICAgICBjb25zb2xlLndhcm4oJyAnLnJlcGVhdChNYXRoLmZsb29yKDM1IC0gc3ZjTmFtZS5sZW5ndGggLyAyKSkgKyBzdmNOYW1lKTtcbiAgICAgIGNvbnNvbGUud2FybignPScucmVwZWF0KDcwKSk7XG4gICAgICBmb3IgKGNvbnN0IGVycm9yIG9mIGVycm9ycykge1xuICAgICAgICBjb25zb2xlLndhcm4oZm9ybWF0RXJyb3JJbkNvbnRleHQoZXJyb3IpKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd3JpdGVTb3J0ZWQocmVqZWN0ZWRUYXJnZXQsIHN2Y1NwZWMpO1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgc3VjY2VzcyBmaWxlIGV4aXN0cy4gSWYgbm90LCB0aGUgaW5pdGlhbCBpbXBvcnQgb2YgYVxuICAgICAgLy8gbmV3IHNlcnZpY2UgZmFpbGVkLlxuICAgICAgaWYgKCFhd2FpdCBmcy5wYXRoRXhpc3RzKHN1Y2Nlc3NUYXJnZXQpKSB7XG4gICAgICAgIGF3YWl0IHdyaXRlU29ydGVkKHN1Y2Nlc3NUYXJnZXQsIHtcbiAgICAgICAgICBQcm9wZXJ0eVR5cGVzOiB7fSxcbiAgICAgICAgICBSZXNvdXJjZVR5cGVzOiB7fSxcbiAgICAgICAgICAkdmVyc2lvbjogJzAuMC4wJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGF3YWl0IGZzLndyaXRlSnNvbihwYXRoLmpvaW4ob3V0RGlyLCAnMDAxX1ZlcnNpb24uanNvbicpLCB7XG4gICAgUmVzb3VyY2VTcGVjaWZpY2F0aW9uVmVyc2lvbjogc3BlYy5SZXNvdXJjZVNwZWNpZmljYXRpb25WZXJzaW9uLFxuICB9LCB7IHNwYWNlczogMiB9KTtcblxuICBmdW5jdGlvbiBzZXJ2aWNlU3BlYyhzdmNOYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAoIShzdmNOYW1lIGluIGJ5U2VydmljZSkpIHtcbiAgICAgIGJ5U2VydmljZVtzdmNOYW1lXSA9IHtcbiAgICAgICAgUHJvcGVydHlUeXBlczoge30sXG4gICAgICAgIFJlc291cmNlVHlwZXM6IHt9LFxuICAgICAgICBSZXNvdXJjZVNwZWNpZmljYXRpb25WZXJzaW9uOiBzcGVjLlJlc291cmNlU3BlY2lmaWNhdGlvblZlcnNpb24sXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYnlTZXJ2aWNlW3N2Y05hbWVdO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUdvbmUoZmlsZU5hbWU6IHN0cmluZykge1xuICB0cnkge1xuICAgIGF3YWl0IGZzLnVubGluayhmaWxlTmFtZSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7IHJldHVybjsgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VydmljZU5hbWUoeDogc3RyaW5nKSB7XG4gIHJldHVybiB4LnNwbGl0KCc6OicpLnNsaWNlKDAsIDIpLmpvaW4oJ18nKTtcbn1cblxuZnVuY3Rpb24gbG9nKHg6IHN0cmluZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyh4KTtcbn1cblxubWFpbihwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpLmNhdGNoKGUgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKGUpO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbn0pO1xuIl19