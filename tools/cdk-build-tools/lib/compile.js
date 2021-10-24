"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileCurrentPackage = void 0;
const os_1 = require("./os");
const package_info_1 = require("./package-info");
/**
 * Run the compiler on the current package
 */
async function compileCurrentPackage(options, timers, compilers = {}) {
    const env = options.env;
    await os_1.shell(package_info_1.packageCompiler(compilers), { timers, env });
    // Find files in bin/ that look like they should be executable, and make them so.
    const scripts = package_info_1.currentPackageJson().bin || {};
    for (const script of Object.values(scripts)) {
        await os_1.makeExecutable(script);
    }
}
exports.compileCurrentPackage = compileCurrentPackage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbXBpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZDO0FBQzdDLGlEQUF5RztBQUd6Rzs7R0FFRztBQUNJLEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxPQUF3QixFQUFFLE1BQWMsRUFBRSxZQUErQixFQUFFO0lBQ3JILE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDeEIsTUFBTSxVQUFLLENBQUMsOEJBQWUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRXpELGlGQUFpRjtJQUNqRixNQUFNLE9BQU8sR0FBRyxpQ0FBa0IsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUM7SUFDL0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBUSxFQUFFO1FBQ2xELE1BQU0sbUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5QjtBQUNILENBQUM7QUFURCxzREFTQyJ9