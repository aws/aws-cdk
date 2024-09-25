"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCriticalSection = void 0;
/**
 * Creates a critical section, ensuring that at most one function can
 * enter the critical section at a time.
 */
function createCriticalSection() {
    let lock = Promise.resolve();
    return async (criticalFunction) => {
        const res = lock.then(() => criticalFunction());
        lock = res.catch(e => e);
        return res;
    };
}
exports.createCriticalSection = createCriticalSection;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7OztHQUdHO0FBQ0gsU0FBZ0IscUJBQXFCO0lBQ25DLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixPQUFPLEtBQUssRUFBRSxnQkFBcUMsRUFBRSxFQUFFO1FBQ3JELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsc0RBT0M7QUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVzIGEgY3JpdGljYWwgc2VjdGlvbiwgZW5zdXJpbmcgdGhhdCBhdCBtb3N0IG9uZSBmdW5jdGlvbiBjYW5cbiAqIGVudGVyIHRoZSBjcml0aWNhbCBzZWN0aW9uIGF0IGEgdGltZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNyaXRpY2FsU2VjdGlvbigpIHtcbiAgbGV0IGxvY2sgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgcmV0dXJuIGFzeW5jIChjcml0aWNhbEZ1bmN0aW9uOiAoKSA9PiBQcm9taXNlPHZvaWQ+KSA9PiB7XG4gICAgY29uc3QgcmVzID0gbG9jay50aGVuKCgpID0+IGNyaXRpY2FsRnVuY3Rpb24oKSk7XG4gICAgbG9jayA9IHJlcy5jYXRjaChlID0+IGUpO1xuICAgIHJldHVybiByZXM7XG4gIH07XG59OyJdfQ==