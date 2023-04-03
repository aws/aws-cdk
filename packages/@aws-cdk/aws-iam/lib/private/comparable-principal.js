"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitionPrincipals = void 0;
const principals_1 = require("../principals");
function partitionPrincipals(xs) {
    const nonComparable = [];
    const comparable = {};
    for (const x of xs) {
        const dedupe = principals_1.ComparablePrincipal.dedupeStringFor(x);
        if (dedupe) {
            comparable[dedupe] = x;
        }
        else {
            nonComparable.push(x);
        }
    }
    return { comparable, nonComparable };
}
exports.partitionPrincipals = partitionPrincipals;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFyYWJsZS1wcmluY2lwYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wYXJhYmxlLXByaW5jaXBhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBZ0U7QUFFaEUsU0FBZ0IsbUJBQW1CLENBQUMsRUFBZ0I7SUFDbEQsTUFBTSxhQUFhLEdBQWlCLEVBQUUsQ0FBQztJQUN2QyxNQUFNLFVBQVUsR0FBK0IsRUFBRSxDQUFDO0lBRWxELEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2xCLE1BQU0sTUFBTSxHQUFHLGdDQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLE1BQU0sRUFBRTtZQUNWLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7YUFBTTtZQUNMLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7S0FDRjtJQUVELE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUM7QUFDdkMsQ0FBQztBQWRELGtEQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVByaW5jaXBhbCwgQ29tcGFyYWJsZVByaW5jaXBhbCB9IGZyb20gJy4uL3ByaW5jaXBhbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uUHJpbmNpcGFscyh4czogSVByaW5jaXBhbFtdKTogUGFydGl0aW9uUmVzdWx0IHtcbiAgY29uc3Qgbm9uQ29tcGFyYWJsZTogSVByaW5jaXBhbFtdID0gW107XG4gIGNvbnN0IGNvbXBhcmFibGU6IFJlY29yZDxzdHJpbmcsIElQcmluY2lwYWw+ID0ge307XG5cbiAgZm9yIChjb25zdCB4IG9mIHhzKSB7XG4gICAgY29uc3QgZGVkdXBlID0gQ29tcGFyYWJsZVByaW5jaXBhbC5kZWR1cGVTdHJpbmdGb3IoeCk7XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgY29tcGFyYWJsZVtkZWR1cGVdID0geDtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9uQ29tcGFyYWJsZS5wdXNoKHgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGNvbXBhcmFibGUsIG5vbkNvbXBhcmFibGUgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXJ0aXRpb25SZXN1bHQge1xuICByZWFkb25seSBub25Db21wYXJhYmxlOiBJUHJpbmNpcGFsW107XG4gIHJlYWRvbmx5IGNvbXBhcmFibGU6IFJlY29yZDxzdHJpbmcsIElQcmluY2lwYWw+O1xufVxuIl19