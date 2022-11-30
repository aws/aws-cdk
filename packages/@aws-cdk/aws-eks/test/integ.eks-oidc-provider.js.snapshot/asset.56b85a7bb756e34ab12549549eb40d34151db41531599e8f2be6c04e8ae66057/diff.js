"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayDiff = void 0;
function arrayDiff(oldValues, newValues) {
    const deletes = new Set(oldValues);
    const adds = new Set();
    for (const v of new Set(newValues)) {
        if (deletes.has(v)) {
            deletes.delete(v);
        }
        else {
            adds.add(v);
        }
    }
    return {
        adds: Array.from(adds),
        deletes: Array.from(deletes),
    };
}
exports.arrayDiff = arrayDiff;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsU0FBZ0IsU0FBUyxDQUFDLFNBQW1CLEVBQUUsU0FBbUI7SUFDaEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUUvQixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2xDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25CO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2I7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQzdCLENBQUM7QUFDSixDQUFDO0FBaEJELDhCQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBhcnJheURpZmYob2xkVmFsdWVzOiBzdHJpbmdbXSwgbmV3VmFsdWVzOiBzdHJpbmdbXSkge1xuICBjb25zdCBkZWxldGVzID0gbmV3IFNldChvbGRWYWx1ZXMpO1xuICBjb25zdCBhZGRzID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgZm9yIChjb25zdCB2IG9mIG5ldyBTZXQobmV3VmFsdWVzKSkge1xuICAgIGlmIChkZWxldGVzLmhhcyh2KSkge1xuICAgICAgZGVsZXRlcy5kZWxldGUodik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFkZHMuYWRkKHYpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYWRkczogQXJyYXkuZnJvbShhZGRzKSxcbiAgICBkZWxldGVzOiBBcnJheS5mcm9tKGRlbGV0ZXMpLFxuICB9O1xufVxuIl19