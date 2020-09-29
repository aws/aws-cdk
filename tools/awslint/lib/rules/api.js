"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linter_1 = require("../linter");
const construct_1 = require("./construct");
const core_types_1 = require("./core-types");
const EXCLUDE_ANNOTATION_REF_VIA_INTERFACE = '[disable-awslint:ref-via-interface]';
// lint all constructs that are not L1 resources
exports.apiLinter = new linter_1.Linter(a => construct_1.ConstructReflection
    .findAllConstructs(a)
    .filter(c => !core_types_1.CoreTypes.isCfnResource(c.classType)));
exports.apiLinter.add({
    code: 'ref-via-interface',
    message: 'API should use interface and not the concrete class (%s). ' +
        `If this is intentional, add "${EXCLUDE_ANNOTATION_REF_VIA_INTERFACE}" to element's jsdoc`,
    eval: e => {
        const cls = e.ctx.classType;
        const visited = new Set();
        assertClass(cls);
        function assertClass(type) {
            if (visited.has(type.fqn)) {
                return;
            }
            visited.add(type.fqn);
            for (const method of type.allMethods) {
                assertMethod(method);
            }
            if (type.initializer) {
                assertMethod(type.initializer);
            }
        }
        function assertDataType(type) {
            for (const property of type.allProperties) {
                assertProperty(property);
            }
        }
        function assertInterface(type) {
            if (visited.has(type.fqn)) {
                return;
            }
            visited.add(type.fqn);
            if (type.datatype) {
                assertDataType(type);
            }
            for (const method of type.allMethods) {
                assertMethod(method);
            }
        }
        function assertProperty(property) {
            if (property.protected) {
                return;
            }
            const site = property.overrides ? property.overrides : property.parentType;
            assertType(property.type, property.docs, `${site.fqn}.${property.name}`);
        }
        function assertMethod(method) {
            if (method.protected) {
                return;
            }
            const site = method.overrides ? method.overrides : method.parentType;
            const scope = `${site.fqn}.${method.name}`;
            let firstMethod = site.isClassType() || site.isInterfaceType()
                ? site.allMethods.find(m => m.name === method.name)
                : undefined;
            if (!firstMethod) {
                firstMethod = method;
            }
            for (const param of firstMethod.parameters) {
                assertType(param.type, param.docs, `${scope}.${param.name}`);
            }
            // note that we do not require that return values will use an interface
        }
        function assertType(type, docs, scope) {
            if (type.primitive) {
                return;
            }
            if (type.void) {
                return;
            }
            if (type.arrayOfType) {
                return assertType(type.arrayOfType, docs, scope);
            }
            if (type.mapOfType) {
                return assertType(type.mapOfType, docs, scope);
            }
            if (type.unionOfTypes) {
                for (const t of type.unionOfTypes) {
                    assertType(t, docs, scope);
                }
                return;
            }
            // interfaces are okay
            if (type.type && type.type.isInterfaceType()) {
                return assertInterface(type.type);
            }
            // enums are okay
            if (type.type && type.type.isEnumType()) {
                return;
            }
            // classes are okay as long as they are not resource constructs
            if (type.type && type.type.isClassType()) {
                if (!core_types_1.CoreTypes.isResourceClass(type.type)) {
                    return;
                }
                if (type.type.fqn === e.ctx.core.constructClass.fqn) {
                    return;
                }
                // allow exclusion of this rule
                if (docs.summary.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE) || docs.remarks.includes(EXCLUDE_ANNOTATION_REF_VIA_INTERFACE)) {
                    return;
                }
                e.assert(false, scope, type.type.fqn);
                return;
            }
            throw new Error(`invalid type reference: ${type.toString()}`);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0NBQW1DO0FBQ25DLDJDQUFrRDtBQUNsRCw2Q0FBeUM7QUFFekMsTUFBTSxvQ0FBb0MsR0FBRyxxQ0FBcUMsQ0FBQztBQUVuRixnREFBZ0Q7QUFDbkMsUUFBQSxTQUFTLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQywrQkFBbUI7S0FDekQsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQ3BCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsc0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV2RCxpQkFBUyxDQUFDLEdBQUcsQ0FBQztJQUNaLElBQUksRUFBRSxtQkFBbUI7SUFDekIsT0FBTyxFQUFFLDREQUE0RDtRQUNuRSxnQ0FBZ0Msb0NBQW9DLHNCQUFzQjtJQUM1RixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDUixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUM1QixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBRWxDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixTQUFTLFdBQVcsQ0FBQyxJQUF1QjtZQUMxQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV0QixLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN0QjtZQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsWUFBWSxDQUFDLElB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QkFBMkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlZmxlY3QgZnJvbSAnanNpaS1yZWZsZWN0JztcbmltcG9ydCB7IExpbnRlciB9IGZyb20gJy4uL2xpbnRlcic7XG5pbXBvcnQgeyBDb25zdHJ1Y3RSZWZsZWN0aW9uIH0gZnJvbSAnLi9jb25zdHJ1Y3QnO1xuaW1wb3J0IHsgQ29yZVR5cGVzIH0gZnJvbSAnLi9jb3JlLXR5cGVzJztcblxuY29uc3QgRVhDTFVERV9BTk5PVEFUSU9OX1JFRl9WSUFfSU5URVJGQUNFID0gJ1tkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdJztcblxuLy8gbGludCBhbGwgY29uc3RydWN0cyB0aGF0IGFyZSBub3QgTDEgcmVzb3VyY2VzXG5leHBvcnQgY29uc3QgYXBpTGludGVyID0gbmV3IExpbnRlcihhID0+IENvbnN0cnVjdFJlZmxlY3Rpb25cbiAgLmZpbmRBbGxDb25zdHJ1Y3RzKGEpXG4gIC5maWx0ZXIoYyA9PiAhQ29yZVR5cGVzLmlzQ2ZuUmVzb3VyY2UoYy5jbGFzc1R5cGUpKSk7XG5cbmFwaUxpbnRlci5hZGQoe1xuICBjb2RlOiAncmVmLXZpYS1pbnRlcmZhY2UnLFxuICBtZXNzYWdlOiAnQVBJIHNob3VsZCB1c2UgaW50ZXJmYWNlIGFuZCBub3QgdGhlIGNvbmNyZXRlIGNsYXNzICglcykuICcgK1xuICAgIGBJZiB0aGlzIGlzIGludGVudGlvbmFsLCBhZGQgXCIke0VYQ0xVREVfQU5OT1RBVElPTl9SRUZfVklBX0lOVEVSRkFDRX1cIiB0byBlbGVtZW50J3MganNkb2NgLFxuICBldmFsOiBlID0+IHtcbiAgICBjb25zdCBjbHMgPSBlLmN0eC5jbGFzc1R5cGU7XG4gICAgY29uc3QgdmlzaXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgYXNzZXJ0Q2xhc3MoY2xzKTtcblxuICAgIGZ1bmN0aW9uIGFzc2VydENsYXNzKHR5cGU6IHJlZmxlY3QuQ2xhc3NUeXBlKTogdm9pZCB7XG4gICAgICBpZiAodmlzaXRlZC5oYXModHlwZS5mcW4pKSB7IHJldHVybjsgfVxuICAgICAgdmlzaXRlZC5hZGQodHlwZS5mcW4pO1xuXG4gICAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiB0eXBlLmFsbE1ldGhvZHMpIHtcbiAgICAgICAgYXNzZXJ0TWV0aG9kKG1ldGhvZCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLmluaXRpYWxpemVyKSB7XG4gICAgICAgIGFzc2VydE1ldGhvZCh0eXBlLmluaXRpYWxpemVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc3NlcnREYXRhVHlwZSh0eXBlOiByZWZsZWN0LkludGVyZmFjZVR5cGUpOiB2b2lkIHtcbiAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgdHlwZS5hbGxQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGFzc2VydFByb3BlcnR5KHByb3BlcnR5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc3NlcnRJbnRlcmZhY2UodHlwZTogcmVmbGVjdC5JbnRlcmZhY2VUeXBlKTogdm9pZCB7XG4gICAgICBpZiAodmlzaXRlZC5oYXModHlwZS5mcW4pKSB7IHJldHVybjsgfVxuICAgICAgdmlzaXRlZC5hZGQodHlwZS5mcW4pO1xuXG4gICAgICBpZiAodHlwZS5kYXRhdHlwZSkge1xuICAgICAgICBhc3NlcnREYXRhVHlwZSh0eXBlKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBtZXRob2Qgb2YgdHlwZS5hbGxNZXRob2RzKSB7XG4gICAgICAgIGFzc2VydE1ldGhvZChtZXRob2QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzc2VydFByb3BlcnR5KHByb3BlcnR5OiByZWZsZWN0LlByb3BlcnR5KSB7XG5cbiAgICAgIGlmIChwcm9wZXJ0eS5wcm90ZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzaXRlID0gcHJvcGVydHkub3ZlcnJpZGVzID8gcHJvcGVydHkub3ZlcnJpZGVzIDogcHJvcGVydHkucGFyZW50VHlwZTtcbiAgICAgIGFzc2VydFR5cGUocHJvcGVydHkudHlwZSwgcHJvcGVydHkuZG9jcywgYCR7c2l0ZS5mcW59LiR7cHJvcGVydHkubmFtZX1gKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc3NlcnRNZXRob2QobWV0aG9kOiByZWZsZWN0LkNhbGxhYmxlKSB7XG5cbiAgICAgIGlmIChtZXRob2QucHJvdGVjdGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2l0ZSA9IG1ldGhvZC5vdmVycmlkZXMgPyBtZXRob2Qub3ZlcnJpZGVzIDogbWV0aG9kLnBhcmVudFR5cGU7XG4gICAgICBjb25zdCBzY29wZSA9IGAke3NpdGUuZnFufS4ke21ldGhvZC5uYW1lfWA7XG5cbiAgICAgIGxldCBmaXJzdE1ldGhvZDogcmVmbGVjdC5DYWxsYWJsZSB8IHVuZGVmaW5lZCA9IHNpdGUuaXNDbGFzc1R5cGUoKSB8fCBzaXRlLmlzSW50ZXJmYWNlVHlwZSgpXG4gICAgICAgID8gc2l0ZS5hbGxNZXRob2RzLmZpbmQobSA9PiBtLm5hbWUgPT09IG1ldGhvZC5uYW1lKVxuICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKCFmaXJzdE1ldGhvZCkge1xuICAgICAgICBmaXJzdE1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBmaXJzdE1ldGhvZC5wYXJhbWV0ZXJzKSB7XG4gICAgICAgIGFzc2VydFR5cGUocGFyYW0udHlwZSwgcGFyYW0uZG9jcywgYCR7c2NvcGV9LiR7cGFyYW0ubmFtZX1gKTtcbiAgICAgIH1cblxuICAgICAgLy8gbm90ZSB0aGF0IHdlIGRvIG5vdCByZXF1aXJlIHRoYXQgcmV0dXJuIHZhbHVlcyB3aWxsIHVzZSBhbiBpbnRlcmZhY2VcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhc3NlcnRUeXBlKHR5cGU6IHJlZmxlY3QuVHlwZVJlZmVyZW5jZSwgZG9jczogcmVmbGVjdC5Eb2NzLCBzY29wZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICBpZiAodHlwZS5wcmltaXRpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS52b2lkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUuYXJyYXlPZlR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGFzc2VydFR5cGUodHlwZS5hcnJheU9mVHlwZSwgZG9jcywgc2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS5tYXBPZlR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGFzc2VydFR5cGUodHlwZS5tYXBPZlR5cGUsIGRvY3MsIHNjb3BlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUudW5pb25PZlR5cGVzKSB7XG4gICAgICAgIGZvciAoY29uc3QgdCBvZiB0eXBlLnVuaW9uT2ZUeXBlcykge1xuICAgICAgICAgIGFzc2VydFR5cGUodCwgZG9jcywgc2NvcGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaW50ZXJmYWNlcyBhcmUgb2theVxuICAgICAgaWYgKHR5cGUudHlwZSAmJiB0eXBlLnR5cGUuaXNJbnRlcmZhY2VUeXBlKCkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2VydEludGVyZmFjZSh0eXBlLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBlbnVtcyBhcmUgb2theVxuICAgICAgaWYgKHR5cGUudHlwZSAmJiB0eXBlLnR5cGUuaXNFbnVtVHlwZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gY2xhc3NlcyBhcmUgb2theSBhcyBsb25nIGFzIHRoZXkgYXJlIG5vdCByZXNvdXJjZSBjb25zdHJ1Y3RzXG4gICAgICBpZiAodHlwZS50eXBlICYmIHR5cGUudHlwZS5pc0NsYXNzVHlwZSgpKSB7XG4gICAgICAgIGlmICghQ29yZVR5cGVzLmlzUmVzb3VyY2VDbGFzcyh0eXBlLnR5cGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUudHlwZS5mcW4gPT09IGUuY3R4LmNvcmUuY29uc3RydWN0Q2xhc3MuZnFuKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWxsb3cgZXhjbHVzaW9uIG9mIHRoaXMgcnVsZVxuICAgICAgICBpZiAoZG9jcy5zdW1tYXJ5LmluY2x1ZGVzKEVYQ0xVREVfQU5OT1RBVElPTl9SRUZfVklBX0lOVEVSRkFDRSkgfHwgZG9jcy5yZW1hcmtzLmluY2x1ZGVzKEVYQ0xVREVfQU5OT1RBVElPTl9SRUZfVklBX0lOVEVSRkFDRSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLmFzc2VydChmYWxzZSwgc2NvcGUsIHR5cGUudHlwZS5mcW4pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCB0eXBlIHJlZmVyZW5jZTogJHt0eXBlLnRvU3RyaW5nKCl9YCk7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==