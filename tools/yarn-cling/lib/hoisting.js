"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hoistDependencies = void 0;
/**
 * Hoist package-lock dependencies in-place
 */
function hoistDependencies(packageLockDeps) {
    let didChange;
    do {
        didChange = false;
        simplify(packageLockDeps);
    } while (didChange);
    // For each of the deps, move each dependency that has the same version into the current array
    function simplify(dependencies) {
        for (const depPackage of Object.values(dependencies)) {
            moveChildrenUp(depPackage, dependencies);
        }
        return dependencies;
    }
    // Move the children of the parent onto the same level if there are no conflicts
    function moveChildrenUp(parent, parentContainer) {
        if (!parent.dependencies) {
            return;
        }
        // Then push packages from the mutable parent into ITS parent
        for (const [depName, depPackage] of Object.entries(parent.dependencies)) {
            if (!parentContainer[depName]) {
                // It's new, we can move it up.
                parentContainer[depName] = depPackage;
                delete parent.dependencies[depName];
                didChange = true;
                // Recurse on the package we just moved
                moveChildrenUp(depPackage, parentContainer);
            }
            else if (parentContainer[depName].version === depPackage.version) {
                // Already exists, no conflict, delete the child, no need to recurse
                delete parent.dependencies[depName];
                didChange = true;
            }
            else {
                // There is a conflict, leave the second package where it is, but do recurse.
                moveChildrenUp(depPackage, parent.dependencies);
            }
        }
        // Cleanup for nice printing
        if (Object.keys(parent.dependencies).length === 0) {
            delete parent.dependencies;
            didChange = true;
        }
    }
}
exports.hoistDependencies = hoistDependencies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9pc3RpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob2lzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTs7R0FFRztBQUNILFNBQWdCLGlCQUFpQixDQUFDLGVBQW1EO0lBQ25GLElBQUksU0FBUyxDQUFDO0lBQ2QsR0FBRztRQUNELFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzNCLFFBQVEsU0FBUyxFQUFFO0lBRXBCLDhGQUE4RjtJQUM5RixTQUFTLFFBQVEsQ0FBQyxZQUFnRDtRQUNoRSxLQUFLLE1BQU0sVUFBVSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDcEQsY0FBYyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUMxQztRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxnRkFBZ0Y7SUFDaEYsU0FBUyxjQUFjLENBQUMsTUFBMEIsRUFBRSxlQUFtRDtRQUNyRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVyQyw2REFBNkQ7UUFDN0QsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzdCLCtCQUErQjtnQkFDL0IsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDdEMsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUVqQix1Q0FBdUM7Z0JBQ3ZDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7YUFDN0M7aUJBQU0sSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xFLG9FQUFvRTtnQkFDcEUsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLDZFQUE2RTtnQkFDN0UsY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDakQ7U0FDRjtRQUVELDRCQUE0QjtRQUM1QixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDakQsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQzNCLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQTdDRCw4Q0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYWNrYWdlTG9ja1BhY2thZ2UgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG4vKipcbiAqIEhvaXN0IHBhY2thZ2UtbG9jayBkZXBlbmRlbmNpZXMgaW4tcGxhY2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhvaXN0RGVwZW5kZW5jaWVzKHBhY2thZ2VMb2NrRGVwczogUmVjb3JkPHN0cmluZywgUGFja2FnZUxvY2tQYWNrYWdlPikge1xuICBsZXQgZGlkQ2hhbmdlO1xuICBkbyB7XG4gICAgZGlkQ2hhbmdlID0gZmFsc2U7XG4gICAgc2ltcGxpZnkocGFja2FnZUxvY2tEZXBzKTtcbiAgfSB3aGlsZSAoZGlkQ2hhbmdlKTtcblxuICAvLyBGb3IgZWFjaCBvZiB0aGUgZGVwcywgbW92ZSBlYWNoIGRlcGVuZGVuY3kgdGhhdCBoYXMgdGhlIHNhbWUgdmVyc2lvbiBpbnRvIHRoZSBjdXJyZW50IGFycmF5XG4gIGZ1bmN0aW9uIHNpbXBsaWZ5KGRlcGVuZGVuY2llczogUmVjb3JkPHN0cmluZywgUGFja2FnZUxvY2tQYWNrYWdlPikge1xuICAgIGZvciAoY29uc3QgZGVwUGFja2FnZSBvZiBPYmplY3QudmFsdWVzKGRlcGVuZGVuY2llcykpIHtcbiAgICAgIG1vdmVDaGlsZHJlblVwKGRlcFBhY2thZ2UsIGRlcGVuZGVuY2llcyk7XG4gICAgfVxuICAgIHJldHVybiBkZXBlbmRlbmNpZXM7XG4gIH1cblxuICAvLyBNb3ZlIHRoZSBjaGlsZHJlbiBvZiB0aGUgcGFyZW50IG9udG8gdGhlIHNhbWUgbGV2ZWwgaWYgdGhlcmUgYXJlIG5vIGNvbmZsaWN0c1xuICBmdW5jdGlvbiBtb3ZlQ2hpbGRyZW5VcChwYXJlbnQ6IFBhY2thZ2VMb2NrUGFja2FnZSwgcGFyZW50Q29udGFpbmVyOiBSZWNvcmQ8c3RyaW5nLCBQYWNrYWdlTG9ja1BhY2thZ2U+KSB7XG4gICAgaWYgKCFwYXJlbnQuZGVwZW5kZW5jaWVzKSB7IHJldHVybjsgfVxuXG4gICAgLy8gVGhlbiBwdXNoIHBhY2thZ2VzIGZyb20gdGhlIG11dGFibGUgcGFyZW50IGludG8gSVRTIHBhcmVudFxuICAgIGZvciAoY29uc3QgW2RlcE5hbWUsIGRlcFBhY2thZ2VdIG9mIE9iamVjdC5lbnRyaWVzKHBhcmVudC5kZXBlbmRlbmNpZXMpKSB7XG4gICAgICBpZiAoIXBhcmVudENvbnRhaW5lcltkZXBOYW1lXSkge1xuICAgICAgICAvLyBJdCdzIG5ldywgd2UgY2FuIG1vdmUgaXQgdXAuXG4gICAgICAgIHBhcmVudENvbnRhaW5lcltkZXBOYW1lXSA9IGRlcFBhY2thZ2U7XG4gICAgICAgIGRlbGV0ZSBwYXJlbnQuZGVwZW5kZW5jaWVzW2RlcE5hbWVdO1xuICAgICAgICBkaWRDaGFuZ2UgPSB0cnVlO1xuXG4gICAgICAgIC8vIFJlY3Vyc2Ugb24gdGhlIHBhY2thZ2Ugd2UganVzdCBtb3ZlZFxuICAgICAgICBtb3ZlQ2hpbGRyZW5VcChkZXBQYWNrYWdlLCBwYXJlbnRDb250YWluZXIpO1xuICAgICAgfSBlbHNlIGlmIChwYXJlbnRDb250YWluZXJbZGVwTmFtZV0udmVyc2lvbiA9PT0gZGVwUGFja2FnZS52ZXJzaW9uKSB7XG4gICAgICAgIC8vIEFscmVhZHkgZXhpc3RzLCBubyBjb25mbGljdCwgZGVsZXRlIHRoZSBjaGlsZCwgbm8gbmVlZCB0byByZWN1cnNlXG4gICAgICAgIGRlbGV0ZSBwYXJlbnQuZGVwZW5kZW5jaWVzW2RlcE5hbWVdO1xuICAgICAgICBkaWRDaGFuZ2UgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlcmUgaXMgYSBjb25mbGljdCwgbGVhdmUgdGhlIHNlY29uZCBwYWNrYWdlIHdoZXJlIGl0IGlzLCBidXQgZG8gcmVjdXJzZS5cbiAgICAgICAgbW92ZUNoaWxkcmVuVXAoZGVwUGFja2FnZSwgcGFyZW50LmRlcGVuZGVuY2llcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2xlYW51cCBmb3IgbmljZSBwcmludGluZ1xuICAgIGlmIChPYmplY3Qua2V5cyhwYXJlbnQuZGVwZW5kZW5jaWVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlbGV0ZSBwYXJlbnQuZGVwZW5kZW5jaWVzO1xuICAgICAgZGlkQ2hhbmdlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==