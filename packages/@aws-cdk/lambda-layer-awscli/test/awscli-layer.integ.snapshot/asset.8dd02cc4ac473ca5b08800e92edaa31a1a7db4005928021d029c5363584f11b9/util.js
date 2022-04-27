"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.getEnv = void 0;
function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`The environment variable "${name}" is not defined`);
    }
    return value;
}
exports.getEnv = getEnv;
function log(title, ...args) {
    console.log('[provider-framework]', title, ...args.map(x => typeof (x) === 'object' ? JSON.stringify(x, undefined, 2) : x));
}
exports.log = log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjs7O0FBRS9CLFNBQWdCLE1BQU0sQ0FBQyxJQUFZO0lBQ2pDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLElBQUksa0JBQWtCLENBQUMsQ0FBQztLQUN0RTtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQU5ELHdCQU1DO0FBRUQsU0FBZ0IsR0FBRyxDQUFDLEtBQVUsRUFBRSxHQUFHLElBQVc7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdILENBQUM7QUFGRCxrQkFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB2YWx1ZSA9IHByb2Nlc3MuZW52W25hbWVdO1xuICBpZiAoIXZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZW52aXJvbm1lbnQgdmFyaWFibGUgXCIke25hbWV9XCIgaXMgbm90IGRlZmluZWRgKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2codGl0bGU6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgY29uc29sZS5sb2coJ1twcm92aWRlci1mcmFtZXdvcmtdJywgdGl0bGUsIC4uLmFyZ3MubWFwKHggPT4gdHlwZW9mKHgpID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KHgsIHVuZGVmaW5lZCwgMikgOiB4KSk7XG59XG4iXX0=