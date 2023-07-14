"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rimraf = void 0;
const fs = require("fs");
const path = require("path");
/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 */
function rimraf(fsPath) {
    try {
        const isDir = fs.lstatSync(fsPath).isDirectory();
        if (isDir) {
            for (const file of fs.readdirSync(fsPath)) {
                rimraf(path.join(fsPath, file));
            }
            fs.rmdirSync(fsPath);
        }
        else {
            fs.unlinkSync(fsPath);
        }
    }
    catch (e) {
        // We will survive ENOENT
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
}
exports.rimraf = rimraf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qjs7R0FFRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxNQUFjO0lBQ25DLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRWpELElBQUksS0FBSyxFQUFFO1lBQ1QsS0FBSyxNQUFNLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7S0FDRjtJQUFDLE9BQU8sQ0FBTSxFQUFFO1FBQ2YseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFBRSxNQUFNLENBQUMsQ0FBQztTQUFFO0tBQ3RDO0FBQ0gsQ0FBQztBQWhCRCx3QkFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIHJtIC1yZiByZWltcGxlbWVudGF0aW9uLCBkb24ndCB3YW50IHRvIGRlcGVuZCBvbiBhbiBOUE0gcGFja2FnZSBmb3IgdGhpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmltcmFmKGZzUGF0aDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNEaXIgPSBmcy5sc3RhdFN5bmMoZnNQYXRoKS5pc0RpcmVjdG9yeSgpO1xuXG4gICAgaWYgKGlzRGlyKSB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZnMucmVhZGRpclN5bmMoZnNQYXRoKSkge1xuICAgICAgICByaW1yYWYocGF0aC5qb2luKGZzUGF0aCwgZmlsZSkpO1xuICAgICAgfVxuICAgICAgZnMucm1kaXJTeW5jKGZzUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnVubGlua1N5bmMoZnNQYXRoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIC8vIFdlIHdpbGwgc3Vydml2ZSBFTk9FTlRcbiAgICBpZiAoZS5jb2RlICE9PSAnRU5PRU5UJykgeyB0aHJvdyBlOyB9XG4gIH1cbn1cbiJdfQ==