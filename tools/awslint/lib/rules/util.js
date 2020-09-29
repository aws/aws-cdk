"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect = require("jsii-reflect");
/**
 * Returns a documentation tag. Looks it up in inheritance hierarchy.
 * @param documentable starting point
 * @param tag the tag to search for
 */
function getDocTag(documentable, tag) {
    const t = documentable.docs.customTag(tag);
    if (t) {
        return t;
    }
    if ((documentable instanceof reflect.Property || documentable instanceof reflect.Method) && documentable.overrides) {
        if (documentable.overrides.isClassType() || documentable.overrides.isInterfaceType()) {
            const baseMembers = documentable.overrides.allMembers.filter(m => m.name === documentable.name);
            for (const base of baseMembers) {
                const baseTag = getDocTag(base, tag);
                if (baseTag) {
                    return baseTag;
                }
            }
        }
    }
    if (documentable instanceof reflect.ClassType || documentable instanceof reflect.InterfaceType) {
        for (const base of documentable.interfaces) {
            const baseTag = getDocTag(base, tag);
            if (baseTag) {
                return baseTag;
            }
        }
    }
    if (documentable instanceof reflect.ClassType && documentable.base) {
        const baseTag = getDocTag(documentable.base, tag);
        if (baseTag) {
            return baseTag;
        }
    }
    return undefined;
}
exports.getDocTag = getDocTag;
function memberFqn(m) {
    return `${m.parentType.fqn}.${m.name}`;
}
exports.memberFqn = memberFqn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFFeEM7Ozs7R0FJRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxZQUFrQyxFQUFFLEdBQVc7SUFDdkUsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsSUFBSSxDQUFDLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQztLQUFFO0lBRXBCLElBQUksQ0FBQyxZQUFZLFlBQVksT0FBTyxDQUFDLFFBQVEsSUFBSSxZQUFZLFlBQVksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7UUFDbEgsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLEVBQUU7WUFDcEYsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEcsS0FBSyxNQUFNLElBQUksSUFBSSxXQUFXLEVBQUU7Z0JBQzlCLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksT0FBTyxFQUFFO29CQUNYLE9BQU8sT0FBTyxDQUFDO2lCQUNoQjthQUNGO1NBQ0Y7S0FDRjtJQUVELElBQUksWUFBWSxZQUFZLE9BQU8sQ0FBQyxTQUFTLElBQUksWUFBWSxZQUFZLE9BQU8sQ0FBQyxhQUFhLEVBQUU7UUFDOUYsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQzFDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckMsSUFBSSxPQUFPLEVBQUU7Z0JBQ1YsT0FBTyxPQUFPLENBQUM7YUFDakI7U0FDRjtLQUNGO0lBRUQsSUFBSSxZQUFZLFlBQVksT0FBTyxDQUFDLFNBQVMsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFO1FBQ2xFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxPQUFPLENBQUM7U0FDaEI7S0FDRjtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFqQ0QsOEJBaUNDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQW9DO0lBQzVELE9BQU8sR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDekMsQ0FBQztBQUZELDhCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcmVmbGVjdCBmcm9tICdqc2lpLXJlZmxlY3QnO1xuXG4vKipcbiAqIFJldHVybnMgYSBkb2N1bWVudGF0aW9uIHRhZy4gTG9va3MgaXQgdXAgaW4gaW5oZXJpdGFuY2UgaGllcmFyY2h5LlxuICogQHBhcmFtIGRvY3VtZW50YWJsZSBzdGFydGluZyBwb2ludFxuICogQHBhcmFtIHRhZyB0aGUgdGFnIHRvIHNlYXJjaCBmb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERvY1RhZyhkb2N1bWVudGFibGU6IHJlZmxlY3QuRG9jdW1lbnRhYmxlLCB0YWc6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHQgPSBkb2N1bWVudGFibGUuZG9jcy5jdXN0b21UYWcodGFnKTtcbiAgaWYgKHQpIHsgcmV0dXJuIHQ7IH1cblxuICBpZiAoKGRvY3VtZW50YWJsZSBpbnN0YW5jZW9mIHJlZmxlY3QuUHJvcGVydHkgfHwgZG9jdW1lbnRhYmxlIGluc3RhbmNlb2YgcmVmbGVjdC5NZXRob2QpICYmIGRvY3VtZW50YWJsZS5vdmVycmlkZXMpIHtcbiAgICBpZiAoZG9jdW1lbnRhYmxlLm92ZXJyaWRlcy5pc0NsYXNzVHlwZSgpIHx8IGRvY3VtZW50YWJsZS5vdmVycmlkZXMuaXNJbnRlcmZhY2VUeXBlKCkpIHtcbiAgICAgIGNvbnN0IGJhc2VNZW1iZXJzID0gZG9jdW1lbnRhYmxlLm92ZXJyaWRlcy5hbGxNZW1iZXJzLmZpbHRlcihtID0+IG0ubmFtZSA9PT0gZG9jdW1lbnRhYmxlLm5hbWUpO1xuICAgICAgZm9yIChjb25zdCBiYXNlIG9mIGJhc2VNZW1iZXJzKSB7XG4gICAgICAgIGNvbnN0IGJhc2VUYWcgPSBnZXREb2NUYWcoYmFzZSwgdGFnKTtcbiAgICAgICAgaWYgKGJhc2VUYWcpIHtcbiAgICAgICAgICByZXR1cm4gYmFzZVRhZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChkb2N1bWVudGFibGUgaW5zdGFuY2VvZiByZWZsZWN0LkNsYXNzVHlwZSB8fCBkb2N1bWVudGFibGUgaW5zdGFuY2VvZiByZWZsZWN0LkludGVyZmFjZVR5cGUpIHtcbiAgICBmb3IgKGNvbnN0IGJhc2Ugb2YgZG9jdW1lbnRhYmxlLmludGVyZmFjZXMpIHtcbiAgICAgIGNvbnN0IGJhc2VUYWcgPSBnZXREb2NUYWcoYmFzZSwgdGFnKTtcbiAgICAgIGlmIChiYXNlVGFnKSB7XG4gICAgICAgICByZXR1cm4gYmFzZVRhZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZG9jdW1lbnRhYmxlIGluc3RhbmNlb2YgcmVmbGVjdC5DbGFzc1R5cGUgJiYgZG9jdW1lbnRhYmxlLmJhc2UpIHtcbiAgICBjb25zdCBiYXNlVGFnID0gZ2V0RG9jVGFnKGRvY3VtZW50YWJsZS5iYXNlLCB0YWcpO1xuICAgIGlmIChiYXNlVGFnKSB7XG4gICAgICByZXR1cm4gYmFzZVRhZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVtYmVyRnFuKG06IHJlZmxlY3QuTWV0aG9kIHwgcmVmbGVjdC5Qcm9wZXJ0eSkge1xuICByZXR1cm4gYCR7bS5wYXJlbnRUeXBlLmZxbn0uJHttLm5hbWV9YDtcbn1cbiJdfQ==