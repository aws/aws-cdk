"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSpecificationEvolution = void 0;
/* eslint-disable no-console */
const child_process = require("child_process");
const fs = require("fs-extra");
const SKIP_FILE = 'skip-evolution-check.txt';
/**
 * Run validations on the spec evolution, on the pull request.
 *
 * First `git checkout`s the old commit, builds the spec, does the
 * same for the new commit, then runs comparisons on the both.
 *
 * Expects and uses git.
 */
async function validateSpecificationEvolution(specProducer) {
    const prNumber = (process.env.CODEBUILD_WEBHOOK_TRIGGER ?? '').replace(/^pr\//, '');
    const skips = (await fs.readFile(SKIP_FILE, { encoding: 'utf-8' })).split('\n');
    if (prNumber && skips.includes(prNumber)) {
        console.log(`Skipping evo check of PR ${prNumber} (${SKIP_FILE})`);
        await specProducer();
        return;
    }
    const targetBranch = process.env.CODEBUILD_WEBHOOK_BASE_REF ?? 'main';
    console.log(`Comparing differences with ${targetBranch}`);
    const mergeBase = child_process.execSync(`git merge-base ${targetBranch} HEAD`).toString().trim();
    console.log(`Base commit ${mergeBase}`);
    // Find branch name if we have one
    let currentCommit = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    if (currentCommit === 'HEAD') {
        // No branch, just spec use commit
        currentCommit = child_process.execSync('git rev-parse HEAD').toString().trim();
    }
    console.log(`Current commit ${currentCommit}`);
    const specs = new Array();
    for (const commit of [mergeBase, currentCommit]) {
        process.stdout.write([
            '┌───────────────────────────────────────────────────────────────────────────────────',
            `│   Doing spec build at commit: ${commit}`,
            '└─▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
        ].join('\n') + '\n');
        child_process.execSync(`git checkout ${commit}`);
        specs.push(await specProducer());
    }
    validatePropertyTypeNameConsistency(specs[0], specs[1]);
}
exports.validateSpecificationEvolution = validateSpecificationEvolution;
/**
 * Safeguard check: make sure that all old property type names in the old spec exist in the new spec
 *
 * If not, it's probably because the service team renamed a type between spec
 * version `v(N)` to `v(N+1)`. In the CloudFormation spec itself, this is not a
 * problem. However, CDK will have generated actual classes and interfaces with
 * the type names at `v(N)`, which people will have written code against. If the
 * classes and interfaces would have a new name at `v(N+1)`, all user code would
 * break.
 */
function validatePropertyTypeNameConsistency(oldSpec, newSpec) {
    const newPropsTypes = newSpec.PropertyTypes ?? {};
    const disappearedKeys = Object.keys(oldSpec.PropertyTypes ?? {})
        .filter(k => !(k in newPropsTypes))
        // Marked as deleted on purpose
        .filter(k => !(newSpec.DeletedPropertyTypes?.[k]));
    if (disappearedKeys.length === 0) {
        return;
    }
    const operations = [];
    for (const key of disappearedKeys) {
        const [cfnResource, typeName] = key.split('.');
        const usages = findTypeUsages(oldSpec, cfnResource, typeName);
        operations.push({
            $comment: `If ${cfnResource}.${typeName} was renamed, use this and the 'replace's below. Remove this comment.`,
            op: 'move',
            from: `/PropertyTypes/${cfnResource}.<NEW_TYPE_NAME_HERE>`,
            path: `/PropertyTypes/${cfnResource}.${typeName}`,
        });
        operations.push(...usages.map((path) => ({
            op: 'replace',
            path,
            value: typeName,
        })));
        operations.push({
            $comment: `If ${cfnResource}.${typeName} was deleted on purpose, use this. Remove this comment.`,
            op: 'add',
            path: `/DeletedPropertyTypes/${cfnResource}.${typeName}`,
            value: true,
        });
    }
    const exampleJsonPatch = {
        patch: {
            description: 'Undoing upstream property type renames of <SERVICE> because <REASON>',
            operations,
        },
    };
    const now = new Date();
    const YYYY = `${now.getFullYear()}`;
    const MM = `0${now.getMonth() + 1}`.slice(-2);
    const DD = `0${now.getDate()}`.slice(-2);
    process.stderr.write([
        '┌───────────────────────────────────────────────────────────────────────────────────────┐',
        '│                                                                                       ▐█',
        '│  PROPERTY TYPES HAVE DISAPPEARED                                                      ▐█',
        '│                                                                                       ▐█',
        '│  Some type names have disappeared from the old specification.                         ▐█',
        '│                                                                                       ▐█',
        '│  This probably indicates that the service team renamed one of the types. We have      ▐█',
        '│  to keep the old type names though: renaming them would constitute a breaking change  ▐█',
        '│  to consumers of the L1 resources.                                                    ▐█',
        '│                                                                                       ▐█',
        '└─▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟█',
        '',
        'See what the renames were, check out this PR locally and add a JSON patch file for these types:',
        '',
        `(Example 600_Renames_${YYYY}${MM}${DD}_patch.json)`,
        '',
        JSON.stringify(exampleJsonPatch, undefined, 2),
        '\n',
    ].join('\n'));
    process.exitCode = 1;
}
function findTypeUsages(spec, cfnResource, typeName) {
    const ret = new Array();
    const typesToInspect = [
        ...Object.keys(spec.PropertyTypes ?? {})
            .filter((propTypeName) => propTypeName.startsWith(`${cfnResource}.`))
            .map((propTypeName) => ['PropertyTypes', propTypeName]),
        ...spec.ResourceTypes?.[cfnResource] ? [['ResourceTypes', cfnResource]] : [],
    ];
    for (const [topKey, typeKey] of typesToInspect) {
        const propType = spec[topKey][typeKey];
        for (const innerKey of ['Properties', 'Attributes']) {
            for (const [propName, propDef] of Object.entries(propType?.[innerKey] ?? {})) {
                for (const [fieldName, fieldType] of Object.entries(propDef)) {
                    if (fieldType === typeName) {
                        ret.push(`/${topKey}/${typeKey}/${innerKey}/${propName}/${fieldName}`);
                    }
                }
            }
        }
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZXZvbHV0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdGUtZXZvbHV0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQiwrQ0FBK0M7QUFDL0MsK0JBQStCO0FBRS9CLE1BQU0sU0FBUyxHQUFHLDBCQUEwQixDQUFDO0FBRTdDOzs7Ozs7O0dBT0c7QUFDSSxLQUFLLFVBQVUsOEJBQThCLENBQUMsWUFBZ0M7SUFDbkYsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEYsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEYsSUFBSSxRQUFRLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixRQUFRLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNuRSxNQUFNLFlBQVksRUFBRSxDQUFDO1FBQ3JCLE9BQU87S0FDUjtJQUVELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLElBQUksTUFBTSxDQUFDO0lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDMUQsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsWUFBWSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsU0FBUyxFQUFFLENBQUMsQ0FB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RjthQUNGO1NBQ0Y7S0FDRjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5cbmNvbnN0IFNLSVBfRklMRSA9ICdza2lwLWV2b2x1dGlvbi1jaGVjay50eHQnO1xuXG4vKipcbiAqIFJ1biB2YWxpZGF0aW9ucyBvbiB0aGUgc3BlYyBldm9sdXRpb24sIG9uIHRoZSBwdWxsIHJlcXVlc3QuXG4gKlxuICogRmlyc3QgYGdpdCBjaGVja291dGBzIHRoZSBvbGQgY29tbWl0LCBidWlsZHMgdGhlIHNwZWMsIGRvZXMgdGhlXG4gKiBzYW1lIGZvciB0aGUgbmV3IGNvbW1pdCwgdGhlbiBydW5zIGNvbXBhcmlzb25zIG9uIHRoZSBib3RoLlxuICpcbiAqIEV4cGVjdHMgYW5kIHVzZXMgZ2l0LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVTcGVjaWZpY2F0aW9uRXZvbHV0aW9uKHNwZWNQcm9kdWNlcjogKCkgPT4gUHJvbWlzZTxhbnk+KSB7XG4gIGNvbnN0IHByTnVtYmVyID0gKHByb2Nlc3MuZW52LkNPREVCVUlMRF9XRUJIT09LX1RSSUdHRVIgPz8gJycpLnJlcGxhY2UoL15wclxcLy8sICcnKTtcbiAgY29uc3Qgc2tpcHMgPSAoYXdhaXQgZnMucmVhZEZpbGUoU0tJUF9GSUxFLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS5zcGxpdCgnXFxuJyk7XG4gIGlmIChwck51bWJlciAmJiBza2lwcy5pbmNsdWRlcyhwck51bWJlcikpIHtcbiAgICBjb25zb2xlLmxvZyhgU2tpcHBpbmcgZXZvIGNoZWNrIG9mIFBSICR7cHJOdW1iZXJ9ICgke1NLSVBfRklMRX0pYCk7XG4gICAgYXdhaXQgc3BlY1Byb2R1Y2VyKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0QnJhbmNoID0gcHJvY2Vzcy5lbnYuQ09ERUJVSUxEX1dFQkhPT0tfQkFTRV9SRUYgPz8gJ21haW4nO1xuICBjb25zb2xlLmxvZyhgQ29tcGFyaW5nIGRpZmZlcmVuY2VzIHdpdGggJHt0YXJnZXRCcmFuY2h9YCk7XG4gIGNvbnN0IG1lcmdlQmFzZSA9IGNoaWxkX3Byb2Nlc3MuZXhlY1N5bmMoYGdpdCBtZXJnZS1iYXNlICR7dGFyZ2V0QnJhbmNofSBIRUFEYCkudG9TdHJpbmcoKS50cmltKCk7XG4gIGNvbnNvbGUubG9nKGBCYXNlIGNvbW1pdCAke21lcmdlQmFzZX1gKTtcbiAgLy8gRmluZCBicmFuY2ggbmFtZSBpZiB3ZSBoYXZlIG9uZVxuICBsZXQgY3VycmVudENvbW1pdCA9IGNoaWxkX3Byb2Nlc3MuZXhlY1N5bmMoJ2dpdCByZXYtcGFyc2UgLS1hYmJyZXYtcmVmIEhFQUQnKS50b1N0cmluZygpLnRyaW0oKTtcbiAgaWYgKGN1cnJlbnRDb21taXQgPT09ICdIRUFEJykge1xuICAgIC8vIE5vIGJyYW5jaCwganVzdCBzcGVjIHVzZSBjb21taXRcbiAgICBjdXJyZW50Q29tbWl0ID0gY2hpbGRfcHJvY2Vzcy5leGVjU3luYygnZ2l0IHJldi1wYXJzZSBIRUFEJykudG9TdHJpbmcoKS50cmltKCk7XG4gIH1cbiAgY29uc29sZS5sb2coYEN1cnJlbnQgY29tbWl0ICR7Y3VycmVudENvbW1pdH1gKTtcblxuICBjb25zdCBzcGVjcyA9IG5ldyBBcnJheTxhbnk+KCk7XG4gIGZvciAoY29uc3QgY29tbWl0IG9mIFttZXJnZUJhc2UsIGN1cnJlbnRDb21taXRdKSB7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoW1xuICAgICAgJ+KUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCcsXG4gICAgICBg4pSCICAgRG9pbmcgc3BlYyBidWlsZCBhdCBjb21taXQ6ICR7Y29tbWl0fWAsXG4gICAgICAn4pSU4pSA4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paEJyxcbiAgICBdLmpvaW4oJ1xcbicpICsgJ1xcbicpO1xuXG4gICAgY2hpbGRfcHJvY2Vzcy5leGVjU3luYyhgZ2l0IGNoZWNrb3V0ICR7Y29tbWl0fWApO1xuICAgIHNwZWNzLnB1c2goYXdhaXQgc3BlY1Byb2R1Y2VyKCkpO1xuICB9XG5cbiAgdmFsaWRhdGVQcm9wZXJ0eVR5cGVOYW1lQ29uc2lzdGVuY3koc3BlY3NbMF0sIHNwZWNzWzFdKTtcbn1cblxuLyoqXG4gKiBTYWZlZ3VhcmQgY2hlY2s6IG1ha2Ugc3VyZSB0aGF0IGFsbCBvbGQgcHJvcGVydHkgdHlwZSBuYW1lcyBpbiB0aGUgb2xkIHNwZWMgZXhpc3QgaW4gdGhlIG5ldyBzcGVjXG4gKlxuICogSWYgbm90LCBpdCdzIHByb2JhYmx5IGJlY2F1c2UgdGhlIHNlcnZpY2UgdGVhbSByZW5hbWVkIGEgdHlwZSBiZXR3ZWVuIHNwZWNcbiAqIHZlcnNpb24gYHYoTilgIHRvIGB2KE4rMSlgLiBJbiB0aGUgQ2xvdWRGb3JtYXRpb24gc3BlYyBpdHNlbGYsIHRoaXMgaXMgbm90IGFcbiAqIHByb2JsZW0uIEhvd2V2ZXIsIENESyB3aWxsIGhhdmUgZ2VuZXJhdGVkIGFjdHVhbCBjbGFzc2VzIGFuZCBpbnRlcmZhY2VzIHdpdGhcbiAqIHRoZSB0eXBlIG5hbWVzIGF0IGB2KE4pYCwgd2hpY2ggcGVvcGxlIHdpbGwgaGF2ZSB3cml0dGVuIGNvZGUgYWdhaW5zdC4gSWYgdGhlXG4gKiBjbGFzc2VzIGFuZCBpbnRlcmZhY2VzIHdvdWxkIGhhdmUgYSBuZXcgbmFtZSBhdCBgdihOKzEpYCwgYWxsIHVzZXIgY29kZSB3b3VsZFxuICogYnJlYWsuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcGVydHlUeXBlTmFtZUNvbnNpc3RlbmN5KG9sZFNwZWM6IGFueSwgbmV3U3BlYzogYW55KSB7XG4gIGNvbnN0IG5ld1Byb3BzVHlwZXMgPSBuZXdTcGVjLlByb3BlcnR5VHlwZXMgPz8ge307XG4gIGNvbnN0IGRpc2FwcGVhcmVkS2V5cyA9IE9iamVjdC5rZXlzKG9sZFNwZWMuUHJvcGVydHlUeXBlcyA/PyB7fSlcbiAgICAuZmlsdGVyKGsgPT4gIShrIGluIG5ld1Byb3BzVHlwZXMpKVxuICAgIC8vIE1hcmtlZCBhcyBkZWxldGVkIG9uIHB1cnBvc2VcbiAgICAuZmlsdGVyKGsgPT4gIShuZXdTcGVjLkRlbGV0ZWRQcm9wZXJ0eVR5cGVzPy5ba10pKTtcblxuICBpZiAoZGlzYXBwZWFyZWRLZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG9wZXJhdGlvbnM6IGFueVtdID0gW107XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgZGlzYXBwZWFyZWRLZXlzKSB7XG4gICAgY29uc3QgW2NmblJlc291cmNlLCB0eXBlTmFtZV0gPSBrZXkuc3BsaXQoJy4nKTtcbiAgICBjb25zdCB1c2FnZXMgPSBmaW5kVHlwZVVzYWdlcyhvbGRTcGVjLCBjZm5SZXNvdXJjZSwgdHlwZU5hbWUpO1xuXG4gICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICRjb21tZW50OiBgSWYgJHtjZm5SZXNvdXJjZX0uJHt0eXBlTmFtZX0gd2FzIHJlbmFtZWQsIHVzZSB0aGlzIGFuZCB0aGUgJ3JlcGxhY2UncyBiZWxvdy4gUmVtb3ZlIHRoaXMgY29tbWVudC5gLFxuICAgICAgb3A6ICdtb3ZlJyxcbiAgICAgIGZyb206IGAvUHJvcGVydHlUeXBlcy8ke2NmblJlc291cmNlfS48TkVXX1RZUEVfTkFNRV9IRVJFPmAsXG4gICAgICBwYXRoOiBgL1Byb3BlcnR5VHlwZXMvJHtjZm5SZXNvdXJjZX0uJHt0eXBlTmFtZX1gLFxuICAgIH0pO1xuXG4gICAgb3BlcmF0aW9ucy5wdXNoKC4uLnVzYWdlcy5tYXAoKHBhdGgpID0+ICh7XG4gICAgICBvcDogJ3JlcGxhY2UnLFxuICAgICAgcGF0aCxcbiAgICAgIHZhbHVlOiB0eXBlTmFtZSxcbiAgICB9KSkpO1xuXG4gICAgb3BlcmF0aW9ucy5wdXNoKHtcbiAgICAgICRjb21tZW50OiBgSWYgJHtjZm5SZXNvdXJjZX0uJHt0eXBlTmFtZX0gd2FzIGRlbGV0ZWQgb24gcHVycG9zZSwgdXNlIHRoaXMuIFJlbW92ZSB0aGlzIGNvbW1lbnQuYCxcbiAgICAgIG9wOiAnYWRkJyxcbiAgICAgIHBhdGg6IGAvRGVsZXRlZFByb3BlcnR5VHlwZXMvJHtjZm5SZXNvdXJjZX0uJHt0eXBlTmFtZX1gLFxuICAgICAgdmFsdWU6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBleGFtcGxlSnNvblBhdGNoID0ge1xuICAgIHBhdGNoOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1VuZG9pbmcgdXBzdHJlYW0gcHJvcGVydHkgdHlwZSByZW5hbWVzIG9mIDxTRVJWSUNFPiBiZWNhdXNlIDxSRUFTT04+JyxcbiAgICAgIG9wZXJhdGlvbnMsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBZWVlZID0gYCR7bm93LmdldEZ1bGxZZWFyKCl9YDtcbiAgY29uc3QgTU0gPSBgMCR7bm93LmdldE1vbnRoKCkgKyAxfWAuc2xpY2UoLTIpO1xuICBjb25zdCBERCA9IGAwJHtub3cuZ2V0RGF0ZSgpfWAuc2xpY2UoLTIpO1xuXG4gIHByb2Nlc3Muc3RkZXJyLndyaXRlKFtcbiAgICAn4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQJyxcbiAgICAn4pSCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICBQUk9QRVJUWSBUWVBFUyBIQVZFIERJU0FQUEVBUkVEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICBTb21lIHR5cGUgbmFtZXMgaGF2ZSBkaXNhcHBlYXJlZCBmcm9tIHRoZSBvbGQgc3BlY2lmaWNhdGlvbi4gICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICBUaGlzIHByb2JhYmx5IGluZGljYXRlcyB0aGF0IHRoZSBzZXJ2aWNlIHRlYW0gcmVuYW1lZCBvbmUgb2YgdGhlIHR5cGVzLiBXZSBoYXZlICAgICAg4paQ4paIJyxcbiAgICAn4pSCICB0byBrZWVwIHRoZSBvbGQgdHlwZSBuYW1lcyB0aG91Z2g6IHJlbmFtaW5nIHRoZW0gd291bGQgY29uc3RpdHV0ZSBhIGJyZWFraW5nIGNoYW5nZSAg4paQ4paIJyxcbiAgICAn4pSCICB0byBjb25zdW1lcnMgb2YgdGhlIEwxIHJlc291cmNlcy4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4paQ4paIJyxcbiAgICAn4pSU4pSA4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paE4paf4paIJyxcbiAgICAnJyxcbiAgICAnU2VlIHdoYXQgdGhlIHJlbmFtZXMgd2VyZSwgY2hlY2sgb3V0IHRoaXMgUFIgbG9jYWxseSBhbmQgYWRkIGEgSlNPTiBwYXRjaCBmaWxlIGZvciB0aGVzZSB0eXBlczonLFxuICAgICcnLFxuICAgIGAoRXhhbXBsZSA2MDBfUmVuYW1lc18ke1lZWVl9JHtNTX0ke0REfV9wYXRjaC5qc29uKWAsXG4gICAgJycsXG4gICAgSlNPTi5zdHJpbmdpZnkoZXhhbXBsZUpzb25QYXRjaCwgdW5kZWZpbmVkLCAyKSxcbiAgICAnXFxuJyxcbiAgXS5qb2luKCdcXG4nKSk7XG4gIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xufVxuXG5mdW5jdGlvbiBmaW5kVHlwZVVzYWdlcyhzcGVjOiBhbnksIGNmblJlc291cmNlOiBzdHJpbmcsIHR5cGVOYW1lOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgY29uc3QgdHlwZXNUb0luc3BlY3Q6IEFycmF5PHJlYWRvbmx5IFtzdHJpbmcsIHN0cmluZ10+ID0gW1xuICAgIC4uLk9iamVjdC5rZXlzKHNwZWMuUHJvcGVydHlUeXBlcyA/PyB7fSlcbiAgICAgIC5maWx0ZXIoKHByb3BUeXBlTmFtZSkgPT4gcHJvcFR5cGVOYW1lLnN0YXJ0c1dpdGgoYCR7Y2ZuUmVzb3VyY2V9LmApKVxuICAgICAgLm1hcCgocHJvcFR5cGVOYW1lKSA9PiBbJ1Byb3BlcnR5VHlwZXMnLCBwcm9wVHlwZU5hbWVdIGFzIGNvbnN0KSxcbiAgICAuLi5zcGVjLlJlc291cmNlVHlwZXM/LltjZm5SZXNvdXJjZV0gPyBbWydSZXNvdXJjZVR5cGVzJywgY2ZuUmVzb3VyY2VdIGFzIGNvbnN0XSA6IFtdLFxuICBdO1xuXG4gIGZvciAoY29uc3QgW3RvcEtleSwgdHlwZUtleV0gb2YgdHlwZXNUb0luc3BlY3QpIHtcbiAgICBjb25zdCBwcm9wVHlwZSA9IHNwZWNbdG9wS2V5XVt0eXBlS2V5XTtcblxuICAgIGZvciAoY29uc3QgaW5uZXJLZXkgb2YgWydQcm9wZXJ0aWVzJywgJ0F0dHJpYnV0ZXMnXSkge1xuXG4gICAgICBmb3IgKGNvbnN0IFtwcm9wTmFtZSwgcHJvcERlZl0gb2YgT2JqZWN0LmVudHJpZXMocHJvcFR5cGU/Lltpbm5lcktleV0gPz8ge30pKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2ZpZWxkTmFtZSwgZmllbGRUeXBlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wRGVmIGFzIGFueSkpIHtcbiAgICAgICAgICBpZiAoZmllbGRUeXBlID09PSB0eXBlTmFtZSkge1xuICAgICAgICAgICAgcmV0LnB1c2goYC8ke3RvcEtleX0vJHt0eXBlS2V5fS8ke2lubmVyS2V5fS8ke3Byb3BOYW1lfS8ke2ZpZWxkTmFtZX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufSJdfQ==