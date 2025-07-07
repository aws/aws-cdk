"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
async function main() {
    // No arguments, just assume current directory
    await (0, lib_1.generateShrinkwrap)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFybi1jbGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInlhcm4tY2xpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBNEM7QUFFNUMsS0FBSyxVQUFVLElBQUk7SUFDakIsOENBQThDO0lBQzlDLE1BQU0sSUFBQSx3QkFBa0IsRUFBQztRQUN2QixlQUFlLEVBQUUsY0FBYztRQUMvQixVQUFVLEVBQUUscUJBQXFCO0tBQ2xDLENBQUMsQ0FBQztJQUVILHNDQUFzQztJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNmLHNDQUFzQztJQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuZXJhdGVTaHJpbmt3cmFwIH0gZnJvbSAnLi4vbGliJztcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgLy8gTm8gYXJndW1lbnRzLCBqdXN0IGFzc3VtZSBjdXJyZW50IGRpcmVjdG9yeVxuICBhd2FpdCBnZW5lcmF0ZVNocmlua3dyYXAoe1xuICAgIHBhY2thZ2VKc29uRmlsZTogJ3BhY2thZ2UuanNvbicsXG4gICAgb3V0cHV0RmlsZTogJ25wbS1zaHJpbmt3cmFwLmpzb24nLFxuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKCdHZW5lcmF0ZWQgbnBtLXNocmlua3dyYXAuanNvbicpO1xufVxuXG5tYWluKCkuY2F0Y2goZSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZXJyb3IoZSk7XG4gIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xufSk7Il19