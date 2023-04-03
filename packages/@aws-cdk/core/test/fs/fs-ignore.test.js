"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../lib/fs");
function strategyIgnores(strategy, files) {
    return files.filter(file => strategy.ignores(file));
}
function strategyPermits(strategy, files) {
    return files.filter(file => !strategy.ignores(file));
}
describe('GlobIgnoreStrategy', () => {
    test('excludes nothing by default', () => {
        const strategy = fs_1.IgnoreStrategy.glob('/tmp', []);
        const permits = [
            '/tmp/some/file/path',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('excludes requested files', () => {
        const strategy = fs_1.IgnoreStrategy.glob('/tmp', ['*.ignored']);
        const ignores = [
            '/tmp/some/file.ignored',
        ];
        const permits = [
            '/tmp/some/important/file',
        ];
        expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('does not exclude allow listed files', () => {
        const strategy = fs_1.IgnoreStrategy.glob('/tmp', ['*.ignored', '!important.*']);
        const permits = [
            '/tmp/some/important.ignored',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('does not exclude .dockerignore and Dockerfile at the root', () => {
        const strategy = fs_1.IgnoreStrategy.glob('/tmp', ['*.ignored', '!Dockerfile', '!.dockerignore']);
        const ignores = [
            '/tmp/foo.ignored',
            '/tmp/some/important.ignored',
        ];
        const permits = [
            '/tmp/Dockerfile',
            '/tmp/.dockerignore',
        ];
        expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
});
describe('GitIgnoreStrategy', () => {
    test('excludes nothing by default', () => {
        const strategy = fs_1.IgnoreStrategy.git('/tmp', []);
        const permits = [
            '/tmp/some/file/path',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('excludes requested files', () => {
        const strategy = fs_1.IgnoreStrategy.git('/tmp', ['*.ignored']);
        const ignores = [
            '/tmp/some/file.ignored',
        ];
        const permits = [
            '/tmp/some/important/file',
        ];
        expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('does not exclude allow listed files', () => {
        const strategy = fs_1.IgnoreStrategy.git('/tmp', ['*.ignored', '!important.*']);
        const permits = [
            '/tmp/some/important.ignored',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
});
describe('DockerIgnoreStrategy', () => {
    test('excludes nothing by default', () => {
        const strategy = fs_1.IgnoreStrategy.docker('/tmp', []);
        const permits = [
            '/tmp/some/file/path',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('excludes requested files', () => {
        // In .dockerignore, * only matches files in the current directory
        const strategy = fs_1.IgnoreStrategy.docker('/tmp', ['*.ignored']);
        const ignores = [
            '/tmp/file.ignored',
        ];
        const permits = [
            '/tmp/some/file.ignored',
            '/tmp/some/important/file',
        ];
        expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
    test('does not exclude allow listed files', () => {
        const strategy = fs_1.IgnoreStrategy.docker('/tmp', ['*.ignored', '!important.*']);
        const permits = [
            '/tmp/some/important.ignored',
        ];
        expect(strategyPermits(strategy, permits)).toEqual(permits);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtaWdub3JlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcy1pZ25vcmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUE4QztBQUU5QyxTQUFTLGVBQWUsQ0FBQyxRQUF3QixFQUFFLEtBQWU7SUFDaEUsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxRQUF3QixFQUFFLEtBQWU7SUFDaEUsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxNQUFNLFFBQVEsR0FBRyxtQkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakQsTUFBTSxPQUFPLEdBQUc7WUFDZCxxQkFBcUI7U0FDdEIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxNQUFNLFFBQVEsR0FBRyxtQkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sT0FBTyxHQUFHO1lBQ2Qsd0JBQXdCO1NBQ3pCLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRztZQUNkLDBCQUEwQjtTQUMzQixDQUFDO1FBRUYs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ZCw2QkFBNkI7U0FDOUIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJZ25vcmVTdHJhdGVneSB9IGZyb20gJy4uLy4uL2xpYi9mcyc7XG5cbmZ1bmN0aW9uIHN0cmF0ZWd5SWdub3JlcyhzdHJhdGVneTogSWdub3JlU3RyYXRlZ3ksIGZpbGVzOiBzdHJpbmdbXSkge1xuICByZXR1cm4gZmlsZXMuZmlsdGVyKGZpbGUgPT4gc3RyYXRlZ3kuaWdub3JlcyhmaWxlKSk7XG59XG5cbmZ1bmN0aW9uIHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneTogSWdub3JlU3RyYXRlZ3ksIGZpbGVzOiBzdHJpbmdbXSkge1xuICByZXR1cm4gZmlsZXMuZmlsdGVyKGZpbGUgPT4gIXN0cmF0ZWd5Lmlnbm9yZXMoZmlsZSkpO1xufVxuXG5kZXNjcmliZSgnR2xvYklnbm9yZVN0cmF0ZWd5JywgKCkgPT4ge1xuICB0ZXN0KCdleGNsdWRlcyBub3RoaW5nIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBJZ25vcmVTdHJhdGVneS5nbG9iKCcvdG1wJywgW10pO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ZpbGUvcGF0aCcsXG4gICAgXTtcblxuICAgIGV4cGVjdChzdHJhdGVneVBlcm1pdHMoc3RyYXRlZ3ksIHBlcm1pdHMpKS50b0VxdWFsKHBlcm1pdHMpO1xuICB9KTtcblxuICB0ZXN0KCdleGNsdWRlcyByZXF1ZXN0ZWQgZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBJZ25vcmVTdHJhdGVneS5nbG9iKCcvdG1wJywgWycqLmlnbm9yZWQnXSk7XG4gICAgY29uc3QgaWdub3JlcyA9IFtcbiAgICAgICcvdG1wL3NvbWUvZmlsZS5pZ25vcmVkJyxcbiAgICBdO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ltcG9ydGFudC9maWxlJyxcbiAgICBdO1xuXG4gICAgZXhwZWN0KHN0cmF0ZWd5SWdub3JlcyhzdHJhdGVneSwgaWdub3JlcykpLnRvRXF1YWwoaWdub3Jlcyk7XG4gICAgZXhwZWN0KHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneSwgcGVybWl0cykpLnRvRXF1YWwocGVybWl0cyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IGV4Y2x1ZGUgYWxsb3cgbGlzdGVkIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZ2xvYignL3RtcCcsIFsnKi5pZ25vcmVkJywgJyFpbXBvcnRhbnQuKiddKTtcbiAgICBjb25zdCBwZXJtaXRzID0gW1xuICAgICAgJy90bXAvc29tZS9pbXBvcnRhbnQuaWdub3JlZCcsXG4gICAgXTtcblxuICAgIGV4cGVjdChzdHJhdGVneVBlcm1pdHMoc3RyYXRlZ3ksIHBlcm1pdHMpKS50b0VxdWFsKHBlcm1pdHMpO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCBleGNsdWRlIC5kb2NrZXJpZ25vcmUgYW5kIERvY2tlcmZpbGUgYXQgdGhlIHJvb3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBJZ25vcmVTdHJhdGVneS5nbG9iKCcvdG1wJywgWycqLmlnbm9yZWQnLCAnIURvY2tlcmZpbGUnLCAnIS5kb2NrZXJpZ25vcmUnXSk7XG4gICAgY29uc3QgaWdub3JlcyA9IFtcbiAgICAgICcvdG1wL2Zvby5pZ25vcmVkJyxcbiAgICAgICcvdG1wL3NvbWUvaW1wb3J0YW50Lmlnbm9yZWQnLFxuICAgIF07XG4gICAgY29uc3QgcGVybWl0cyA9IFtcbiAgICAgICcvdG1wL0RvY2tlcmZpbGUnLFxuICAgICAgJy90bXAvLmRvY2tlcmlnbm9yZScsXG4gICAgXTtcblxuICAgIGV4cGVjdChzdHJhdGVneUlnbm9yZXMoc3RyYXRlZ3ksIGlnbm9yZXMpKS50b0VxdWFsKGlnbm9yZXMpO1xuICAgIGV4cGVjdChzdHJhdGVneVBlcm1pdHMoc3RyYXRlZ3ksIHBlcm1pdHMpKS50b0VxdWFsKHBlcm1pdHMpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnR2l0SWdub3JlU3RyYXRlZ3knLCAoKSA9PiB7XG4gIHRlc3QoJ2V4Y2x1ZGVzIG5vdGhpbmcgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICBjb25zdCBzdHJhdGVneSA9IElnbm9yZVN0cmF0ZWd5LmdpdCgnL3RtcCcsIFtdKTtcbiAgICBjb25zdCBwZXJtaXRzID0gW1xuICAgICAgJy90bXAvc29tZS9maWxlL3BhdGgnLFxuICAgIF07XG5cbiAgICBleHBlY3Qoc3RyYXRlZ3lQZXJtaXRzKHN0cmF0ZWd5LCBwZXJtaXRzKSkudG9FcXVhbChwZXJtaXRzKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhjbHVkZXMgcmVxdWVzdGVkIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZ2l0KCcvdG1wJywgWycqLmlnbm9yZWQnXSk7XG4gICAgY29uc3QgaWdub3JlcyA9IFtcbiAgICAgICcvdG1wL3NvbWUvZmlsZS5pZ25vcmVkJyxcbiAgICBdO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ltcG9ydGFudC9maWxlJyxcbiAgICBdO1xuXG4gICAgZXhwZWN0KHN0cmF0ZWd5SWdub3JlcyhzdHJhdGVneSwgaWdub3JlcykpLnRvRXF1YWwoaWdub3Jlcyk7XG4gICAgZXhwZWN0KHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneSwgcGVybWl0cykpLnRvRXF1YWwocGVybWl0cyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IGV4Y2x1ZGUgYWxsb3cgbGlzdGVkIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZ2l0KCcvdG1wJywgWycqLmlnbm9yZWQnLCAnIWltcG9ydGFudC4qJ10pO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ltcG9ydGFudC5pZ25vcmVkJyxcbiAgICBdO1xuXG4gICAgZXhwZWN0KHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneSwgcGVybWl0cykpLnRvRXF1YWwocGVybWl0cyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdEb2NrZXJJZ25vcmVTdHJhdGVneScsICgpID0+IHtcbiAgdGVzdCgnZXhjbHVkZXMgbm90aGluZyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZG9ja2VyKCcvdG1wJywgW10pO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ZpbGUvcGF0aCcsXG4gICAgXTtcblxuICAgIGV4cGVjdChzdHJhdGVneVBlcm1pdHMoc3RyYXRlZ3ksIHBlcm1pdHMpKS50b0VxdWFsKHBlcm1pdHMpO1xuICB9KTtcblxuICB0ZXN0KCdleGNsdWRlcyByZXF1ZXN0ZWQgZmlsZXMnLCAoKSA9PiB7XG4gICAgLy8gSW4gLmRvY2tlcmlnbm9yZSwgKiBvbmx5IG1hdGNoZXMgZmlsZXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBJZ25vcmVTdHJhdGVneS5kb2NrZXIoJy90bXAnLCBbJyouaWdub3JlZCddKTtcbiAgICBjb25zdCBpZ25vcmVzID0gW1xuICAgICAgJy90bXAvZmlsZS5pZ25vcmVkJyxcbiAgICBdO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ZpbGUuaWdub3JlZCcsXG4gICAgICAnL3RtcC9zb21lL2ltcG9ydGFudC9maWxlJyxcbiAgICBdO1xuXG4gICAgZXhwZWN0KHN0cmF0ZWd5SWdub3JlcyhzdHJhdGVneSwgaWdub3JlcykpLnRvRXF1YWwoaWdub3Jlcyk7XG4gICAgZXhwZWN0KHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneSwgcGVybWl0cykpLnRvRXF1YWwocGVybWl0cyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IGV4Y2x1ZGUgYWxsb3cgbGlzdGVkIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gSWdub3JlU3RyYXRlZ3kuZG9ja2VyKCcvdG1wJywgWycqLmlnbm9yZWQnLCAnIWltcG9ydGFudC4qJ10pO1xuICAgIGNvbnN0IHBlcm1pdHMgPSBbXG4gICAgICAnL3RtcC9zb21lL2ltcG9ydGFudC5pZ25vcmVkJyxcbiAgICBdO1xuXG4gICAgZXhwZWN0KHN0cmF0ZWd5UGVybWl0cyhzdHJhdGVneSwgcGVybWl0cykpLnRvRXF1YWwocGVybWl0cyk7XG4gIH0pO1xufSk7XG4iXX0=