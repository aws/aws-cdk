"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeMetadata = void 0;
const fs = require("fs");
const path = require("path");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const constructs_1 = require("constructs");
const runtime_info_1 = require("./runtime-info");
const annotations_1 = require("../annotations");
const stack_1 = require("../stack");
const tree_1 = require("../tree");
const FILE_PATH = 'tree.json';
/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 */
class TreeMetadata extends constructs_1.Construct {
    constructor(scope) {
        super(scope, 'Tree');
    }
    /**
     * Create tree.json
     * @internal
     */
    _synthesizeTree(session) {
        const lookup = {};
        const visit = (construct) => {
            const children = construct.node.children.map((c) => {
                try {
                    return visit(c);
                }
                catch (e) {
                    annotations_1.Annotations.of(this).addWarning(`Failed to render tree metadata for node [${c.node.id}]. Reason: ${e}`);
                    return undefined;
                }
            });
            const childrenMap = children
                .filter((child) => child !== undefined)
                .reduce((map, child) => Object.assign(map, { [child.id]: child }), {});
            const parent = construct.node.scope;
            const node = {
                id: construct.node.id || 'App',
                path: construct.node.path,
                parent: parent && parent.node.path ? {
                    id: parent.node.id,
                    path: parent.node.path,
                    constructInfo: (0, runtime_info_1.constructInfoFromConstruct)(parent),
                } : undefined,
                children: Object.keys(childrenMap).length === 0 ? undefined : childrenMap,
                attributes: this.synthAttributes(construct),
                constructInfo: (0, runtime_info_1.constructInfoFromConstruct)(construct),
            };
            lookup[node.path] = node;
            return node;
        };
        const tree = {
            version: 'tree-0.1',
            tree: visit(this.node.root),
        };
        this._tree = lookup;
        const builder = session.assembly;
        fs.writeFileSync(path.join(builder.outdir, FILE_PATH), JSON.stringify(tree, (key, value) => {
            // we are adding in the `parent` attribute for internal use
            // and it doesn't make much sense to include it in the
            // tree.json
            if (key === 'parent')
                return undefined;
            return value;
        }, 2), { encoding: 'utf-8' });
        builder.addArtifact('Tree', {
            type: cloud_assembly_schema_1.ArtifactType.CDK_TREE,
            properties: {
                file: FILE_PATH,
            },
        });
    }
    /**
     * This gets a specific "branch" of the tree for a given construct path.
     * It will return the root Node of the tree with non-relevant branches filtered
     * out (i.e. node children that don't traverse to the given construct path)
     *
     * @internal
     */
    _getNodeBranch(constructPath) {
        if (!this._tree) {
            throw new Error(`attempting to get node branch for ${constructPath}, but the tree has not been created yet!`);
        }
        const tree = this._tree[constructPath];
        const newTree = {
            id: tree.id,
            path: tree.path,
            attributes: tree.attributes,
            constructInfo: tree.constructInfo,
            // need to re-add the parent because the current node
            // won't have the parent's parent
            parent: tree.parent ? this._tree[tree.parent.path] : undefined,
        };
        // need the properties to be mutable
        let branch = newTree;
        do {
            branch.parent.children = {
                [branch.id]: branch,
            };
            branch = branch.parent;
        } while (branch.parent);
        return branch;
    }
    synthAttributes(construct) {
        // check if a construct implements IInspectable
        function canInspect(inspectable) {
            return inspectable.inspect !== undefined;
        }
        const inspector = new tree_1.TreeInspector();
        // get attributes from the inspector
        if (canInspect(construct)) {
            construct.inspect(inspector);
            return stack_1.Stack.of(construct).resolve(inspector.attributes);
        }
        return undefined;
    }
}
exports.TreeMetadata = TreeMetadata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUtbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QiwwRUFBOEQ7QUFDOUQsMkNBQW1EO0FBQ25ELGlEQUEyRTtBQUMzRSxnREFBNkM7QUFDN0Msb0NBQWlDO0FBRWpDLGtDQUFzRDtBQUV0RCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUV6QyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGVBQWUsQ0FBQyxPQUEwQjtRQUMvQyxNQUFNLE1BQU0sR0FBNkIsRUFBRyxDQUFDO1FBRTdDLE1BQU0sS0FBSyxHQUFHLENBQUMsU0FBcUIsRUFBUSxFQUFFO1lBQzVDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJO29CQUNGLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqQjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVix5QkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hHLE9BQU8sU0FBUyxDQUFDO2lCQUNsQjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxXQUFXLEdBQUcsUUFBUTtpQkFDekIsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO2lCQUN0QyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FB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SUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1NBQy9ELENBQUM7UUFDRixvQ0FBb0M7UUFDcEMsSUFBSSxNQUFNLEdBQUcsT0FBYyxDQUFDO1FBQzVCLEdBQUc7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRztnQkFDdkIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTTthQUNwQixDQUFDO1lBQ0YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDeEIsUUFBUSxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ3hCLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxlQUFlLENBQUMsU0FBcUI7UUFDM0MsK0NBQStDO1FBQy9DLFNBQVMsVUFBVSxDQUFDLFdBQWdCO1lBQ2xDLE9BQU8sV0FBVyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7UUFDM0MsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksb0JBQWEsRUFBRSxDQUFDO1FBRXRDLG9DQUFvQztRQUNwQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN6QixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sYUFBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBbkhELG9DQW1IQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IEFydGlmYWN0VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbnN0cnVjdEluZm8sIGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0IH0gZnJvbSAnLi9ydW50aW1lLWluZm8nO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi4vc3RhY2stc3ludGhlc2l6ZXJzJztcbmltcG9ydCB7IElJbnNwZWN0YWJsZSwgVHJlZUluc3BlY3RvciB9IGZyb20gJy4uL3RyZWUnO1xuXG5jb25zdCBGSUxFX1BBVEggPSAndHJlZS5qc29uJztcblxuLyoqXG4gKiBDb25zdHJ1Y3QgdGhhdCBpcyBhdXRvbWF0aWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0b3AtbGV2ZWwgYEFwcGAuXG4gKiBUaGlzIGdlbmVyYXRlcywgYXMgcGFydCBvZiBzeW50aGVzaXMsIGEgZmlsZSBjb250YWluaW5nIHRoZSBjb25zdHJ1Y3QgdHJlZSBhbmQgdGhlIG1ldGFkYXRhIGZvciBlYWNoIG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBUaGUgb3V0cHV0IGlzIGluIGEgdHJlZSBmb3JtYXQgc28gYXMgdG8gcHJlc2VydmUgdGhlIGNvbnN0cnVjdCBoaWVyYXJjaHkuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVHJlZU1ldGFkYXRhIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHJpdmF0ZSBfdHJlZT86IHsgW3BhdGg6IHN0cmluZ106IE5vZGUgfTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHN1cGVyKHNjb3BlLCAnVHJlZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0cmVlLmpzb25cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3N5bnRoZXNpemVUcmVlKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKSB7XG4gICAgY29uc3QgbG9va3VwOiB7IFtwYXRoOiBzdHJpbmddOiBOb2RlIH0gPSB7IH07XG5cbiAgICBjb25zdCB2aXNpdCA9IChjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBOb2RlID0+IHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gY29uc3RydWN0Lm5vZGUuY2hpbGRyZW4ubWFwKChjKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHZpc2l0KGMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgRmFpbGVkIHRvIHJlbmRlciB0cmVlIG1ldGFkYXRhIGZvciBub2RlIFske2Mubm9kZS5pZH1dLiBSZWFzb246ICR7ZX1gKTtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNoaWxkcmVuTWFwID0gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIC5yZWR1Y2UoKG1hcCwgY2hpbGQpID0+IE9iamVjdC5hc3NpZ24obWFwLCB7IFtjaGlsZCEuaWRdOiBjaGlsZCB9KSwge30pO1xuXG4gICAgICBjb25zdCBwYXJlbnQgPSBjb25zdHJ1Y3Qubm9kZS5zY29wZTtcbiAgICAgIGNvbnN0IG5vZGU6IE5vZGUgPSB7XG4gICAgICAgIGlkOiBjb25zdHJ1Y3Qubm9kZS5pZCB8fCAnQXBwJyxcbiAgICAgICAgcGF0aDogY29uc3RydWN0Lm5vZGUucGF0aCxcbiAgICAgICAgcGFyZW50OiBwYXJlbnQgJiYgcGFyZW50Lm5vZGUucGF0aCA/IHtcbiAgICAgICAgICBpZDogcGFyZW50Lm5vZGUuaWQsXG4gICAgICAgICAgcGF0aDogcGFyZW50Lm5vZGUucGF0aCxcbiAgICAgICAgICBjb25zdHJ1Y3RJbmZvOiBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChwYXJlbnQpLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgICBjaGlsZHJlbjogT2JqZWN0LmtleXMoY2hpbGRyZW5NYXApLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IGNoaWxkcmVuTWFwLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLnN5bnRoQXR0cmlidXRlcyhjb25zdHJ1Y3QpLFxuICAgICAgICBjb25zdHJ1Y3RJbmZvOiBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChjb25zdHJ1Y3QpLFxuICAgICAgfTtcblxuICAgICAgbG9va3VwW25vZGUucGF0aF0gPSBub2RlO1xuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiB2aXNpdCh0aGlzLm5vZGUucm9vdCksXG4gICAgfTtcbiAgICB0aGlzLl90cmVlID0gbG9va3VwO1xuXG4gICAgY29uc3QgYnVpbGRlciA9IHNlc3Npb24uYXNzZW1ibHk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oYnVpbGRlci5vdXRkaXIsIEZJTEVfUEFUSCksIEpTT04uc3RyaW5naWZ5KHRyZWUsIChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuICAgICAgLy8gd2UgYXJlIGFkZGluZyBpbiB0aGUgYHBhcmVudGAgYXR0cmlidXRlIGZvciBpbnRlcm5hbCB1c2VcbiAgICAgIC8vIGFuZCBpdCBkb2Vzbid0IG1ha2UgbXVjaCBzZW5zZSB0byBpbmNsdWRlIGl0IGluIHRoZVxuICAgICAgLy8gdHJlZS5qc29uXG4gICAgICBpZiAoa2V5ID09PSAncGFyZW50JykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCAyKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcblxuICAgIGJ1aWxkZXIuYWRkQXJ0aWZhY3QoJ1RyZWUnLCB7XG4gICAgICB0eXBlOiBBcnRpZmFjdFR5cGUuQ0RLX1RSRUUsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZpbGU6IEZJTEVfUEFUSCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBnZXRzIGEgc3BlY2lmaWMgXCJicmFuY2hcIiBvZiB0aGUgdHJlZSBmb3IgYSBnaXZlbiBjb25zdHJ1Y3QgcGF0aC5cbiAgICogSXQgd2lsbCByZXR1cm4gdGhlIHJvb3QgTm9kZSBvZiB0aGUgdHJlZSB3aXRoIG5vbi1yZWxldmFudCBicmFuY2hlcyBmaWx0ZXJlZFxuICAgKiBvdXQgKGkuZS4gbm9kZSBjaGlsZHJlbiB0aGF0IGRvbid0IHRyYXZlcnNlIHRvIHRoZSBnaXZlbiBjb25zdHJ1Y3QgcGF0aClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2dldE5vZGVCcmFuY2goY29uc3RydWN0UGF0aDogc3RyaW5nKTogTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCF0aGlzLl90cmVlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGF0dGVtcHRpbmcgdG8gZ2V0IG5vZGUgYnJhbmNoIGZvciAke2NvbnN0cnVjdFBhdGh9LCBidXQgdGhlIHRyZWUgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0IWApO1xuICAgIH1cbiAgICBjb25zdCB0cmVlID0gdGhpcy5fdHJlZVtjb25zdHJ1Y3RQYXRoXTtcbiAgICBjb25zdCBuZXdUcmVlOiBOb2RlID0ge1xuICAgICAgaWQ6IHRyZWUuaWQsXG4gICAgICBwYXRoOiB0cmVlLnBhdGgsXG4gICAgICBhdHRyaWJ1dGVzOiB0cmVlLmF0dHJpYnV0ZXMsXG4gICAgICBjb25zdHJ1Y3RJbmZvOiB0cmVlLmNvbnN0cnVjdEluZm8sXG4gICAgICAvLyBuZWVkIHRvIHJlLWFkZCB0aGUgcGFyZW50IGJlY2F1c2UgdGhlIGN1cnJlbnQgbm9kZVxuICAgICAgLy8gd29uJ3QgaGF2ZSB0aGUgcGFyZW50J3MgcGFyZW50XG4gICAgICBwYXJlbnQ6IHRyZWUucGFyZW50ID8gdGhpcy5fdHJlZVt0cmVlLnBhcmVudC5wYXRoXSA6IHVuZGVmaW5lZCxcbiAgICB9O1xuICAgIC8vIG5lZWQgdGhlIHByb3BlcnRpZXMgdG8gYmUgbXV0YWJsZVxuICAgIGxldCBicmFuY2ggPSBuZXdUcmVlIGFzIGFueTtcbiAgICBkbyB7XG4gICAgICBicmFuY2gucGFyZW50LmNoaWxkcmVuID0ge1xuICAgICAgICBbYnJhbmNoLmlkXTogYnJhbmNoLFxuICAgICAgfTtcbiAgICAgIGJyYW5jaCA9IGJyYW5jaC5wYXJlbnQ7XG4gICAgfSB3aGlsZSAoYnJhbmNoLnBhcmVudCk7XG4gICAgcmV0dXJuIGJyYW5jaDtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhBdHRyaWJ1dGVzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQge1xuICAgIC8vIGNoZWNrIGlmIGEgY29uc3RydWN0IGltcGxlbWVudHMgSUluc3BlY3RhYmxlXG4gICAgZnVuY3Rpb24gY2FuSW5zcGVjdChpbnNwZWN0YWJsZTogYW55KTogaW5zcGVjdGFibGUgaXMgSUluc3BlY3RhYmxlIHtcbiAgICAgIHJldHVybiBpbnNwZWN0YWJsZS5pbnNwZWN0ICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgaW5zcGVjdG9yID0gbmV3IFRyZWVJbnNwZWN0b3IoKTtcblxuICAgIC8vIGdldCBhdHRyaWJ1dGVzIGZyb20gdGhlIGluc3BlY3RvclxuICAgIGlmIChjYW5JbnNwZWN0KGNvbnN0cnVjdCkpIHtcbiAgICAgIGNvbnN0cnVjdC5pbnNwZWN0KGluc3BlY3Rvcik7XG4gICAgICByZXR1cm4gU3RhY2sub2YoY29uc3RydWN0KS5yZXNvbHZlKGluc3BlY3Rvci5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGUge1xuICByZWFkb25seSBpZDogc3RyaW5nO1xuICByZWFkb25seSBwYXRoOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHBhcmVudD86IE5vZGU7XG4gIHJlYWRvbmx5IGNoaWxkcmVuPzogeyBba2V5OiBzdHJpbmddOiBOb2RlIH07XG4gIHJlYWRvbmx5IGF0dHJpYnV0ZXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBvbiB0aGUgY29uc3RydWN0IGNsYXNzIHRoYXQgbGVkIHRvIHRoaXMgbm9kZSwgaWYgYXZhaWxhYmxlXG4gICAqL1xuICByZWFkb25seSBjb25zdHJ1Y3RJbmZvPzogQ29uc3RydWN0SW5mbztcbn1cbiJdfQ==