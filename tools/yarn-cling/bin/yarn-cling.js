"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
async function main() {
    // No arguments, just assume current directory
    await lib_1.generateShrinkwrap({
        packageJsonFile: 'package.json',
        outputFile: 'npm-shrinkwrap.json',
    });
    // eslint-disable-next-line no-console
    console.error('Generated npm-shrinkwrap.json');
}
main().catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFybi1jbGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInlhcm4tY2xpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBNEM7QUFFNUMsS0FBSyxVQUFVLElBQUk7SUFDakIsOENBQThDO0lBQzlDLE1BQU0sd0JBQWtCLENBQUM7UUFDdkIsZUFBZSxFQUFFLGNBQWM7UUFDL0IsVUFBVSxFQUFFLHFCQUFxQjtLQUNsQyxDQUFDLENBQUM7SUFFSCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDZixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlU2hyaW5rd3JhcCB9IGZyb20gJy4uL2xpYic7XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIC8vIE5vIGFyZ3VtZW50cywganVzdCBhc3N1bWUgY3VycmVudCBkaXJlY3RvcnlcbiAgYXdhaXQgZ2VuZXJhdGVTaHJpbmt3cmFwKHtcbiAgICBwYWNrYWdlSnNvbkZpbGU6ICdwYWNrYWdlLmpzb24nLFxuICAgIG91dHB1dEZpbGU6ICducG0tc2hyaW5rd3JhcC5qc29uJyxcbiAgfSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5lcnJvcignR2VuZXJhdGVkIG5wbS1zaHJpbmt3cmFwLmpzb24nKTtcbn1cblxubWFpbigpLmNhdGNoKGUgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKGUpO1xuICBwcm9jZXNzLmV4aXRDb2RlID0gMTtcbn0pOyJdfQ==