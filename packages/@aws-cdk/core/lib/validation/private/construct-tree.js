"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructTree = void 0;
const app_1 = require("../../app");
const cfn_resource_1 = require("../../cfn-resource");
const stack_1 = require("../../stack");
/**
 * Utility class to help accessing information on constructs in the
 * construct tree. This can be created once and shared between
 * all the validation plugin executions.
 */
class ConstructTree {
    constructor(root) {
        this.root = root;
        /**
         * A cache of the ConstructTrace by node.path. Each construct
         */
        this._traceCache = new Map();
        this._constructByPath = new Map();
        this._constructByTemplatePathAndLogicalId = new Map();
        if (app_1.App.isApp(this.root)) {
            this.treeMetadata = this.root.node.tryFindChild('Tree');
        }
        else {
            this.treeMetadata = app_1.App.of(this.root)?.node.tryFindChild('Tree');
        }
        this._constructByPath.set(this.root.node.path, root);
        // do this once at the start so we don't have to traverse
        // the entire tree everytime we want to find a nested node
        this.root.node.findAll().forEach(child => {
            this._constructByPath.set(child.node.path, child);
            const defaultChild = child.node.defaultChild;
            if (defaultChild && cfn_resource_1.CfnResource.isCfnResource(defaultChild)) {
                const stack = stack_1.Stack.of(defaultChild);
                const logicalId = stack.resolve(defaultChild.logicalId);
                this.setLogicalId(stack, logicalId, child);
            }
        });
        // Another pass to include all the L1s that haven't been added yet
        this.root.node.findAll().forEach(child => {
            if (cfn_resource_1.CfnResource.isCfnResource(child)) {
                const stack = stack_1.Stack.of(child);
                const logicalId = stack_1.Stack.of(child).resolve(child.logicalId);
                this.setLogicalId(stack, logicalId, child);
            }
        });
    }
    setLogicalId(stack, logicalId, child) {
        if (!this._constructByTemplatePathAndLogicalId.has(stack.templateFile)) {
            this._constructByTemplatePathAndLogicalId.set(stack.templateFile, new Map([[logicalId, child]]));
        }
        else {
            this._constructByTemplatePathAndLogicalId.get(stack.templateFile)?.set(logicalId, child);
        }
    }
    /**
     * Get the stack trace from the construct node metadata.
     * The stack trace only gets recorded if the node is a `CfnResource`,
     * but the stack trace will have entries for all types of parent construct
     * scopes
     */
    getTraceMetadata(size, node) {
        if (node) {
            const construct = this.getConstructByPath(node.path);
            if (construct) {
                let trace;
                if (cfn_resource_1.CfnResource.isCfnResource(construct)) {
                    trace = construct.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
                }
                else {
                    trace = construct.node.defaultChild?.node.metadata.find(meta => !!meta.trace)?.trace ?? [];
                }
                // the top item is never pointing to anything relevant
                trace.shift();
                // take just the items we need and reverse it since we are
                // displaying to trace bottom up
                return Object.create(trace.slice(0, size));
            }
        }
        return [];
    }
    /**
     * Get a ConstructTrace from the cache for a given construct
     *
     * Construct the stack trace of constructs. This will start with the
     * root of the tree and go down to the construct that has the violation
     */
    getTrace(node, locations) {
        const trace = this._traceCache.get(node.path);
        if (trace) {
            return trace;
        }
        const size = this.nodeSize(node);
        // the first time through the node will
        // be the root of the tree. We need to go
        // down the tree until we get to the bottom which
        // will be the resource with the violation and it
        // will contain the trace info
        let child = node;
        if (!locations) {
            do {
                if (child.children) {
                    child = this.getChild(child.children);
                }
            } while (child.children);
        }
        const metadata = (locations ?? this.getTraceMetadata(size, child));
        const thisLocation = metadata.pop();
        let constructTrace = {
            id: node.id,
            path: node.path,
            // the "child" trace will be the "parent" node
            // since we are going bottom up
            child: node.children
                ? this.getTrace(this.getChild(node.children), metadata)
                : undefined,
            construct: node.constructInfo?.fqn,
            libraryVersion: node.constructInfo?.version,
            location: thisLocation ?? "Run with '--debug' to include location info",
        };
        this._traceCache.set(constructTrace.path, constructTrace);
        return constructTrace;
    }
    /**
     * Each node will only have a single child so just
     * return that
     */
    getChild(children) {
        return Object.values(children)[0];
    }
    /**
     * Get the size of a Node
     */
    nodeSize(node) {
        let size = 1;
        if (!node.children) {
            return size;
        }
        let children = this.getChild(node.children);
        do {
            size++;
            children = children.children
                ? this.getChild(children.children)
                : undefined;
        } while (children);
        return size;
    }
    /**
     * Get a specific node in the tree by construct path
     *
     * @param path the construct path of the node to return
     * @returns the TreeMetadata Node
     */
    getTreeNode(path) {
        return this.treeMetadata._getNodeBranch(path);
    }
    /**
     * Get a specific Construct by the node.addr
     *
     * @param path the node.addr of the construct
     * @returns the Construct
     */
    getConstructByPath(path) {
        return this._constructByPath.get(path);
    }
    /**
     * Get a specific Construct by the CfnResource logical ID. This will
     * be the construct.node.defaultChild with the given ID
     *
     * @param logicalId the ID of the CfnResource
     * @returns the Construct
     */
    getConstructByLogicalId(templateFile, logicalId) {
        return this._constructByTemplatePathAndLogicalId.get(templateFile)?.get(logicalId);
    }
}
exports.ConstructTree = ConstructTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LXRyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdHJ1Y3QtdHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBZ0M7QUFDaEMscURBQWlEO0FBRWpELHVDQUFvQztBQXNEcEM7Ozs7R0FJRztBQUNILE1BQWEsYUFBYTtJQVN4QixZQUNtQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBVG5DOztXQUVHO1FBQ2MsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBMEIsQ0FBQztRQUNoRCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztRQUNoRCx5Q0FBb0MsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztRQU1oRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBaUIsQ0FBQztTQUN6RTthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBaUIsQ0FBQztTQUNsRjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELHlEQUF5RDtRQUN6RCwwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsTUFB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QixDQUFDLFlBQW9CLEVBQUUsU0FBaUI7UUFDcEUsT0FBTyxJQUFJLENBQUMsb0NBQW9DLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUFqTEQsc0NBaUxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuLi8uLi9hcHAnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi8uLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgVHJlZU1ldGFkYXRhLCBOb2RlIH0gZnJvbSAnLi4vLi4vcHJpdmF0ZS90cmVlLW1ldGFkYXRhJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vLi4vc3RhY2snO1xuXG4vKipcbiAqIEEgY29uc3RydWN0IGNlbnRyaWMgdmlldyBvZiBhIHN0YWNrIHRyYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uc3RydWN0VHJhY2Uge1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjdCBub2RlIGlkXG4gICAqL1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWN0IHBhdGhcbiAgICovXG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBjb25zdHJ1Y3QgdHJhY2UgZm9yIHRoZSBuZXh0IGNvbnN0cnVjdFxuICAgKiBpbiB0aGUgdHJhY2UgdHJlZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZCBpZiB0aGlzIGlzIHRoZSBsYXN0IGNvbnN0cnVjdCBpbiB0aGUgdHJlZVxuICAgKi9cbiAgcmVhZG9ubHkgY2hpbGQ/OiBDb25zdHJ1Y3RUcmFjZTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnN0cnVjdFxuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgZXF1YWwgdG8gdGhlIGZxbiBzbyB3aWxsIGFsc28gaW5jbHVkZVxuICAgKiBsaWJyYXJ5IGluZm9ybWF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdW5kZWZpbmVkIGlmIHRoaXMgaXMgYSBsb2NhbGx5IGRlZmluZWQgY29uc3RydWN0XG4gICAqL1xuICByZWFkb25seSBjb25zdHJ1Y3Q/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBsaWJyYXJ5IHRoZSBjb25zdHJ1Y3QgY29tZXMgZnJvbVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZCBpZiB0aGlzIGlzIGEgbG9jYWxseSBkZWZpbmVkIGNvbnN0cnVjdFxuICAgKi9cbiAgcmVhZG9ubHkgbGlicmFyeVZlcnNpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIGBDREtfREVCVUdgIGlzIHNldCB0byB0cnVlLCB0aGVuIHRoaXMgd2lsbCBzaG93XG4gICAqIHRoZSBsaW5lIGZyb20gdGhlIHN0YWNrIHRyYWNlIHRoYXQgY29udGFpbnMgdGhlIGxvY2F0aW9uXG4gICAqIGluIHRoZSBzb3VyY2UgZmlsZSB3aGVyZSB0aGUgY29uc3RydWN0IGlzIGRlZmluZWQuXG4gICAqXG4gICAqIElmIGBDREtfREVCVUdgIGlzIG5vdCBzZXQgdGhlbiB0aGlzIHdpbGwgaW5zdHJ1Y3QgdGhlIHVzZXJcbiAgICogdG8gcnVuIHdpdGggYC0tZGVidWdgIGlmIHRoZXkgd291bGQgbGlrZSB0aGUgbG9jYXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1bmRlZmluZWQgaWYgdGhlIGNvbnN0cnVjdCBjb21lcyBmcm9tIGEgbGlicmFyeVxuICAgKiBhbmQgdGhlIGxvY2F0aW9uIHdvdWxkIHBvaW50IHRvIG5vZGVfbW9kdWxlc1xuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVXRpbGl0eSBjbGFzcyB0byBoZWxwIGFjY2Vzc2luZyBpbmZvcm1hdGlvbiBvbiBjb25zdHJ1Y3RzIGluIHRoZVxuICogY29uc3RydWN0IHRyZWUuIFRoaXMgY2FuIGJlIGNyZWF0ZWQgb25jZSBhbmQgc2hhcmVkIGJldHdlZW5cbiAqIGFsbCB0aGUgdmFsaWRhdGlvbiBwbHVnaW4gZXhlY3V0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnN0cnVjdFRyZWUge1xuICAvKipcbiAgICogQSBjYWNoZSBvZiB0aGUgQ29uc3RydWN0VHJhY2UgYnkgbm9kZS5wYXRoLiBFYWNoIGNvbnN0cnVjdFxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfdHJhY2VDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBDb25zdHJ1Y3RUcmFjZT4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY29uc3RydWN0QnlQYXRoID0gbmV3IE1hcDxzdHJpbmcsIENvbnN0cnVjdD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY29uc3RydWN0QnlUZW1wbGF0ZVBhdGhBbmRMb2dpY2FsSWQgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgQ29uc3RydWN0Pj4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSB0cmVlTWV0YWRhdGE6IFRyZWVNZXRhZGF0YTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvb3Q6IElDb25zdHJ1Y3QsXG4gICkge1xuICAgIGlmIChBcHAuaXNBcHAodGhpcy5yb290KSkge1xuICAgICAgdGhpcy50cmVlTWV0YWRhdGEgPSB0aGlzLnJvb3Qubm9kZS50cnlGaW5kQ2hpbGQoJ1RyZWUnKSBhcyBUcmVlTWV0YWRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJlZU1ldGFkYXRhID0gQXBwLm9mKHRoaXMucm9vdCk/Lm5vZGUudHJ5RmluZENoaWxkKCdUcmVlJykgYXMgVHJlZU1ldGFkYXRhO1xuICAgIH1cbiAgICB0aGlzLl9jb25zdHJ1Y3RCeVBhdGguc2V0KHRoaXMucm9vdC5ub2RlLnBhdGgsIHJvb3QpO1xuICAgIC8vIGRvIHRoaXMgb25jZSBhdCB0aGUgc3RhcnQgc28gd2UgZG9uJ3QgaGF2ZSB0byB0cmF2ZXJzZVxuICAgIC8vIHRoZSBlbnRpcmUgdHJlZSBldmVyeXRpbWUgd2Ugd2FudCB0byBmaW5kIGEgbmVzdGVkIG5vZGVcbiAgICB0aGlzLnJvb3Qubm9kZS5maW5kQWxsKCkuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICB0aGlzLl9jb25zdHJ1Y3RCeVBhdGguc2V0KGNoaWxkLm5vZGUucGF0aCwgY2hpbGQpO1xuICAgICAgY29uc3QgZGVmYXVsdENoaWxkID0gY2hpbGQubm9kZS5kZWZhdWx0Q2hpbGQ7XG4gICAgICBpZiAoZGVmYXVsdENoaWxkICYmIENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoZGVmYXVsdENoaWxkKSkge1xuICAgICAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGRlZmF1bHRDaGlsZCk7XG4gICAgICAgIGNvbnN0IGxvZ2ljYWxJZCA9IHN0YWNrLnJlc29sdmUoZGVmYXVsdENoaWxkLmxvZ2ljYWxJZCk7XG4gICAgICAgIHRoaXMuc2V0TG9naWNhbElkKHN0YWNrLCBsb2dpY2FsSWQsIGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFub3RoZXIgcGFzcyB0byBpbmNsdWRlIGFsbCB0aGUgTDFzIHRoYXQgaGF2ZW4ndCBiZWVuIGFkZGVkIHlldFxuICAgIHRoaXMucm9vdC5ub2RlLmZpbmRBbGwoKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgIGlmIChDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKGNoaWxkKSkge1xuICAgICAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGNoaWxkKTtcbiAgICAgICAgY29uc3QgbG9naWNhbElkID0gU3RhY2sub2YoY2hpbGQpLnJlc29sdmUoY2hpbGQubG9naWNhbElkKTtcbiAgICAgICAgdGhpcy5zZXRMb2dpY2FsSWQoc3RhY2ssIGxvZ2ljYWxJZCwgY2hpbGQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRMb2dpY2FsSWQoc3RhY2s6IFN0YWNrLCBsb2dpY2FsSWQ6IHN0cmluZywgY2hpbGQ6IENvbnN0cnVjdCkge1xuICAgIGlmICghdGhpcy5fY29uc3RydWN0QnlUZW1wbGF0ZVBhdGhBbmRMb2dpY2FsSWQuaGFzKHN0YWNrLnRlbXBsYXRlRmlsZSkpIHtcbiAgICAgIHRoaXMuX2NvbnN0cnVjdEJ5VGVtcGxhdGVQYXRoQW5kTG9naWNhbElkLnNldChzdGFjay50ZW1wbGF0ZUZpbGUsIG5ldyBNYXAoW1tsb2dpY2FsSWQsIGNoaWxkXV0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29uc3RydWN0QnlUZW1wbGF0ZVBhdGhBbmRMb2dpY2FsSWQuZ2V0KHN0YWNrLnRlbXBsYXRlRmlsZSk/LnNldChsb2dpY2FsSWQsIGNoaWxkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzdGFjayB0cmFjZSBmcm9tIHRoZSBjb25zdHJ1Y3Qgbm9kZSBtZXRhZGF0YS5cbiAgICogVGhlIHN0YWNrIHRyYWNlIG9ubHkgZ2V0cyByZWNvcmRlZCBpZiB0aGUgbm9kZSBpcyBhIGBDZm5SZXNvdXJjZWAsXG4gICAqIGJ1dCB0aGUgc3RhY2sgdHJhY2Ugd2lsbCBoYXZlIGVudHJpZXMgZm9yIGFsbCB0eXBlcyBvZiBwYXJlbnQgY29uc3RydWN0XG4gICAqIHNjb3Blc1xuICAgKi9cbiAgcHJpdmF0ZSBnZXRUcmFjZU1ldGFkYXRhKHNpemU6IG51bWJlciwgbm9kZT86IE5vZGUpOiBzdHJpbmdbXSB7XG4gICAgaWYgKG5vZGUpIHtcbiAgICAgIGNvbnN0IGNvbnN0cnVjdCA9IHRoaXMuZ2V0Q29uc3RydWN0QnlQYXRoKG5vZGUucGF0aCk7XG4gICAgICBpZiAoY29uc3RydWN0KSB7XG4gICAgICAgIGxldCB0cmFjZTtcbiAgICAgICAgaWYgKENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UoY29uc3RydWN0KSkge1xuICAgICAgICAgIHRyYWNlID0gY29uc3RydWN0Lm5vZGUubWV0YWRhdGEuZmluZChtZXRhID0+ICEhbWV0YS50cmFjZSk/LnRyYWNlID8/IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyYWNlID0gY29uc3RydWN0Lm5vZGUuZGVmYXVsdENoaWxkPy5ub2RlLm1ldGFkYXRhLmZpbmQobWV0YSA9PiAhIW1ldGEudHJhY2UpPy50cmFjZSA/PyBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGUgdG9wIGl0ZW0gaXMgbmV2ZXIgcG9pbnRpbmcgdG8gYW55dGhpbmcgcmVsZXZhbnRcbiAgICAgICAgdHJhY2Uuc2hpZnQoKTtcbiAgICAgICAgLy8gdGFrZSBqdXN0IHRoZSBpdGVtcyB3ZSBuZWVkIGFuZCByZXZlcnNlIGl0IHNpbmNlIHdlIGFyZVxuICAgICAgICAvLyBkaXNwbGF5aW5nIHRvIHRyYWNlIGJvdHRvbSB1cFxuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZSh0cmFjZS5zbGljZSgwLCBzaXplKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBDb25zdHJ1Y3RUcmFjZSBmcm9tIHRoZSBjYWNoZSBmb3IgYSBnaXZlbiBjb25zdHJ1Y3RcbiAgICpcbiAgICogQ29uc3RydWN0IHRoZSBzdGFjayB0cmFjZSBvZiBjb25zdHJ1Y3RzLiBUaGlzIHdpbGwgc3RhcnQgd2l0aCB0aGVcbiAgICogcm9vdCBvZiB0aGUgdHJlZSBhbmQgZ28gZG93biB0byB0aGUgY29uc3RydWN0IHRoYXQgaGFzIHRoZSB2aW9sYXRpb25cbiAgICovXG4gIHB1YmxpYyBnZXRUcmFjZShub2RlOiBOb2RlLCBsb2NhdGlvbnM/OiBzdHJpbmdbXSk6IENvbnN0cnVjdFRyYWNlIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB0cmFjZSA9IHRoaXMuX3RyYWNlQ2FjaGUuZ2V0KG5vZGUucGF0aCk7XG4gICAgaWYgKHRyYWNlKSB7XG4gICAgICByZXR1cm4gdHJhY2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc2l6ZSA9IHRoaXMubm9kZVNpemUobm9kZSk7XG5cbiAgICAvLyB0aGUgZmlyc3QgdGltZSB0aHJvdWdoIHRoZSBub2RlIHdpbGxcbiAgICAvLyBiZSB0aGUgcm9vdCBvZiB0aGUgdHJlZS4gV2UgbmVlZCB0byBnb1xuICAgIC8vIGRvd24gdGhlIHRyZWUgdW50aWwgd2UgZ2V0IHRvIHRoZSBib3R0b20gd2hpY2hcbiAgICAvLyB3aWxsIGJlIHRoZSByZXNvdXJjZSB3aXRoIHRoZSB2aW9sYXRpb24gYW5kIGl0XG4gICAgLy8gd2lsbCBjb250YWluIHRoZSB0cmFjZSBpbmZvXG4gICAgbGV0IGNoaWxkID0gbm9kZTtcbiAgICBpZiAoIWxvY2F0aW9ucykge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoY2hpbGQuY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZCA9IHRoaXMuZ2V0Q2hpbGQoY2hpbGQuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlIChjaGlsZC5jaGlsZHJlbik7XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gKGxvY2F0aW9ucyA/PyB0aGlzLmdldFRyYWNlTWV0YWRhdGEoc2l6ZSwgY2hpbGQpKTtcbiAgICBjb25zdCB0aGlzTG9jYXRpb24gPSBtZXRhZGF0YS5wb3AoKTtcblxuICAgIGxldCBjb25zdHJ1Y3RUcmFjZTogQ29uc3RydWN0VHJhY2UgPSB7XG4gICAgICBpZDogbm9kZS5pZCxcbiAgICAgIHBhdGg6IG5vZGUucGF0aCxcbiAgICAgIC8vIHRoZSBcImNoaWxkXCIgdHJhY2Ugd2lsbCBiZSB0aGUgXCJwYXJlbnRcIiBub2RlXG4gICAgICAvLyBzaW5jZSB3ZSBhcmUgZ29pbmcgYm90dG9tIHVwXG4gICAgICBjaGlsZDogbm9kZS5jaGlsZHJlblxuICAgICAgICA/IHRoaXMuZ2V0VHJhY2UodGhpcy5nZXRDaGlsZChub2RlLmNoaWxkcmVuKSwgbWV0YWRhdGEpXG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgY29uc3RydWN0OiBub2RlLmNvbnN0cnVjdEluZm8/LmZxbixcbiAgICAgIGxpYnJhcnlWZXJzaW9uOiBub2RlLmNvbnN0cnVjdEluZm8/LnZlcnNpb24sXG4gICAgICBsb2NhdGlvbjogdGhpc0xvY2F0aW9uID8/IFwiUnVuIHdpdGggJy0tZGVidWcnIHRvIGluY2x1ZGUgbG9jYXRpb24gaW5mb1wiLFxuICAgIH07XG4gICAgdGhpcy5fdHJhY2VDYWNoZS5zZXQoY29uc3RydWN0VHJhY2UucGF0aCwgY29uc3RydWN0VHJhY2UpO1xuICAgIHJldHVybiBjb25zdHJ1Y3RUcmFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFYWNoIG5vZGUgd2lsbCBvbmx5IGhhdmUgYSBzaW5nbGUgY2hpbGQgc28ganVzdFxuICAgKiByZXR1cm4gdGhhdFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDaGlsZChjaGlsZHJlbjogeyBba2V5OiBzdHJpbmddOiBOb2RlIH0pOiBOb2RlIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhjaGlsZHJlbilbMF07XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzaXplIG9mIGEgTm9kZVxuICAgKi9cbiAgcHJpdmF0ZSBub2RlU2l6ZShub2RlOiBOb2RlKTogbnVtYmVyIHtcbiAgICBsZXQgc2l6ZSA9IDE7XG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG4gICAgbGV0IGNoaWxkcmVuOiBOb2RlIHwgdW5kZWZpbmVkID0gdGhpcy5nZXRDaGlsZChub2RlLmNoaWxkcmVuKTtcbiAgICBkbyB7XG4gICAgICBzaXplKys7XG4gICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLmNoaWxkcmVuXG4gICAgICAgID8gdGhpcy5nZXRDaGlsZChjaGlsZHJlbi5jaGlsZHJlbilcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfSB3aGlsZSAoY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgc3BlY2lmaWMgbm9kZSBpbiB0aGUgdHJlZSBieSBjb25zdHJ1Y3QgcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCB0aGUgY29uc3RydWN0IHBhdGggb2YgdGhlIG5vZGUgdG8gcmV0dXJuXG4gICAqIEByZXR1cm5zIHRoZSBUcmVlTWV0YWRhdGEgTm9kZVxuICAgKi9cbiAgcHVibGljIGdldFRyZWVOb2RlKHBhdGg6IHN0cmluZyk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnRyZWVNZXRhZGF0YS5fZ2V0Tm9kZUJyYW5jaChwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBzcGVjaWZpYyBDb25zdHJ1Y3QgYnkgdGhlIG5vZGUuYWRkclxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCB0aGUgbm9kZS5hZGRyIG9mIHRoZSBjb25zdHJ1Y3RcbiAgICogQHJldHVybnMgdGhlIENvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIGdldENvbnN0cnVjdEJ5UGF0aChwYXRoOiBzdHJpbmcpOiBDb25zdHJ1Y3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb25zdHJ1Y3RCeVBhdGguZ2V0KHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHNwZWNpZmljIENvbnN0cnVjdCBieSB0aGUgQ2ZuUmVzb3VyY2UgbG9naWNhbCBJRC4gVGhpcyB3aWxsXG4gICAqIGJlIHRoZSBjb25zdHJ1Y3Qubm9kZS5kZWZhdWx0Q2hpbGQgd2l0aCB0aGUgZ2l2ZW4gSURcbiAgICpcbiAgICogQHBhcmFtIGxvZ2ljYWxJZCB0aGUgSUQgb2YgdGhlIENmblJlc291cmNlXG4gICAqIEByZXR1cm5zIHRoZSBDb25zdHJ1Y3RcbiAgICovXG4gIHB1YmxpYyBnZXRDb25zdHJ1Y3RCeUxvZ2ljYWxJZCh0ZW1wbGF0ZUZpbGU6IHN0cmluZywgbG9naWNhbElkOiBzdHJpbmcpOiBDb25zdHJ1Y3QgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb25zdHJ1Y3RCeVRlbXBsYXRlUGF0aEFuZExvZ2ljYWxJZC5nZXQodGVtcGxhdGVGaWxlKT8uZ2V0KGxvZ2ljYWxJZCk7XG4gIH1cbn1cbiJdfQ==