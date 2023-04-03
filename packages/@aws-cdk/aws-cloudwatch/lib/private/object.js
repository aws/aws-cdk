"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropUndefined = void 0;
function dropUndefined(x) {
    if (x === null) {
        return x;
    }
    const ret = {};
    for (const [key, value] of Object.entries(x)) {
        if (value !== undefined) {
            ret[key] = value;
        }
    }
    return ret;
}
exports.dropUndefined = dropUndefined;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLGFBQWEsQ0FBbUIsQ0FBSTtJQUNsRCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQztLQUFFO0lBQzdCLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM1QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNsQjtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBVEQsc0NBU0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZHJvcFVuZGVmaW5lZDxUIGV4dGVuZHMgb2JqZWN0Pih4OiBUKTogVCB7XG4gIGlmICh4ID09PSBudWxsKSB7IHJldHVybiB4OyB9XG4gIGNvbnN0IHJldDogYW55ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHgpKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=