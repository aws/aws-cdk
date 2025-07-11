"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoistDependencies = hoistDependencies;
exports.renderTree = renderTree;
/**
 * Hoist package-lock dependencies in-place
 *
 * This happens in two phases:
 *
 * 1) Move every package into the parent scope (as long as it introduces no conflicts).
 *    This step mutates the dependency tree.
 * 2) Once no more packages can be moved up, clean up the tree. This step mutates the
 *    tree declarations but cannot change versions of required packages. Two cleanups:
 *    2a) Remove duplicates down the tree (same version that is inherited from above)
 *    2b) Remove useless packages that aren't depended upon by anything in that subtree.
 *        To determine whether a package is useful or useless in a tree, we record
 *        each package's original dependencies before we start messing around in the
 *        tree.
 *
 * This two-phase process replaces a proces that did move-and-delete as one step, which
 * sometimes would hoist a package into a place that was previously vacated by a conflicting
 * version, thereby causing the wrong version to be loaded.
 *
 * Hoisting is still rather expensive on a large tree (~100ms), we should find ways to
 * speed it up.
 */
function hoistDependencies(packageTree) {
    const originalDependencies = new Map();
    recordOriginalDependencies(packageTree);
    moveUp(packageTree);
    removeDupes(packageTree, []);
    removeUseless(packageTree);
    // Move the children of the parent onto the same level if there are no conflicts
    function moveUp(node, parent) {
        if (!node.dependencies) {
            return;
        }
        // Recurse
        for (const child of Object.values(node.dependencies)) {
            moveUp(child, node);
        }
        // Then push packages from the current node into its parent
        if (parent) {
            for (const [depName, depPackage] of Object.entries(node.dependencies)) {
                if (!parent.dependencies?.[depName]) {
                    // It's new and there's no version conflict, we can move it up.
                    parent.dependencies[depName] = depPackage;
                }
            }
        }
    }
    function removeDupes(node, rootPath) {
        if (!node.dependencies) {
            return;
        }
        // Any dependencies here that are the same in the parent can be removed
        for (const [depName, depPackage] of Object.entries(node.dependencies)) {
            if (findInheritedDepVersion(depName, rootPath) === depPackage.version) {
                delete node.dependencies[depName];
            }
        }
        // Recurse
        for (const child of Object.values(node.dependencies)) {
            removeDupes(child, [node, ...rootPath]);
        }
    }
    function removeUseless(node) {
        if (!node.dependencies) {
            return;
        }
        for (const [depName, depPkg] of Object.entries(node.dependencies)) {
            if (!necessaryInTree(depName, depPkg.version, node)) {
                delete node.dependencies[depName];
            }
        }
        // Recurse
        for (const child of Object.values(node.dependencies)) {
            removeUseless(child);
        }
        // If we ended up with empty dependencies, just get rid of the key (for clean printing)
        if (Object.keys(node.dependencies).length === 0) {
            delete node.dependencies;
        }
    }
    function findInheritedDepVersion(name, parentDependenciesChain) {
        for (const deps of parentDependenciesChain) {
            if (deps.dependencies?.[name]) {
                return deps.dependencies[name].version;
            }
        }
        return undefined;
    }
    function recordOriginalDependencies(node) {
        if (!node.dependencies) {
            return;
        }
        let list = originalDependencies.get(node);
        if (!list) {
            list = [];
            originalDependencies.set(node, list);
        }
        for (const [depName, depPkg] of Object.entries(node.dependencies)) {
            list.push(`${depName}@${depPkg.version}`);
            recordOriginalDependencies(depPkg);
        }
    }
    function necessaryInTree(name, version, tree) {
        if (originalDependencies.get(tree)?.includes(`${name}@${version}`)) {
            return true;
        }
        if (!tree.dependencies) {
            return false;
        }
        for (const depPackage of Object.values(tree.dependencies)) {
            if (necessaryInTree(name, version, depPackage)) {
                return true;
            }
        }
        return false;
    }
}
function renderTree(tree) {
    const ret = new Array();
    recurse(tree.dependencies ?? {}, []);
    return ret.sort(compareSplit);
    function recurse(n, parts) {
        for (const [k, v] of Object.entries(n)) {
            ret.push([...parts, k].join('.') + '=' + v.version);
            recurse(v.dependencies ?? {}, [...parts, k]);
        }
    }
    function compareSplit(a, b) {
        // Sort so that: 'a=1', 'a.b=2' get sorted in that order.
        const as = a.split(/\.|=/g);
        const bs = b.split(/\.|=/g);
        for (let i = 0; i < as.length && i < bs.length; i++) {
            const cmp = as[i].localeCompare(bs[i]);
            if (cmp !== 0) {
                return cmp;
            }
        }
        return as.length - bs.length;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9pc3RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob2lzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQXdCQSw4Q0FrR0M7QUFFRCxnQ0F3QkM7QUFsSkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLFdBQStCO0lBQy9ELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQWdDLENBQUM7SUFDckUsMEJBQTBCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BCLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0IsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTNCLGdGQUFnRjtJQUNoRixTQUFTLE1BQU0sQ0FBQyxJQUF3QixFQUFFLE1BQTJCO1FBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFBQyxPQUFPO1FBQUMsQ0FBQztRQUVuQyxVQUFVO1FBQ1YsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUVELDJEQUEyRDtRQUMzRCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztvQkFDcEMsK0RBQStEO29CQUMvRCxNQUFNLENBQUMsWUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDN0MsQ0FBQztZQUNILENBQUM7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Q0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTLFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUN4Qyx5REFBeUQ7UUFDekQsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFBQyxPQUFPLEdBQUcsQ0FBQztZQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVELE9BQU8sRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFja2FnZUxvY2tQYWNrYWdlIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogSG9pc3QgcGFja2FnZS1sb2NrIGRlcGVuZGVuY2llcyBpbi1wbGFjZVxuICpcbiAqIFRoaXMgaGFwcGVucyBpbiB0d28gcGhhc2VzOlxuICpcbiAqIDEpIE1vdmUgZXZlcnkgcGFja2FnZSBpbnRvIHRoZSBwYXJlbnQgc2NvcGUgKGFzIGxvbmcgYXMgaXQgaW50cm9kdWNlcyBubyBjb25mbGljdHMpLlxuICogICAgVGhpcyBzdGVwIG11dGF0ZXMgdGhlIGRlcGVuZGVuY3kgdHJlZS5cbiAqIDIpIE9uY2Ugbm8gbW9yZSBwYWNrYWdlcyBjYW4gYmUgbW92ZWQgdXAsIGNsZWFuIHVwIHRoZSB0cmVlLiBUaGlzIHN0ZXAgbXV0YXRlcyB0aGVcbiAqICAgIHRyZWUgZGVjbGFyYXRpb25zIGJ1dCBjYW5ub3QgY2hhbmdlIHZlcnNpb25zIG9mIHJlcXVpcmVkIHBhY2thZ2VzLiBUd28gY2xlYW51cHM6XG4gKiAgICAyYSkgUmVtb3ZlIGR1cGxpY2F0ZXMgZG93biB0aGUgdHJlZSAoc2FtZSB2ZXJzaW9uIHRoYXQgaXMgaW5oZXJpdGVkIGZyb20gYWJvdmUpXG4gKiAgICAyYikgUmVtb3ZlIHVzZWxlc3MgcGFja2FnZXMgdGhhdCBhcmVuJ3QgZGVwZW5kZWQgdXBvbiBieSBhbnl0aGluZyBpbiB0aGF0IHN1YnRyZWUuXG4gKiAgICAgICAgVG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBwYWNrYWdlIGlzIHVzZWZ1bCBvciB1c2VsZXNzIGluIGEgdHJlZSwgd2UgcmVjb3JkXG4gKiAgICAgICAgZWFjaCBwYWNrYWdlJ3Mgb3JpZ2luYWwgZGVwZW5kZW5jaWVzIGJlZm9yZSB3ZSBzdGFydCBtZXNzaW5nIGFyb3VuZCBpbiB0aGVcbiAqICAgICAgICB0cmVlLlxuICpcbiAqIFRoaXMgdHdvLXBoYXNlIHByb2Nlc3MgcmVwbGFjZXMgYSBwcm9jZXMgdGhhdCBkaWQgbW92ZS1hbmQtZGVsZXRlIGFzIG9uZSBzdGVwLCB3aGljaFxuICogc29tZXRpbWVzIHdvdWxkIGhvaXN0IGEgcGFja2FnZSBpbnRvIGEgcGxhY2UgdGhhdCB3YXMgcHJldmlvdXNseSB2YWNhdGVkIGJ5IGEgY29uZmxpY3RpbmdcbiAqIHZlcnNpb24sIHRoZXJlYnkgY2F1c2luZyB0aGUgd3JvbmcgdmVyc2lvbiB0byBiZSBsb2FkZWQuXG4gKlxuICogSG9pc3RpbmcgaXMgc3RpbGwgcmF0aGVyIGV4cGVuc2l2ZSBvbiBhIGxhcmdlIHRyZWUgKH4xMDBtcyksIHdlIHNob3VsZCBmaW5kIHdheXMgdG9cbiAqIHNwZWVkIGl0IHVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaG9pc3REZXBlbmRlbmNpZXMocGFja2FnZVRyZWU6IFBhY2thZ2VMb2NrUGFja2FnZSkge1xuICBjb25zdCBvcmlnaW5hbERlcGVuZGVuY2llcyA9IG5ldyBNYXA8UGFja2FnZUxvY2tQYWNrYWdlLCBzdHJpbmdbXT4oKTtcbiAgcmVjb3JkT3JpZ2luYWxEZXBlbmRlbmNpZXMocGFja2FnZVRyZWUpO1xuXG4gIG1vdmVVcChwYWNrYWdlVHJlZSk7XG4gIHJlbW92ZUR1cGVzKHBhY2thZ2VUcmVlLCBbXSk7XG4gIHJlbW92ZVVzZWxlc3MocGFja2FnZVRyZWUpO1xuXG4gIC8vIE1vdmUgdGhlIGNoaWxkcmVuIG9mIHRoZSBwYXJlbnQgb250byB0aGUgc2FtZSBsZXZlbCBpZiB0aGVyZSBhcmUgbm8gY29uZmxpY3RzXG4gIGZ1bmN0aW9uIG1vdmVVcChub2RlOiBQYWNrYWdlTG9ja1BhY2thZ2UsIHBhcmVudD86IFBhY2thZ2VMb2NrUGFja2FnZSkge1xuICAgIGlmICghbm9kZS5kZXBlbmRlbmNpZXMpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBSZWN1cnNlXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBPYmplY3QudmFsdWVzKG5vZGUuZGVwZW5kZW5jaWVzKSkge1xuICAgICAgbW92ZVVwKGNoaWxkLCBub2RlKTtcbiAgICB9XG5cbiAgICAvLyBUaGVuIHB1c2ggcGFja2FnZXMgZnJvbSB0aGUgY3VycmVudCBub2RlIGludG8gaXRzIHBhcmVudFxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGZvciAoY29uc3QgW2RlcE5hbWUsIGRlcFBhY2thZ2VdIG9mIE9iamVjdC5lbnRyaWVzKG5vZGUuZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICBpZiAoIXBhcmVudC5kZXBlbmRlbmNpZXM/LltkZXBOYW1lXSkge1xuICAgICAgICAgIC8vIEl0J3MgbmV3IGFuZCB0aGVyZSdzIG5vIHZlcnNpb24gY29uZmxpY3QsIHdlIGNhbiBtb3ZlIGl0IHVwLlxuICAgICAgICAgIHBhcmVudC5kZXBlbmRlbmNpZXMhW2RlcE5hbWVdID0gZGVwUGFja2FnZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUR1cGVzKG5vZGU6IFBhY2thZ2VMb2NrUGFja2FnZSwgcm9vdFBhdGg6IEFycmF5PFBhY2thZ2VMb2NrUGFja2FnZT4pIHtcbiAgICBpZiAoIW5vZGUuZGVwZW5kZW5jaWVzKSB7IHJldHVybjsgfVxuXG4gICAgLy8gQW55IGRlcGVuZGVuY2llcyBoZXJlIHRoYXQgYXJlIHRoZSBzYW1lIGluIHRoZSBwYXJlbnQgY2FuIGJlIHJlbW92ZWRcbiAgICBmb3IgKGNvbnN0IFtkZXBOYW1lLCBkZXBQYWNrYWdlXSBvZiBPYmplY3QuZW50cmllcyhub2RlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIGlmIChmaW5kSW5oZXJpdGVkRGVwVmVyc2lvbihkZXBOYW1lLCByb290UGF0aCkgPT09IGRlcFBhY2thZ2UudmVyc2lvbikge1xuICAgICAgICBkZWxldGUgbm9kZS5kZXBlbmRlbmNpZXNbZGVwTmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzZVxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgT2JqZWN0LnZhbHVlcyhub2RlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIHJlbW92ZUR1cGVzKGNoaWxkLCBbbm9kZSwgLi4ucm9vdFBhdGhdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVVc2VsZXNzKG5vZGU6IFBhY2thZ2VMb2NrUGFja2FnZSkge1xuICAgIGlmICghbm9kZS5kZXBlbmRlbmNpZXMpIHsgcmV0dXJuOyB9XG4gICAgZm9yIChjb25zdCBbZGVwTmFtZSwgZGVwUGtnXSBvZiBPYmplY3QuZW50cmllcyhub2RlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIGlmICghbmVjZXNzYXJ5SW5UcmVlKGRlcE5hbWUsIGRlcFBrZy52ZXJzaW9uLCBub2RlKSkge1xuICAgICAgICBkZWxldGUgbm9kZS5kZXBlbmRlbmNpZXNbZGVwTmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzZVxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgT2JqZWN0LnZhbHVlcyhub2RlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIHJlbW92ZVVzZWxlc3MoY2hpbGQpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGVuZGVkIHVwIHdpdGggZW1wdHkgZGVwZW5kZW5jaWVzLCBqdXN0IGdldCByaWQgb2YgdGhlIGtleSAoZm9yIGNsZWFuIHByaW50aW5nKVxuICAgIGlmIChPYmplY3Qua2V5cyhub2RlLmRlcGVuZGVuY2llcykubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWxldGUgbm9kZS5kZXBlbmRlbmNpZXM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmluZEluaGVyaXRlZERlcFZlcnNpb24obmFtZTogc3RyaW5nLCBwYXJlbnREZXBlbmRlbmNpZXNDaGFpbjogQXJyYXk8UGFja2FnZUxvY2tQYWNrYWdlPikge1xuICAgIGZvciAoY29uc3QgZGVwcyBvZiBwYXJlbnREZXBlbmRlbmNpZXNDaGFpbikge1xuICAgICAgaWYgKGRlcHMuZGVwZW5kZW5jaWVzPy5bbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGRlcHMuZGVwZW5kZW5jaWVzW25hbWVdLnZlcnNpb247XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiByZWNvcmRPcmlnaW5hbERlcGVuZGVuY2llcyhub2RlOiBQYWNrYWdlTG9ja1BhY2thZ2UpIHtcbiAgICBpZiAoIW5vZGUuZGVwZW5kZW5jaWVzKSB7IHJldHVybjsgfVxuXG4gICAgbGV0IGxpc3QgPSBvcmlnaW5hbERlcGVuZGVuY2llcy5nZXQobm9kZSk7XG4gICAgaWYgKCFsaXN0KSB7XG4gICAgICBsaXN0ID0gW107XG4gICAgICBvcmlnaW5hbERlcGVuZGVuY2llcy5zZXQobm9kZSwgbGlzdCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBbZGVwTmFtZSwgZGVwUGtnXSBvZiBPYmplY3QuZW50cmllcyhub2RlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIGxpc3QucHVzaChgJHtkZXBOYW1lfUAke2RlcFBrZy52ZXJzaW9ufWApO1xuICAgICAgcmVjb3JkT3JpZ2luYWxEZXBlbmRlbmNpZXMoZGVwUGtnKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBuZWNlc3NhcnlJblRyZWUobmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIHRyZWU6IFBhY2thZ2VMb2NrUGFja2FnZSkge1xuICAgIGlmIChvcmlnaW5hbERlcGVuZGVuY2llcy5nZXQodHJlZSk/LmluY2x1ZGVzKGAke25hbWV9QCR7dmVyc2lvbn1gKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghdHJlZS5kZXBlbmRlbmNpZXMpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICBmb3IgKGNvbnN0IGRlcFBhY2thZ2Ugb2YgT2JqZWN0LnZhbHVlcyh0cmVlLmRlcGVuZGVuY2llcykpIHtcbiAgICAgIGlmIChuZWNlc3NhcnlJblRyZWUobmFtZSwgdmVyc2lvbiwgZGVwUGFja2FnZSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJUcmVlKHRyZWU6IFBhY2thZ2VMb2NrUGFja2FnZSk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgcmVjdXJzZSh0cmVlLmRlcGVuZGVuY2llcyA/PyB7fSwgW10pO1xuICByZXR1cm4gcmV0LnNvcnQoY29tcGFyZVNwbGl0KTtcblxuICBmdW5jdGlvbiByZWN1cnNlKG46IFJlY29yZDxzdHJpbmcsIFBhY2thZ2VMb2NrUGFja2FnZT4sIHBhcnRzOiBzdHJpbmdbXSkge1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKG4pKSB7XG4gICAgICByZXQucHVzaChbLi4ucGFydHMsIGtdLmpvaW4oJy4nKSArICc9JyArIHYudmVyc2lvbik7XG4gICAgICByZWN1cnNlKHYuZGVwZW5kZW5jaWVzID8/IHt9LCBbLi4ucGFydHMsIGtdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb21wYXJlU3BsaXQoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIC8vIFNvcnQgc28gdGhhdDogJ2E9MScsICdhLmI9MicgZ2V0IHNvcnRlZCBpbiB0aGF0IG9yZGVyLlxuICAgIGNvbnN0IGFzID0gYS5zcGxpdCgvXFwufD0vZyk7XG4gICAgY29uc3QgYnMgPSBiLnNwbGl0KC9cXC58PS9nKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXMubGVuZ3RoICYmIGkgPCBicy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY21wID0gYXNbaV0ubG9jYWxlQ29tcGFyZShic1tpXSk7XG4gICAgICBpZiAoY21wICE9PSAwKSB7IHJldHVybiBjbXA7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXMubGVuZ3RoIC0gYnMubGVuZ3RoO1xuICB9XG59XG4iXX0=