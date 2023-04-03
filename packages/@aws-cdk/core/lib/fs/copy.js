"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyDirectory = void 0;
const fs = require("fs");
const path = require("path");
const ignore_1 = require("./ignore");
const options_1 = require("./options");
const utils_1 = require("./utils");
function copyDirectory(srcDir, destDir, options = {}, rootDir) {
    const follow = options.follow ?? options_1.SymlinkFollowMode.EXTERNAL;
    rootDir = rootDir || srcDir;
    const ignoreStrategy = ignore_1.IgnoreStrategy.fromCopyOptions(options, rootDir);
    if (!fs.statSync(srcDir).isDirectory()) {
        throw new Error(`${srcDir} is not a directory`);
    }
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
        const sourceFilePath = path.join(srcDir, file);
        if (ignoreStrategy.ignores(sourceFilePath)) {
            continue;
        }
        const destFilePath = path.join(destDir, file);
        let stat = follow === options_1.SymlinkFollowMode.ALWAYS
            ? fs.statSync(sourceFilePath)
            : fs.lstatSync(sourceFilePath);
        if (stat && stat.isSymbolicLink()) {
            const target = fs.readlinkSync(sourceFilePath);
            // determine if this is an external link (i.e. the target's absolute path
            // is outside of the root directory).
            const targetPath = path.normalize(path.resolve(srcDir, target));
            if ((0, utils_1.shouldFollow)(follow, rootDir, targetPath)) {
                stat = fs.statSync(sourceFilePath);
            }
            else {
                fs.symlinkSync(target, destFilePath);
                stat = undefined;
            }
        }
        if (stat && stat.isDirectory()) {
            fs.mkdirSync(destFilePath);
            copyDirectory(sourceFilePath, destFilePath, options, rootDir);
            stat = undefined;
        }
        if (stat && stat.isFile()) {
            fs.copyFileSync(sourceFilePath, destFilePath);
            stat = undefined;
        }
    }
}
exports.copyDirectory = copyDirectory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBMEM7QUFDMUMsdUNBQTJEO0FBQzNELG1DQUF1QztBQUV2QyxTQUFnQixhQUFhLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxVQUF1QixFQUFHLEVBQUUsT0FBZ0I7SUFDekcsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSwyQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFFNUQsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLENBQUM7SUFFNUIsTUFBTSxjQUFjLEdBQUcsdUJBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXhFLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLHFCQUFxQixDQUFDLENBQUM7S0FDakQ7SUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9DLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMxQyxTQUFTO1NBQ1Y7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksR0FBeUIsTUFBTSxLQUFLLDJCQUFpQixDQUFDLE1BQU07WUFDbEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWpDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNqQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRS9DLHlFQUF5RTtZQUN6RSxxQ0FBcUM7WUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRWhFLElBQUksSUFBQSxvQkFBWSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLEVBQUU7Z0JBQzdDLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3BDO2lCQUFNO2dCQUNMLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7UUFFRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDOUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzQixhQUFhLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDOUQsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUNsQjtRQUVELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN6QixFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM5QyxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQ2xCO0tBQ0Y7QUFDSCxDQUFDO0FBbkRELHNDQW1EQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBJZ25vcmVTdHJhdGVneSB9IGZyb20gJy4vaWdub3JlJztcbmltcG9ydCB7IENvcHlPcHRpb25zLCBTeW1saW5rRm9sbG93TW9kZSB9IGZyb20gJy4vb3B0aW9ucyc7XG5pbXBvcnQgeyBzaG91bGRGb2xsb3cgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlEaXJlY3Rvcnkoc3JjRGlyOiBzdHJpbmcsIGRlc3REaXI6IHN0cmluZywgb3B0aW9uczogQ29weU9wdGlvbnMgPSB7IH0sIHJvb3REaXI/OiBzdHJpbmcpIHtcbiAgY29uc3QgZm9sbG93ID0gb3B0aW9ucy5mb2xsb3cgPz8gU3ltbGlua0ZvbGxvd01vZGUuRVhURVJOQUw7XG5cbiAgcm9vdERpciA9IHJvb3REaXIgfHwgc3JjRGlyO1xuXG4gIGNvbnN0IGlnbm9yZVN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZnJvbUNvcHlPcHRpb25zKG9wdGlvbnMsIHJvb3REaXIpO1xuXG4gIGlmICghZnMuc3RhdFN5bmMoc3JjRGlyKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke3NyY0Rpcn0gaXMgbm90IGEgZGlyZWN0b3J5YCk7XG4gIH1cblxuICBjb25zdCBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHNyY0Rpcik7XG4gIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgIGNvbnN0IHNvdXJjZUZpbGVQYXRoID0gcGF0aC5qb2luKHNyY0RpciwgZmlsZSk7XG5cbiAgICBpZiAoaWdub3JlU3RyYXRlZ3kuaWdub3Jlcyhzb3VyY2VGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGRlc3RGaWxlUGF0aCA9IHBhdGguam9pbihkZXN0RGlyLCBmaWxlKTtcblxuICAgIGxldCBzdGF0OiBmcy5TdGF0cyB8IHVuZGVmaW5lZCA9IGZvbGxvdyA9PT0gU3ltbGlua0ZvbGxvd01vZGUuQUxXQVlTXG4gICAgICA/IGZzLnN0YXRTeW5jKHNvdXJjZUZpbGVQYXRoKVxuICAgICAgOiBmcy5sc3RhdFN5bmMoc291cmNlRmlsZVBhdGgpO1xuXG4gICAgaWYgKHN0YXQgJiYgc3RhdC5pc1N5bWJvbGljTGluaygpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBmcy5yZWFkbGlua1N5bmMoc291cmNlRmlsZVBhdGgpO1xuXG4gICAgICAvLyBkZXRlcm1pbmUgaWYgdGhpcyBpcyBhbiBleHRlcm5hbCBsaW5rIChpLmUuIHRoZSB0YXJnZXQncyBhYnNvbHV0ZSBwYXRoXG4gICAgICAvLyBpcyBvdXRzaWRlIG9mIHRoZSByb290IGRpcmVjdG9yeSkuXG4gICAgICBjb25zdCB0YXJnZXRQYXRoID0gcGF0aC5ub3JtYWxpemUocGF0aC5yZXNvbHZlKHNyY0RpciwgdGFyZ2V0KSk7XG5cbiAgICAgIGlmIChzaG91bGRGb2xsb3coZm9sbG93LCByb290RGlyLCB0YXJnZXRQYXRoKSkge1xuICAgICAgICBzdGF0ID0gZnMuc3RhdFN5bmMoc291cmNlRmlsZVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuc3ltbGlua1N5bmModGFyZ2V0LCBkZXN0RmlsZVBhdGgpO1xuICAgICAgICBzdGF0ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGF0ICYmIHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgZnMubWtkaXJTeW5jKGRlc3RGaWxlUGF0aCk7XG4gICAgICBjb3B5RGlyZWN0b3J5KHNvdXJjZUZpbGVQYXRoLCBkZXN0RmlsZVBhdGgsIG9wdGlvbnMsIHJvb3REaXIpO1xuICAgICAgc3RhdCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRmlsZSgpKSB7XG4gICAgICBmcy5jb3B5RmlsZVN5bmMoc291cmNlRmlsZVBhdGgsIGRlc3RGaWxlUGF0aCk7XG4gICAgICBzdGF0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuIl19