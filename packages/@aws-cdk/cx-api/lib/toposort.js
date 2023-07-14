"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topologicalSort = void 0;
/**
 * Return a topological sort of all elements of xs, according to the given dependency functions
 *
 * Dependencies outside the referenced set are ignored.
 *
 * Not a stable sort, but in order to keep the order as stable as possible, we'll sort by key
 * among elements of equal precedence.
 */
function topologicalSort(xs, keyFn, depFn) {
    const remaining = new Map();
    for (const element of xs) {
        const key = keyFn(element);
        remaining.set(key, { key, element, dependencies: depFn(element) });
    }
    const ret = new Array();
    while (remaining.size > 0) {
        // All elements with no more deps in the set can be ordered
        const selectable = Array.from(remaining.values()).filter(e => e.dependencies.every(d => !remaining.has(d)));
        selectable.sort((a, b) => a.key < b.key ? -1 : b.key < a.key ? 1 : 0);
        for (const selected of selectable) {
            ret.push(selected.element);
            remaining.delete(selected.key);
        }
        // If we didn't make any progress, we got stuck
        if (selectable.length === 0) {
            throw new Error(`Could not determine ordering between: ${Array.from(remaining.keys()).join(', ')}`);
        }
    }
    return ret;
}
exports.topologicalSort = topologicalSort;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wb3NvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0b3Bvc29ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQTs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsZUFBZSxDQUFJLEVBQWUsRUFBRSxLQUFpQixFQUFFLEtBQWlCO0lBQ3RGLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO0lBQ3BELEtBQUssTUFBTSxPQUFPLElBQUksRUFBRSxFQUFFO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQixTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEU7SUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBSyxDQUFDO0lBQzNCLE9BQU8sU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7UUFDekIsMkRBQTJEO1FBQzNELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEUsS0FBSyxNQUFNLFFBQVEsSUFBSSxVQUFVLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEM7UUFFRCwrQ0FBK0M7UUFDL0MsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDckc7S0FDRjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQTFCRCwwQ0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBLZXlGdW5jPFQ+ID0gKHg6IFQpID0+IHN0cmluZztcbmV4cG9ydCB0eXBlIERlcEZ1bmM8VD4gPSAoeDogVCkgPT4gc3RyaW5nW107XG5cbi8qKlxuICogUmV0dXJuIGEgdG9wb2xvZ2ljYWwgc29ydCBvZiBhbGwgZWxlbWVudHMgb2YgeHMsIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gZGVwZW5kZW5jeSBmdW5jdGlvbnNcbiAqXG4gKiBEZXBlbmRlbmNpZXMgb3V0c2lkZSB0aGUgcmVmZXJlbmNlZCBzZXQgYXJlIGlnbm9yZWQuXG4gKlxuICogTm90IGEgc3RhYmxlIHNvcnQsIGJ1dCBpbiBvcmRlciB0byBrZWVwIHRoZSBvcmRlciBhcyBzdGFibGUgYXMgcG9zc2libGUsIHdlJ2xsIHNvcnQgYnkga2V5XG4gKiBhbW9uZyBlbGVtZW50cyBvZiBlcXVhbCBwcmVjZWRlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9wb2xvZ2ljYWxTb3J0PFQ+KHhzOiBJdGVyYWJsZTxUPiwga2V5Rm46IEtleUZ1bmM8VD4sIGRlcEZuOiBEZXBGdW5jPFQ+KTogVFtdIHtcbiAgY29uc3QgcmVtYWluaW5nID0gbmV3IE1hcDxzdHJpbmcsIFRvcG9FbGVtZW50PFQ+PigpO1xuICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgeHMpIHtcbiAgICBjb25zdCBrZXkgPSBrZXlGbihlbGVtZW50KTtcbiAgICByZW1haW5pbmcuc2V0KGtleSwgeyBrZXksIGVsZW1lbnQsIGRlcGVuZGVuY2llczogZGVwRm4oZWxlbWVudCkgfSk7XG4gIH1cblxuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8VD4oKTtcbiAgd2hpbGUgKHJlbWFpbmluZy5zaXplID4gMCkge1xuICAgIC8vIEFsbCBlbGVtZW50cyB3aXRoIG5vIG1vcmUgZGVwcyBpbiB0aGUgc2V0IGNhbiBiZSBvcmRlcmVkXG4gICAgY29uc3Qgc2VsZWN0YWJsZSA9IEFycmF5LmZyb20ocmVtYWluaW5nLnZhbHVlcygpKS5maWx0ZXIoZSA9PiBlLmRlcGVuZGVuY2llcy5ldmVyeShkID0+ICFyZW1haW5pbmcuaGFzKGQpKSk7XG5cbiAgICBzZWxlY3RhYmxlLnNvcnQoKGEsIGIpID0+IGEua2V5IDwgYi5rZXkgPyAtMSA6IGIua2V5IDwgYS5rZXkgPyAxIDogMCk7XG5cbiAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIHNlbGVjdGFibGUpIHtcbiAgICAgIHJldC5wdXNoKHNlbGVjdGVkLmVsZW1lbnQpO1xuICAgICAgcmVtYWluaW5nLmRlbGV0ZShzZWxlY3RlZC5rZXkpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBtYWtlIGFueSBwcm9ncmVzcywgd2UgZ290IHN0dWNrXG4gICAgaWYgKHNlbGVjdGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBkZXRlcm1pbmUgb3JkZXJpbmcgYmV0d2VlbjogJHtBcnJheS5mcm9tKHJlbWFpbmluZy5rZXlzKCkpLmpvaW4oJywgJyl9YCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuaW50ZXJmYWNlIFRvcG9FbGVtZW50PFQ+IHtcbiAga2V5OiBzdHJpbmc7XG4gIGRlcGVuZGVuY2llczogc3RyaW5nW107XG4gIGVsZW1lbnQ6IFQ7XG59Il19