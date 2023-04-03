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
    const sourcePath = util_1.pathToTopLevelStack(sourceStack);
    const targetPath = util_1.pathToTopLevelStack(targetStack);
    const commonStack = util_1.findLastCommonElement(sourcePath, targetPath);
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
    let stacks = util_1.pathToTopLevelStack(stack_1.Stack.of(source));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQTZDO0FBQzdDLG1DQUFnQztBQUNoQyxtQ0FBZ0M7QUFDaEMsaUNBQWtGO0FBSWxGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLE1BQWUsRUFBRSxNQUFlLEVBQUUsTUFBZTtJQUM3RSxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsc0NBRUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsU0FBZ0IsZ0JBQWdCLENBQUMsTUFBZSxFQUFFLE1BQWU7SUFDL0QsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRkQsNENBRUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDdEIsMkRBQUcsQ0FBQTtJQUNILGlFQUFNLENBQUE7QUFDUixDQUFDLEVBSEksbUJBQW1CLEtBQW5CLG1CQUFtQixRQUd2QjtBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLG1CQUFtQixDQUFDLFNBQThCLEVBQUUsTUFBZSxFQUFFLE1BQWUsRUFBRSxXQUFvQjtJQUNqSCxJQUFJLE1BQU0sS0FBSyxNQUFNLEVBQUU7UUFDckIsT0FBTztLQUNSO0lBRUQsTUFBTSxXQUFXLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxNQUFNLFdBQVcsR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLE1BQU0sV0FBVyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FB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QUFDO0tBQUU7SUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFBRSxPQUFPLFNBQVMsQ0FBQztLQUFFO0lBQ2hELE9BQU8sVUFBVSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0FBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4vc3RhZ2UnO1xuaW1wb3J0IHsgZmluZExhc3RDb21tb25FbGVtZW50LCBwYXRoVG9Ub3BMZXZlbFN0YWNrIGFzIHBhdGhUb1Jvb3QgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgdHlwZSBFbGVtZW50ID0gQ2ZuUmVzb3VyY2UgfCBTdGFjaztcblxuLyoqXG4gKiBBZGRzIGEgZGVwZW5kZW5jeSBiZXR3ZWVuIHR3byByZXNvdXJjZXMgb3Igc3RhY2tzLCBhY3Jvc3Mgc3RhY2sgYW5kIG5lc3RlZFxuICogc3RhY2sgYm91bmRhcmllcy5cbiAqXG4gKiBUaGUgYWxnb3JpdGhtIGNvbnNpc3RzIG9mOlxuICogLSBUcnkgdG8gZmluZCB0aGUgZGVlcGVzdCBjb21tb24gc3RhY2sgYmV0d2VlbiB0aGUgdHdvIGVsZW1lbnRzXG4gKiAtIElmIHRoZXJlIGlzbid0IGEgY29tbW9uIHN0YWNrLCBpdCBtZWFucyB0aGUgZWxlbWVudHMgYmVsb25nIHRvIHR3b1xuICogICBkaXNqb2luZWQgc3RhY2stdHJlZXMgYW5kIHRoZXJlZm9yZSB3ZSBhcHBseSB0aGUgZGVwZW5kZW5jeSBhdCB0aGVcbiAqICAgYXNzZW1ibHkvYXBwIGxldmVsIGJldHdlZW4gdGhlIHR3byB0b3AtbGV2ZWwgc3RhY2tzLlxuICogLSBJZiB3ZSBkaWQgZmluZCBhIGNvbW1vbiBzdGFjaywgd2UgYXBwbHkgdGhlIGRlcGVuZGVuY3kgYXMgYSBDbG91ZEZvcm1hdGlvblxuICogICBcIkRlcGVuZHNPblwiIGJldHdlZW4gdGhlIHJlc291cmNlcyB0aGF0IFwicmVwcmVzZW50XCIgb3VyIHNvdXJjZSBhbmQgdGFyZ2V0XG4gKiAgIGVpdGhlciBkaXJlY3RseSBvciB0aHJvdWdoIHRoZSBBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjayByZXNvdXJjZXMgdGhhdFxuICogICBcImxlYWRcIiB0byB0aGVtLlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgVGhlIHNvdXJjZSByZXNvdXJjZS9zdGFjayAodGhlIGRlcGVuZGVudClcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCByZXNvdXJjZS9zdGFjayAodGhlIGRlcGVuZGVuY3kpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGREZXBlbmRlbmN5KHNvdXJjZTogRWxlbWVudCwgdGFyZ2V0OiBFbGVtZW50LCByZWFzb24/OiBzdHJpbmcpIHtcbiAgb3BlcmF0ZU9uRGVwZW5kZW5jeShEZXBlbmRlbmN5T3BlcmF0aW9uLkFERCwgc291cmNlLCB0YXJnZXQsIHJlYXNvbik7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0d28gcmVzb3VyY2VzIG9yIHN0YWNrcywgYWNyb3NzIHN0YWNrIGFuZCBuZXN0ZWRcbiAqIHN0YWNrIGJvdW5kYXJpZXMuXG4gKlxuICogVGhlIGFsZ29yaXRobSBjb25zaXN0cyBvZjpcbiAqIC0gVHJ5IHRvIGZpbmQgdGhlIGRlZXBlc3QgY29tbW9uIHN0YWNrIGJldHdlZW4gdGhlIHR3byBlbGVtZW50c1xuICogLSBJZiB0aGVyZSBpc24ndCBhIGNvbW1vbiBzdGFjaywgaXQgbWVhbnMgdGhlIGVsZW1lbnRzIGJlbG9uZyB0byB0d29cbiAqICAgZGlzam9pbmVkIHN0YWNrLXRyZWVzIGFuZCB0aGVyZWZvcmUgd2UgYXBwbGllZCB0aGUgZGVwZW5kZW5jeSBhdCB0aGVcbiAqICAgYXNzZW1ibHkvYXBwIGxldmVsIGJldHdlZW4gdGhlIHR3byB0b3AtbGV2ZWwgc3RhY2tzOyByZW1vdmUgaXQgdGhlcmUuXG4gKiAtIElmIHdlIGRpZCBmaW5kIGEgY29tbW9uIHN0YWNrLCB3ZSBhcHBsaWVkIHRoZSBkZXBlbmRlbmN5IGFzIGEgQ2xvdWRGb3JtYXRpb25cbiAqICAgXCJEZXBlbmRzT25cIiBiZXR3ZWVuIHRoZSByZXNvdXJjZXMgdGhhdCBcInJlcHJlc2VudFwiIG91ciBzb3VyY2UgYW5kIHRhcmdldFxuICogICBlaXRoZXIgZGlyZWN0bHkgb3IgdGhyb3VnaCB0aGUgQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2sgcmVzb3VyY2VzIHRoYXRcbiAqICAgXCJsZWFkXCIgdG8gdGhlbSBhbmQgbXVzdCByZW1vdmUgaXQgdGhlcmUuXG4gKlxuICogQHBhcmFtIHNvdXJjZSBUaGUgc291cmNlIHJlc291cmNlL3N0YWNrICh0aGUgZGVwZW5kZW50KVxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHJlc291cmNlL3N0YWNrICh0aGUgZGVwZW5kZW5jeSlcbiAqIEBwYXJhbSByZWFzb24gT3B0aW9uYWwgZGVzY3JpcHRpb24gdG8gYXNzb2NpYXRlIHdpdGggdGhlIGRlcGVuZGVuY3kgZm9yXG4gKiBkaWFnbm9zdGljc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRGVwZW5kZW5jeShzb3VyY2U6IEVsZW1lbnQsIHRhcmdldDogRWxlbWVudCkge1xuICBvcGVyYXRlT25EZXBlbmRlbmN5KERlcGVuZGVuY3lPcGVyYXRpb24uUkVNT1ZFLCBzb3VyY2UsIHRhcmdldCk7XG59XG5cbmVudW0gRGVwZW5kZW5jeU9wZXJhdGlvbiB7XG4gIEFERCxcbiAgUkVNT1ZFXG59XG5cbi8qKlxuICogRmluZCB0aGUgYXBwcm9wcmlhdGUgbG9jYXRpb24gZm9yIGEgZGVwZW5kZW5jeSBhbmQgYWRkIG9yIHJlbW92ZSBpdFxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiBvcGVyYXRlT25EZXBlbmRlbmN5KG9wZXJhdGlvbjogRGVwZW5kZW5jeU9wZXJhdGlvbiwgc291cmNlOiBFbGVtZW50LCB0YXJnZXQ6IEVsZW1lbnQsIGRlc2NyaXB0aW9uPzogc3RyaW5nKSB7XG4gIGlmIChzb3VyY2UgPT09IHRhcmdldCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZVN0YWNrID0gU3RhY2sub2Yoc291cmNlKTtcbiAgY29uc3QgdGFyZ2V0U3RhY2sgPSBTdGFjay5vZih0YXJnZXQpO1xuXG4gIGNvbnN0IHNvdXJjZVN0YWdlID0gU3RhZ2Uub2Yoc291cmNlU3RhY2spO1xuICBjb25zdCB0YXJnZXRTdGFnZSA9IFN0YWdlLm9mKHRhcmdldFN0YWNrKTtcbiAgaWYgKHNvdXJjZVN0YWdlICE9PSB0YXJnZXRTdGFnZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBZb3UgY2Fubm90IGhhdmUgYSBkZXBlbmRlbmN5IGZyb20gJyR7c291cmNlLm5vZGUucGF0aH0nIChpbiAke2Rlc2NyaWJlU3RhZ2Uoc291cmNlU3RhZ2UpfSkgdG8gJyR7dGFyZ2V0Lm5vZGUucGF0aH0nIChpbiAke2Rlc2NyaWJlU3RhZ2UodGFyZ2V0U3RhZ2UpfSk6IGRlcGVuZGVuY3kgY2Fubm90IGNyb3NzIHN0YWdlIGJvdW5kYXJpZXNgKTtcbiAgfVxuXG4gIC8vIGZpbmQgdGhlIGRlZXBlc3QgY29tbW9uIHN0YWNrIGJldHdlZW4gdGhlIHR3byBlbGVtZW50c1xuICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aFRvUm9vdChzb3VyY2VTdGFjayk7XG4gIGNvbnN0IHRhcmdldFBhdGggPSBwYXRoVG9Sb290KHRhcmdldFN0YWNrKTtcbiAgY29uc3QgY29tbW9uU3RhY2sgPSBmaW5kTGFzdENvbW1vbkVsZW1lbnQoc291cmNlUGF0aCwgdGFyZ2V0UGF0aCk7XG5cbiAgLy8gaWYgdGhlcmUgaXMgbm8gY29tbW9uIHN0YWNrLCB0aGVuIGxvb2sgZm9yIGFuIGFzc2VtYmx5LWxldmVsIGRlcGVuZGVuY3lcbiAgLy8gYmV0d2VlbiB0aGUgdHdvIHRvcC1sZXZlbCBzdGFja3NcbiAgaWYgKCFjb21tb25TdGFjaykge1xuICAgIGNvbnN0IHRvcExldmVsU291cmNlID0gc291cmNlUGF0aFswXTsgLy8gZmlyc3QgcGF0aCBlbGVtZW50IGlzIHRoZSB0b3AtbGV2ZWwgc3RhY2tcbiAgICBjb25zdCB0b3BMZXZlbFRhcmdldCA9IHRhcmdldFBhdGhbMF07XG4gICAgY29uc3QgcmVhc29uID0geyBzb3VyY2UsIHRhcmdldCwgZGVzY3JpcHRpb24gfTtcbiAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgY2FzZSBEZXBlbmRlbmN5T3BlcmF0aW9uLkFERDoge1xuICAgICAgICB0b3BMZXZlbFNvdXJjZS5fYWRkQXNzZW1ibHlEZXBlbmRlbmN5KHRvcExldmVsVGFyZ2V0LCByZWFzb24pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgRGVwZW5kZW5jeU9wZXJhdGlvbi5SRU1PVkU6IHtcbiAgICAgICAgdG9wTGV2ZWxTb3VyY2UuX3JlbW92ZUFzc2VtYmx5RGVwZW5kZW5jeSh0b3BMZXZlbFRhcmdldCwgcmVhc29uKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGVwZW5kZW5jeSBvcGVyYXRpb246ICR7b3BlcmF0aW9ufWApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBhc3NlcnRpb246IGF0IHRoaXMgcG9pbnQgaWYgc291cmNlIGFuZCB0YXJnZXQgYXJlIHN0YWNrcywgYm90aCBhcmUgbmVzdGVkIHN0YWNrcy5cbiAgLy8gc2luY2Ugd2UgaGF2ZSBhIGNvbW1vbiBzdGFjaywgaXQgaXMgaW1wb3NzaWJsZSB0aGF0IGJvdGggYXJlIHRvcC1sZXZlbFxuICAvLyBzdGFja3MsIHNvIGxldCdzIGV4YW1pbmUgdGhlIHR3byBjYXNlcyB3aGVyZSBvbmUgb2YgdGhlbSBpcyB0b3AtbGV2ZWwgYW5kXG4gIC8vIHRoZSBvdGhlciBpcyBuZXN0ZWQuXG5cbiAgLy8gY2FzZSAxIC0gc291cmNlIGlzIHRvcC1sZXZlbCBhbmQgdGFyZ2V0IGlzIG5lc3RlZDogdGhpcyBpbXBsaWVzIHRoYXRcbiAgLy8gYHRhcmdldGAgaXMgYSBkaXJlY3Qgb3IgaW5kaXJlY3QgbmVzdGVkIHN0YWNrIG9mIGBzb3VyY2VgLCBhbmQgYW4gZXhwbGljaXRcbiAgLy8gZGVwZW5kZW5jeSBpcyBub3QgcmVxdWlyZWQgYmVjYXVzZSBuZXN0ZWQgc3RhY2tzIHdpbGwgYWx3YXlzIGJlIGRlcGxveWVkXG4gIC8vIGJlZm9yZSB0aGVpciBwYXJlbnRzLlxuICBpZiAoY29tbW9uU3RhY2sgPT09IHNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGNhc2UgMiAtIHNvdXJjZSBpcyBuZXN0ZWQgYW5kIHRhcmdldCBpcyB0b3AtbGV2ZWw6IHRoaXMgaW1wbGllcyB0aGF0XG4gIC8vIGBzb3VyY2VgIGlzIGEgZGlyZWN0IG9yIGluZGlyZWN0IG5lc3RlZCBzdGFjayBvZiBgdGFyZ2V0YCwgYW5kIHRoaXMgaXMgbm90XG4gIC8vIHBvc3NpYmxlIChuZXN0ZWQgc3RhY2tzIGNhbm5vdCBkZXBlbmQgb24gdGhlaXIgcGFyZW50cykuXG4gIGlmIChjb21tb25TdGFjayA9PT0gdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBOZXN0ZWQgc3RhY2sgJyR7c291cmNlU3RhY2subm9kZS5wYXRofScgY2Fubm90IGRlcGVuZCBvbiBhIHBhcmVudCBzdGFjayAnJHt0YXJnZXRTdGFjay5ub2RlLnBhdGh9J2ApO1xuICB9XG5cbiAgLy8gd2UgaGF2ZSBhIGNvbW1vbiBzdGFjayBmcm9tIHdoaWNoIHdlIGNhbiByZWFjaCBib3RoIGBzb3VyY2VgIGFuZCBgdGFyZ2V0YFxuICAvLyBub3cgd2UgbmVlZCB0byBmaW5kIHR3byByZXNvdXJjZXMgd2hpY2ggYXJlIGRlZmluZWQgZGlyZWN0bHkgaW4gdGhpcyBzdGFja1xuICAvLyBhbmQgd2hpY2ggY2FuIFwibGVhZCB1c1wiIHRvIHRoZSBzb3VyY2UvdGFyZ2V0LlxuICBjb25zdCBzb3VyY2VSZXNvdXJjZSA9IHJlc291cmNlSW5Db21tb25TdGFja0Zvcihzb3VyY2UsIGNvbW1vblN0YWNrKTtcbiAgY29uc3QgdGFyZ2V0UmVzb3VyY2UgPSByZXNvdXJjZUluQ29tbW9uU3RhY2tGb3IodGFyZ2V0LCBjb21tb25TdGFjayk7XG4gIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgY2FzZSBEZXBlbmRlbmN5T3BlcmF0aW9uLkFERDoge1xuICAgICAgc291cmNlUmVzb3VyY2UuX2FkZFJlc291cmNlRGVwZW5kZW5jeSh0YXJnZXRSZXNvdXJjZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBEZXBlbmRlbmN5T3BlcmF0aW9uLlJFTU9WRToge1xuICAgICAgc291cmNlUmVzb3VyY2UuX3JlbW92ZVJlc291cmNlRGVwZW5kZW5jeSh0YXJnZXRSZXNvdXJjZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBkZXBlbmRlbmN5IG9wZXJhdGlvbjogJHtvcGVyYXRpb259YCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2V0IGEgbGlzdCBvZiBhbGwgcmVzb3VyY2UtdG8tcmVzb3VyY2UgZGVwZW5kZW5jaWVzIGFzc2VtYmxlZCBmcm9tIHRoaXMgRWxlbWVudCwgU3RhY2sgb3IgYXNzZW1ibHktZGVwZW5kZW5jaWVzXG4gKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2UgcmVzb3VyY2Uvc3RhY2sgKHRoZSBkZXBlbmRlbnQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYnRhaW5EZXBlbmRlbmNpZXMoc291cmNlOiBFbGVtZW50KSB7XG4gIGxldCBkZXBlbmRlbmNpZXM6IEVsZW1lbnRbXSA9IFtdO1xuICBpZiAoc291cmNlIGluc3RhbmNlb2YgQ2ZuUmVzb3VyY2UpIHtcbiAgICBkZXBlbmRlbmNpZXMgPSBzb3VyY2Uub2J0YWluUmVzb3VyY2VEZXBlbmRlbmNpZXMoKTtcbiAgfVxuXG4gIGxldCBzdGFja3MgPSBwYXRoVG9Sb290KFN0YWNrLm9mKHNvdXJjZSkpO1xuICBzdGFja3MuZm9yRWFjaCgoc3RhY2spID0+IHtcbiAgICBkZXBlbmRlbmNpZXMgPSBbLi4uZGVwZW5kZW5jaWVzLCAuLi5zdGFjay5fb2J0YWluQXNzZW1ibHlEZXBlbmRlbmNpZXMoeyBzb3VyY2U6IHNvdXJjZSB9KV07XG4gIH0pO1xuXG4gIHJldHVybiBkZXBlbmRlbmNpZXM7XG59XG5cbi8qKlxuICogRmluZCB0aGUgcmVzb3VyY2UgaW4gYSBjb21tb24gc3RhY2sgdGhhdCAncG9pbnRzJyB0byB0aGUgZ2l2ZW4gZWxlbWVudFxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5mdW5jdGlvbiByZXNvdXJjZUluQ29tbW9uU3RhY2tGb3IoZWxlbWVudDogRWxlbWVudCwgY29tbW9uU3RhY2s6IFN0YWNrKTogQ2ZuUmVzb3VyY2Uge1xuICBjb25zdCByZXNvdXJjZTogQ2ZuUmVzb3VyY2UgPSAoU3RhY2suaXNTdGFjayhlbGVtZW50KSA/IGVsZW1lbnQubmVzdGVkU3RhY2tSZXNvdXJjZSA6IGVsZW1lbnQpIGFzIENmblJlc291cmNlO1xuICBpZiAoIXJlc291cmNlKSB7XG4gICAgLy8gc2VlIFwiYXNzZXJ0aW9uXCIgaW4gb3BlcmF0ZU9uRGVwZW5kZW5jeSBhYm92ZVxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCB2YWx1ZSBmb3IgcmVzb3VyY2Ugd2hlbiBsb29raW5nIGF0ICR7ZWxlbWVudH0hYCk7XG4gIH1cblxuICBjb25zdCByZXNvdXJjZVN0YWNrID0gU3RhY2sub2YocmVzb3VyY2UpO1xuXG4gIC8vIHdlIHJlYWNoZWQgYSByZXNvdXJjZSBkZWZpbmVkIGluIHRoZSBjb21tb24gc3RhY2tcbiAgaWYgKGNvbW1vblN0YWNrID09PSByZXNvdXJjZVN0YWNrKSB7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuICB9XG5cbiAgcmV0dXJuIHJlc291cmNlSW5Db21tb25TdGFja0ZvcihyZXNvdXJjZVN0YWNrLCBjb21tb25TdGFjayk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBhc3NlbWJsZXIsIGZvciB1c2UgaW4gZXJyb3IgbWVzc2FnZXNcbiAqL1xuZnVuY3Rpb24gZGVzY3JpYmVTdGFnZShhc3NlbWJseTogU3RhZ2UgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICBpZiAoIWFzc2VtYmx5KSB7IHJldHVybiAnYW4gdW5yb290ZWQgY29uc3RydWN0IHRyZWUnOyB9XG4gIGlmICghYXNzZW1ibHkucGFyZW50U3RhZ2UpIHsgcmV0dXJuICd0aGUgQXBwJzsgfVxuICByZXR1cm4gYFN0YWdlICcke2Fzc2VtYmx5Lm5vZGUucGF0aH0nYDtcbn1cbiJdfQ==