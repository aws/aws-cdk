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
            if (utils_1.shouldFollow(follow, rootDir, targetPath)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBMEM7QUFDMUMsdUNBQTJEO0FBQzNELG1DQUF1QztBQUV2QyxTQUFnQixhQUFhLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxVQUF1QixFQUFHLEVBQUUsT0FBZ0I7SUFDekcsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSwyQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFFNUQsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLENBQUM7SUFFNUIsTUFBTSxjQUFjLEdBQUcsdUJBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXhFLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLHFCQUFxQixDQUFDLENBQUM7S0FDakQ7SUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3hCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9DLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMxQyxTQUFTO1NBQ1Y7UUFFRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksR0FBeUIsTUFBTSxLQUFLLDJCQUFpQixDQUFDLE1BQU07WUFDbEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWpDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNqQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRS9DLHlFQUF5RTtZQUN6RSxxQ0FBcUM7WUFDckMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBRWhFLElBQUksb0JBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFFO2dCQUM3QyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNwQztpQkFBTTtnQkFDTCxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDckMsSUFBSSxHQUFHLFNBQVMsQ0FBQzthQUNsQjtTQUNGO1FBRUQsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0IsYUFBYSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlELElBQUksR0FBRyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDekIsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDOUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztTQUNsQjtLQUNGO0FBQ0gsQ0FBQztBQW5ERCxzQ0FtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSWdub3JlU3RyYXRlZ3kgfSBmcm9tICcuL2lnbm9yZSc7XG5pbXBvcnQgeyBDb3B5T3B0aW9ucywgU3ltbGlua0ZvbGxvd01vZGUgfSBmcm9tICcuL29wdGlvbnMnO1xuaW1wb3J0IHsgc2hvdWxkRm9sbG93IH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5RGlyZWN0b3J5KHNyY0Rpcjogc3RyaW5nLCBkZXN0RGlyOiBzdHJpbmcsIG9wdGlvbnM6IENvcHlPcHRpb25zID0geyB9LCByb290RGlyPzogc3RyaW5nKSB7XG4gIGNvbnN0IGZvbGxvdyA9IG9wdGlvbnMuZm9sbG93ID8/IFN5bWxpbmtGb2xsb3dNb2RlLkVYVEVSTkFMO1xuXG4gIHJvb3REaXIgPSByb290RGlyIHx8IHNyY0RpcjtcblxuICBjb25zdCBpZ25vcmVTdHJhdGVneSA9IElnbm9yZVN0cmF0ZWd5LmZyb21Db3B5T3B0aW9ucyhvcHRpb25zLCByb290RGlyKTtcblxuICBpZiAoIWZzLnN0YXRTeW5jKHNyY0RpcikuaXNEaXJlY3RvcnkoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtzcmNEaXJ9IGlzIG5vdCBhIGRpcmVjdG9yeWApO1xuICB9XG5cbiAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhzcmNEaXIpO1xuICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlUGF0aCA9IHBhdGguam9pbihzcmNEaXIsIGZpbGUpO1xuXG4gICAgaWYgKGlnbm9yZVN0cmF0ZWd5Lmlnbm9yZXMoc291cmNlRmlsZVBhdGgpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXN0RmlsZVBhdGggPSBwYXRoLmpvaW4oZGVzdERpciwgZmlsZSk7XG5cbiAgICBsZXQgc3RhdDogZnMuU3RhdHMgfCB1bmRlZmluZWQgPSBmb2xsb3cgPT09IFN5bWxpbmtGb2xsb3dNb2RlLkFMV0FZU1xuICAgICAgPyBmcy5zdGF0U3luYyhzb3VyY2VGaWxlUGF0aClcbiAgICAgIDogZnMubHN0YXRTeW5jKHNvdXJjZUZpbGVQYXRoKTtcblxuICAgIGlmIChzdGF0ICYmIHN0YXQuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZnMucmVhZGxpbmtTeW5jKHNvdXJjZUZpbGVQYXRoKTtcblxuICAgICAgLy8gZGV0ZXJtaW5lIGlmIHRoaXMgaXMgYW4gZXh0ZXJuYWwgbGluayAoaS5lLiB0aGUgdGFyZ2V0J3MgYWJzb2x1dGUgcGF0aFxuICAgICAgLy8gaXMgb3V0c2lkZSBvZiB0aGUgcm9vdCBkaXJlY3RvcnkpLlxuICAgICAgY29uc3QgdGFyZ2V0UGF0aCA9IHBhdGgubm9ybWFsaXplKHBhdGgucmVzb2x2ZShzcmNEaXIsIHRhcmdldCkpO1xuXG4gICAgICBpZiAoc2hvdWxkRm9sbG93KGZvbGxvdywgcm9vdERpciwgdGFyZ2V0UGF0aCkpIHtcbiAgICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKHNvdXJjZUZpbGVQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnN5bWxpbmtTeW5jKHRhcmdldCwgZGVzdEZpbGVQYXRoKTtcbiAgICAgICAgc3RhdCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGZzLm1rZGlyU3luYyhkZXN0RmlsZVBhdGgpO1xuICAgICAgY29weURpcmVjdG9yeShzb3VyY2VGaWxlUGF0aCwgZGVzdEZpbGVQYXRoLCBvcHRpb25zLCByb290RGlyKTtcbiAgICAgIHN0YXQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHN0YXQgJiYgc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgZnMuY29weUZpbGVTeW5jKHNvdXJjZUZpbGVQYXRoLCBkZXN0RmlsZVBhdGgpO1xuICAgICAgc3RhdCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==