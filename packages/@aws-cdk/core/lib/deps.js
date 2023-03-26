"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtainDependencies = exports.removeDependency = exports.addDependency = void 0;
const cfn_resource_1 = require("./cfn-resource");
const stack_1 = require("./stack");
const stage_1 = require("./stage");
const util_1 = require("./util");
/**
 * Adds a dependency between two resources or stacks, across stack and nested
 * stack boundaries.
 *
 * The algorithm consists of:
 * - Try to find the deepest common stack between the two elements
 * - If there isn't a common stack, it means the elements belong to two
 *   disjoined stack-trees and therefore we apply the dependency at the
 *   assembly/app level between the two top-level stacks.
 * - If we did find a common stack, we apply the dependency as a CloudFormation
 *   "DependsOn" between the resources that "represent" our source and target
 *   either directly or through the AWS::CloudFormation::Stack resources that
 *   "lead" to them.
 *
 * @param source The source resource/stack (the dependent)
 * @param target The target resource/stack (the dependency)
 */
function addDependency(source, target, reason) {
    operateOnDependency(DependencyOperation.ADD, source, target, reason);
}
exports.addDependency = addDependency;
/**
 * Removes a dependency between two resources or stacks, across stack and nested
 * stack boundaries.
 *
 * The algorithm consists of:
 * - Try to find the deepest common stack between the two elements
 * - If there isn't a common stack, it means the elements belong to two
 *   disjoined stack-trees and therefore we applied the dependency at the
 *   assembly/app level between the two top-level stacks; remove it there.
 * - If we did find a common stack, we applied the dependency as a CloudFormation
 *   "DependsOn" between the resources that "represent" our source and target
 *   either directly or through the AWS::CloudFormation::Stack resources that
 *   "lead" to them and must remove it there.
 *
 * @param source The source resource/stack (the dependent)
 * @param target The target resource/stack (the dependency)
 * @param reason Optional description to associate with the dependency for
 * diagnostics
 */
function removeDependency(source, target) {
    operateOnDependency(DependencyOperation.REMOVE, source, target);
}
exports.removeDependency = removeDependency;
var DependencyOperation;
(function (DependencyOperation) {
    DependencyOperation[DependencyOperation["ADD"] = 0] = "ADD";
    DependencyOperation[DependencyOperation["REMOVE"] = 1] = "REMOVE";
})(DependencyOperation || (DependencyOperation = {}));
/**
 * Find the appropriate location for a dependency and add or remove it
 *
 * @internal
 */
function operateOnDependency(operation, source, target, description) {
    if (source === target) {
        return;
    }
    const sourceStack = stack_1.Stack.of(source);
    const targetStack = stack_1.Stack.of(target);
    const sourceStage = stage_1.Stage.of(sourceStack);
    const targetStage = stage_1.Stage.of(targetStack);
    if (sourceStage !== targetStage) {
        // eslint-disable-next-line max-len
        throw new Error(`You cannot have a dependency from '${source.node.path}' (in ${describeStage(sourceStage)}) to '${target.node.path}' (in ${describeStage(targetStage)}): dependency cannot cross stage boundaries`);
    }
    // find the deepest common stack between the two elements
    const sourcePath = (0, util_1.pathToTopLevelStack)(sourceStack);
    const targetPath = (0, util_1.pathToTopLevelStack)(targetStack);
    const commonStack = (0, util_1.findLastCommonElement)(sourcePath, targetPath);
    // if there is no common stack, then look for an assembly-level dependency
    // between the two top-level stacks
    if (!commonStack) {
        const topLevelSource = sourcePath[0]; // first path element is the top-level stack
        const topLevelTarget = targetPath[0];
        const reason = { source, target, description };
        switch (operation) {
            case DependencyOperation.ADD: {
                topLevelSource._addAssemblyDependency(topLevelTarget, reason);
                break;
            }
            case DependencyOperation.REMOVE: {
                topLevelSource._removeAssemblyDependency(topLevelTarget, reason);
                break;
            }
            default: {
                throw new Error(`Unsupported dependency operation: ${operation}`);
            }
        }
        return;
    }
    // assertion: at this point if source and target are stacks, both are nested stacks.
    // since we have a common stack, it is impossible that both are top-level
    // stacks, so let's examine the two cases where one of them is top-level and
    // the other is nested.
    // case 1 - source is top-level and target is nested: this implies that
    // `target` is a direct or indirect nested stack of `source`, and an explicit
    // dependency is not required because nested stacks will always be deployed
    // before their parents.
    if (commonStack === source) {
        return;
    }
    // case 2 - source is nested and target is top-level: this implies that
    // `source` is a direct or indirect nested stack of `target`, and this is not
    // possible (nested stacks cannot depend on their parents).
    if (commonStack === target) {
        throw new Error(`Nested stack '${sourceStack.node.path}' cannot depend on a parent stack '${targetStack.node.path}'`);
    }
    // we have a common stack from which we can reach both `source` and `target`
    // now we need to find two resources which are defined directly in this stack
    // and which can "lead us" to the source/target.
    const sourceResource = resourceInCommonStackFor(source, commonStack);
    const targetResource = resourceInCommonStackFor(target, commonStack);
    switch (operation) {
        case DependencyOperation.ADD: {
            sourceResource._addResourceDependency(targetResource);
            break;
        }
        case DependencyOperation.REMOVE: {
            sourceResource._removeResourceDependency(targetResource);
            break;
        }
        default: {
            throw new Error(`Unsupported dependency operation: ${operation}`);
        }
    }
}
/**
 * Get a list of all resource-to-resource dependencies assembled from this Element, Stack or assembly-dependencies
 * @param source The source resource/stack (the dependent)
 */
function obtainDependencies(source) {
    let dependencies = [];
    if (source instanceof cfn_resource_1.CfnResource) {
        dependencies = source.obtainResourceDependencies();
    }
    let stacks = (0, util_1.pathToTopLevelStack)(stack_1.Stack.of(source));
    stacks.forEach((stack) => {
        dependencies = [...dependencies, ...stack._obtainAssemblyDependencies({ source: source })];
    });
    return dependencies;
}
exports.obtainDependencies = obtainDependencies;
/**
 * Find the resource in a common stack that 'points' to the given element
 *
 * @internal
 */
function resourceInCommonStackFor(element, commonStack) {
    const resource = (stack_1.Stack.isStack(element) ? element.nestedStackResource : element);
    if (!resource) {
        // see "assertion" in operateOnDependency above
        throw new Error(`Unexpected value for resource when looking at ${element}!`);
    }
    const resourceStack = stack_1.Stack.of(resource);
    // we reached a resource defined in the common stack
    if (commonStack === resourceStack) {
        return resource;
    }
    return resourceInCommonStackFor(resourceStack, commonStack);
}
/**
 * Return a string representation of the given assembler, for use in error messages
 */
function describeStage(assembly) {
    if (!assembly) {
        return 'an unrooted construct tree';
    }
    if (!assembly.parentStage) {
        return 'the App';
    }
    return `Stage '${assembly.node.path}'`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQTZDO0FBQzdDLG1DQUFnQztBQUNoQyxtQ0FBZ0M7QUFDaEMsaUNBQWtGO0FBSWxGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLE1BQWUsRUFBRSxNQUFlLEVBQUUsTUFBZTtJQUM3RSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsc0NBRUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQUMsTUFBZSxFQUFFLE1BQWU7SUFDL0QsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRkQsNENBRUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDdEIsMkRBQUcsQ0FBQTtJQUNILGlFQUFNLENBQUE7QUFDUixDQUFDLEVBSEksbUJBQW1CLEtBQW5CLG1CQUFtQixRQUd2QjtBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLG1CQUFtQixDQUFDLFNBQThCLEVBQUUsTUFBZSxFQUFFLE1BQWUsRUFBRSxXQUFvQjtJQUNqSCxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7UUFDckIsT0FBTztLQUNSO0lBRUQsTUFBTSxXQUFXLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLFdBQVcsR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLE1BQU0sV0FBVyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FB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RTtRQUFFLE9BQU8sNEJBQTRCLENBQUM7S0FBRTtJQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUFFLE9BQU8sU0FBUyxDQUFDO0tBQUU7SUFDaEQsT0FBTyxVQUFVLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7QUFDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi9zdGFnZSc7XG5pbXBvcnQgeyBmaW5kTGFzdENvbW1vbkVsZW1lbnQsIHBhdGhUb1RvcExldmVsU3RhY2sgYXMgcGF0aFRvUm9vdCB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCB0eXBlIEVsZW1lbnQgPSBDZm5SZXNvdXJjZSB8IFN0YWNrO1xuXG4vKipcbiAqIEFkZHMgYSBkZXBlbmRlbmN5IGJldHdlZW4gdHdvIHJlc291cmNlcyBvciBzdGFja3MsIGFjcm9zcyBzdGFjayBhbmQgbmVzdGVkXG4gKiBzdGFjayBib3VuZGFyaWVzLlxuICpcbiAqIFRoZSBhbGdvcml0aG0gY29uc2lzdHMgb2Y6XG4gKiAtIFRyeSB0byBmaW5kIHRoZSBkZWVwZXN0IGNvbW1vbiBzdGFjayBiZXR3ZWVuIHRoZSB0d28gZWxlbWVudHNcbiAqIC0gSWYgdGhlcmUgaXNuJ3QgYSBjb21tb24gc3RhY2ssIGl0IG1lYW5zIHRoZSBlbGVtZW50cyBiZWxvbmcgdG8gdHdvXG4gKiAgIGRpc2pvaW5lZCBzdGFjay10cmVlcyBhbmQgdGhlcmVmb3JlIHdlIGFwcGx5IHRoZSBkZXBlbmRlbmN5IGF0IHRoZVxuICogICBhc3NlbWJseS9hcHAgbGV2ZWwgYmV0d2VlbiB0aGUgdHdvIHRvcC1sZXZlbCBzdGFja3MuXG4gKiAtIElmIHdlIGRpZCBmaW5kIGEgY29tbW9uIHN0YWNrLCB3ZSBhcHBseSB0aGUgZGVwZW5kZW5jeSBhcyBhIENsb3VkRm9ybWF0aW9uXG4gKiAgIFwiRGVwZW5kc09uXCIgYmV0d2VlbiB0aGUgcmVzb3VyY2VzIHRoYXQgXCJyZXByZXNlbnRcIiBvdXIgc291cmNlIGFuZCB0YXJnZXRcbiAqICAgZWl0aGVyIGRpcmVjdGx5IG9yIHRocm91Z2ggdGhlIEFXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrIHJlc291cmNlcyB0aGF0XG4gKiAgIFwibGVhZFwiIHRvIHRoZW0uXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIHJlc291cmNlL3N0YWNrICh0aGUgZGVwZW5kZW50KVxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHJlc291cmNlL3N0YWNrICh0aGUgZGVwZW5kZW5jeSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlcGVuZGVuY3koc291cmNlOiBFbGVtZW50LCB0YXJnZXQ6IEVsZW1lbnQsIHJlYXNvbj86IHN0cmluZykge1xuICBvcGVyYXRlT25EZXBlbmRlbmN5KERlcGVuZGVuY3lPcGVyYXRpb24uQURELCBzb3VyY2UsIHRhcmdldCwgcmVhc29uKTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHR3byByZXNvdXJjZXMgb3Igc3RhY2tzLCBhY3Jvc3Mgc3RhY2sgYW5kIG5lc3RlZFxuICogc3RhY2sgYm91bmRhcmllcy5cbiAqXG4gKiBUaGUgYWxnb3JpdGhtIGNvbnNpc3RzIG9mOlxuICogLSBUcnkgdG8gZmluZCB0aGUgZGVlcGVzdCBjb21tb24gc3RhY2sgYmV0d2VlbiB0aGUgdHdvIGVsZW1lbnRzXG4gKiAtIElmIHRoZXJlIGlzbid0IGEgY29tbW9uIHN0YWNrLCBpdCBtZWFucyB0aGUgZWxlbWVudHMgYmVsb25nIHRvIHR3b1xuICogICBkaXNqb2luZWQgc3RhY2stdHJlZXMgYW5kIHRoZXJlZm9yZSB3ZSBhcHBsaWVkIHRoZSBkZXBlbmRlbmN5IGF0IHRoZVxuICogICBhc3NlbWJseS9hcHAgbGV2ZWwgYmV0d2VlbiB0aGUgdHdvIHRvcC1sZXZlbCBzdGFja3M7IHJlbW92ZSBpdCB0aGVyZS5cbiAqIC0gSWYgd2UgZGlkIGZpbmQgYSBjb21tb24gc3RhY2ssIHdlIGFwcGxpZWQgdGhlIGRlcGVuZGVuY3kgYXMgYSBDbG91ZEZvcm1hdGlvblxuICogICBcIkRlcGVuZHNPblwiIGJldHdlZW4gdGhlIHJlc291cmNlcyB0aGF0IFwicmVwcmVzZW50XCIgb3VyIHNvdXJjZSBhbmQgdGFyZ2V0XG4gKiAgIGVpdGhlciBkaXJlY3RseSBvciB0aHJvdWdoIHRoZSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjayByZXNvdXJjZXMgdGhhdFxuICogICBcImxlYWRcIiB0byB0aGVtIGFuZCBtdXN0IHJlbW92ZSBpdCB0aGVyZS5cbiAqXG4gKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgcmVzb3VyY2Uvc3RhY2sgKHRoZSBkZXBlbmRlbnQpXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgcmVzb3VyY2Uvc3RhY2sgKHRoZSBkZXBlbmRlbmN5KVxuICogQHBhcmFtIHJlYXNvbiBPcHRpb25hbCBkZXNjcmlwdGlvbiB0byBhc3NvY2lhdGUgd2l0aCB0aGUgZGVwZW5kZW5jeSBmb3JcbiAqIGRpYWdub3N0aWNzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEZXBlbmRlbmN5KHNvdXJjZTogRWxlbWVudCwgdGFyZ2V0OiBFbGVtZW50KSB7XG4gIG9wZXJhdGVPbkRlcGVuZGVuY3koRGVwZW5kZW5jeU9wZXJhdGlvbi5SRU1PVkUsIHNvdXJjZSwgdGFyZ2V0KTtcbn1cblxuZW51bSBEZXBlbmRlbmN5T3BlcmF0aW9uIHtcbiAgQURELFxuICBSRU1PVkVcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSBhcHByb3ByaWF0ZSBsb2NhdGlvbiBmb3IgYSBkZXBlbmRlbmN5IGFuZCBhZGQgb3IgcmVtb3ZlIGl0XG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIG9wZXJhdGVPbkRlcGVuZGVuY3kob3BlcmF0aW9uOiBEZXBlbmRlbmN5T3BlcmF0aW9uLCBzb3VyY2U6IEVsZW1lbnQsIHRhcmdldDogRWxlbWVudCwgZGVzY3JpcHRpb24/OiBzdHJpbmcpIHtcbiAgaWYgKHNvdXJjZSA9PT0gdGFyZ2V0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc291cmNlU3RhY2sgPSBTdGFjay5vZihzb3VyY2UpO1xuICBjb25zdCB0YXJnZXRTdGFjayA9IFN0YWNrLm9mKHRhcmdldCk7XG5cbiAgY29uc3Qgc291cmNlU3RhZ2UgPSBTdGFnZS5vZihzb3VyY2VTdGFjayk7XG4gIGNvbnN0IHRhcmdldFN0YWdlID0gU3RhZ2Uub2YodGFyZ2V0U3RhY2spO1xuICBpZiAoc291cmNlU3RhZ2UgIT09IHRhcmdldFN0YWdlKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBjYW5ub3QgaGF2ZSBhIGRlcGVuZGVuY3kgZnJvbSAnJHtzb3VyY2Uubm9kZS5wYXRofScgKGluICR7ZGVzY3JpYmVTdGFnZShzb3VyY2VTdGFnZSl9KSB0byAnJHt0YXJnZXQubm9kZS5wYXRofScgKGluICR7ZGVzY3JpYmVTdGFnZSh0YXJnZXRTdGFnZSl9KTogZGVwZW5kZW5jeSBjYW5ub3QgY3Jvc3Mgc3RhZ2UgYm91bmRhcmllc2ApO1xuICB9XG5cbiAgLy8gZmluZCB0aGUgZGVlcGVzdCBjb21tb24gc3RhY2sgYmV0d2VlbiB0aGUgdHdvIGVsZW1lbnRzXG4gIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoVG9Sb290KHNvdXJjZVN0YWNrKTtcbiAgY29uc3QgdGFyZ2V0UGF0aCA9IHBhdGhUb1Jvb3QodGFyZ2V0U3RhY2spO1xuICBjb25zdCBjb21tb25TdGFjayA9IGZpbmRMYXN0Q29tbW9uRWxlbWVudChzb3VyY2VQYXRoLCB0YXJnZXRQYXRoKTtcblxuICAvLyBpZiB0aGVyZSBpcyBubyBjb21tb24gc3RhY2ssIHRoZW4gbG9vayBmb3IgYW4gYXNzZW1ibHktbGV2ZWwgZGVwZW5kZW5jeVxuICAvLyBiZXR3ZWVuIHRoZSB0d28gdG9wLWxldmVsIHN0YWNrc1xuICBpZiAoIWNvbW1vblN0YWNrKSB7XG4gICAgY29uc3QgdG9wTGV2ZWxTb3VyY2UgPSBzb3VyY2VQYXRoWzBdOyAvLyBmaXJzdCBwYXRoIGVsZW1lbnQgaXMgdGhlIHRvcC1sZXZlbCBzdGFja1xuICAgIGNvbnN0IHRvcExldmVsVGFyZ2V0ID0gdGFyZ2V0UGF0aFswXTtcbiAgICBjb25zdCByZWFzb24gPSB7IHNvdXJjZSwgdGFyZ2V0LCBkZXNjcmlwdGlvbiB9O1xuICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICBjYXNlIERlcGVuZGVuY3lPcGVyYXRpb24uQUREOiB7XG4gICAgICAgIHRvcExldmVsU291cmNlLl9hZGRBc3NlbWJseURlcGVuZGVuY3kodG9wTGV2ZWxUYXJnZXQsIHJlYXNvbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBEZXBlbmRlbmN5T3BlcmF0aW9uLlJFTU9WRToge1xuICAgICAgICB0b3BMZXZlbFNvdXJjZS5fcmVtb3ZlQXNzZW1ibHlEZXBlbmRlbmN5KHRvcExldmVsVGFyZ2V0LCByZWFzb24pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBkZXBlbmRlbmN5IG9wZXJhdGlvbjogJHtvcGVyYXRpb259YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGFzc2VydGlvbjogYXQgdGhpcyBwb2ludCBpZiBzb3VyY2UgYW5kIHRhcmdldCBhcmUgc3RhY2tzLCBib3RoIGFyZSBuZXN0ZWQgc3RhY2tzLlxuICAvLyBzaW5jZSB3ZSBoYXZlIGEgY29tbW9uIHN0YWNrLCBpdCBpcyBpbXBvc3NpYmxlIHRoYXQgYm90aCBhcmUgdG9wLWxldmVsXG4gIC8vIHN0YWNrcywgc28gbGV0J3MgZXhhbWluZSB0aGUgdHdvIGNhc2VzIHdoZXJlIG9uZSBvZiB0aGVtIGlzIHRvcC1sZXZlbCBhbmRcbiAgLy8gdGhlIG90aGVyIGlzIG5lc3RlZC5cblxuICAvLyBjYXNlIDEgLSBzb3VyY2UgaXMgdG9wLWxldmVsIGFuZCB0YXJnZXQgaXMgbmVzdGVkOiB0aGlzIGltcGxpZXMgdGhhdFxuICAvLyBgdGFyZ2V0YCBpcyBhIGRpcmVjdCBvciBpbmRpcmVjdCBuZXN0ZWQgc3RhY2sgb2YgYHNvdXJjZWAsIGFuZCBhbiBleHBsaWNpdFxuICAvLyBkZXBlbmRlbmN5IGlzIG5vdCByZXF1aXJlZCBiZWNhdXNlIG5lc3RlZCBzdGFja3Mgd2lsbCBhbHdheXMgYmUgZGVwbG95ZWRcbiAgLy8gYmVmb3JlIHRoZWlyIHBhcmVudHMuXG4gIGlmIChjb21tb25TdGFjayA9PT0gc291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gY2FzZSAyIC0gc291cmNlIGlzIG5lc3RlZCBhbmQgdGFyZ2V0IGlzIHRvcC1sZXZlbDogdGhpcyBpbXBsaWVzIHRoYXRcbiAgLy8gYHNvdXJjZWAgaXMgYSBkaXJlY3Qgb3IgaW5kaXJlY3QgbmVzdGVkIHN0YWNrIG9mIGB0YXJnZXRgLCBhbmQgdGhpcyBpcyBub3RcbiAgLy8gcG9zc2libGUgKG5lc3RlZCBzdGFja3MgY2Fubm90IGRlcGVuZCBvbiB0aGVpciBwYXJlbnRzKS5cbiAgaWYgKGNvbW1vblN0YWNrID09PSB0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE5lc3RlZCBzdGFjayAnJHtzb3VyY2VTdGFjay5ub2RlLnBhdGh9JyBjYW5ub3QgZGVwZW5kIG9uIGEgcGFyZW50IHN0YWNrICcke3RhcmdldFN0YWNrLm5vZGUucGF0aH0nYCk7XG4gIH1cblxuICAvLyB3ZSBoYXZlIGEgY29tbW9uIHN0YWNrIGZyb20gd2hpY2ggd2UgY2FuIHJlYWNoIGJvdGggYHNvdXJjZWAgYW5kIGB0YXJnZXRgXG4gIC8vIG5vdyB3ZSBuZWVkIHRvIGZpbmQgdHdvIHJlc291cmNlcyB3aGljaCBhcmUgZGVmaW5lZCBkaXJlY3RseSBpbiB0aGlzIHN0YWNrXG4gIC8vIGFuZCB3aGljaCBjYW4gXCJsZWFkIHVzXCIgdG8gdGhlIHNvdXJjZS90YXJnZXQuXG4gIGNvbnN0IHNvdXJjZVJlc291cmNlID0gcmVzb3VyY2VJbkNvbW1vblN0YWNrRm9yKHNvdXJjZSwgY29tbW9uU3RhY2spO1xuICBjb25zdCB0YXJnZXRSZXNvdXJjZSA9IHJlc291cmNlSW5Db21tb25TdGFja0Zvcih0YXJnZXQsIGNvbW1vblN0YWNrKTtcbiAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICBjYXNlIERlcGVuZGVuY3lPcGVyYXRpb24uQUREOiB7XG4gICAgICBzb3VyY2VSZXNvdXJjZS5fYWRkUmVzb3VyY2VEZXBlbmRlbmN5KHRhcmdldFJlc291cmNlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIERlcGVuZGVuY3lPcGVyYXRpb24uUkVNT1ZFOiB7XG4gICAgICBzb3VyY2VSZXNvdXJjZS5fcmVtb3ZlUmVzb3VyY2VEZXBlbmRlbmN5KHRhcmdldFJlc291cmNlKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRlcGVuZGVuY3kgb3BlcmF0aW9uOiAke29wZXJhdGlvbn1gKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCByZXNvdXJjZS10by1yZXNvdXJjZSBkZXBlbmRlbmNpZXMgYXNzZW1ibGVkIGZyb20gdGhpcyBFbGVtZW50LCBTdGFjayBvciBhc3NlbWJseS1kZXBlbmRlbmNpZXNcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIHNvdXJjZSByZXNvdXJjZS9zdGFjayAodGhlIGRlcGVuZGVudClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9idGFpbkRlcGVuZGVuY2llcyhzb3VyY2U6IEVsZW1lbnQpIHtcbiAgbGV0IGRlcGVuZGVuY2llczogRWxlbWVudFtdID0gW107XG4gIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBDZm5SZXNvdXJjZSkge1xuICAgIGRlcGVuZGVuY2llcyA9IHNvdXJjZS5vYnRhaW5SZXNvdXJjZURlcGVuZGVuY2llcygpO1xuICB9XG5cbiAgbGV0IHN0YWNrcyA9IHBhdGhUb1Jvb3QoU3RhY2sub2Yoc291cmNlKSk7XG4gIHN0YWNrcy5mb3JFYWNoKChzdGFjaykgPT4ge1xuICAgIGRlcGVuZGVuY2llcyA9IFsuLi5kZXBlbmRlbmNpZXMsIC4uLnN0YWNrLl9vYnRhaW5Bc3NlbWJseURlcGVuZGVuY2llcyh7IHNvdXJjZTogc291cmNlIH0pXTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRlcGVuZGVuY2llcztcbn1cblxuLyoqXG4gKiBGaW5kIHRoZSByZXNvdXJjZSBpbiBhIGNvbW1vbiBzdGFjayB0aGF0ICdwb2ludHMnIHRvIHRoZSBnaXZlbiBlbGVtZW50XG4gKlxuICogQGludGVybmFsXG4gKi9cbmZ1bmN0aW9uIHJlc291cmNlSW5Db21tb25TdGFja0ZvcihlbGVtZW50OiBFbGVtZW50LCBjb21tb25TdGFjazogU3RhY2spOiBDZm5SZXNvdXJjZSB7XG4gIGNvbnN0IHJlc291cmNlOiBDZm5SZXNvdXJjZSA9IChTdGFjay5pc1N0YWNrKGVsZW1lbnQpID8gZWxlbWVudC5uZXN0ZWRTdGFja1Jlc291cmNlIDogZWxlbWVudCkgYXMgQ2ZuUmVzb3VyY2U7XG4gIGlmICghcmVzb3VyY2UpIHtcbiAgICAvLyBzZWUgXCJhc3NlcnRpb25cIiBpbiBvcGVyYXRlT25EZXBlbmRlbmN5IGFib3ZlXG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHZhbHVlIGZvciByZXNvdXJjZSB3aGVuIGxvb2tpbmcgYXQgJHtlbGVtZW50fSFgKTtcbiAgfVxuXG4gIGNvbnN0IHJlc291cmNlU3RhY2sgPSBTdGFjay5vZihyZXNvdXJjZSk7XG5cbiAgLy8gd2UgcmVhY2hlZCBhIHJlc291cmNlIGRlZmluZWQgaW4gdGhlIGNvbW1vbiBzdGFja1xuICBpZiAoY29tbW9uU3RhY2sgPT09IHJlc291cmNlU3RhY2spIHtcbiAgICByZXR1cm4gcmVzb3VyY2U7XG4gIH1cblxuICByZXR1cm4gcmVzb3VyY2VJbkNvbW1vblN0YWNrRm9yKHJlc291cmNlU3RhY2ssIGNvbW1vblN0YWNrKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIGFzc2VtYmxlciwgZm9yIHVzZSBpbiBlcnJvciBtZXNzYWdlc1xuICovXG5mdW5jdGlvbiBkZXNjcmliZVN0YWdlKGFzc2VtYmx5OiBTdGFnZSB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGlmICghYXNzZW1ibHkpIHsgcmV0dXJuICdhbiB1bnJvb3RlZCBjb25zdHJ1Y3QgdHJlZSc7IH1cbiAgaWYgKCFhc3NlbWJseS5wYXJlbnRTdGFnZSkgeyByZXR1cm4gJ3RoZSBBcHAnOyB9XG4gIHJldHVybiBgU3RhZ2UgJyR7YXNzZW1ibHkubm9kZS5wYXRofSdgO1xufVxuIl19