"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const ts_mock_imports_1 = require("ts-mock-imports");
const fs_1 = require("../../lib/fs");
const util = require("../../lib/fs/utils");
describe('utils', () => {
    describe('shouldFollow', () => {
        describe('always', () => {
            test('follows internal', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', true);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(true);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('follows external', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', true);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(true);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow internal when the referent does not exist', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', false);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow external when the referent does not exist', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', false);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
        });
        describe('external', () => {
            test('does not follow internal', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync');
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.notCalled).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('follows external', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', true);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(true);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow external when referent does not exist', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', false);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
        });
        describe('blockExternal', () => {
            test('follows internal', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', true);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(true);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow internal when referent does not exist', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync', false);
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.calledOnceWith(linkTarget)).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow external', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync');
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.notCalled).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
        });
        describe('never', () => {
            test('does not follow internal', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join(sourceRoot, 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync');
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.NEVER, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.notCalled).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
            test('does not follow external', () => {
                const sourceRoot = path.join('source', 'root');
                const linkTarget = path.join('alternate', 'referent');
                const mockFsExists = ts_mock_imports_1.ImportMock.mockFunction(fs, 'existsSync');
                try {
                    expect(util.shouldFollow(fs_1.SymlinkFollowMode.NEVER, sourceRoot, linkTarget)).toEqual(false);
                    expect(mockFsExists.notCalled).toEqual(true);
                    ;
                }
                finally {
                    mockFsExists.restore();
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHFEQUE2QztBQUM3QyxxQ0FBaUQ7QUFDakQsMkNBQTJDO0FBRTNDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7Z0JBQzVCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFFckQsTUFBTSxZQUFZLEdBQUcsNEJBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckUsSUFBSTtvQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxRixNQUFNLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDOUQsQ0FBQztpQkFDRjt3QkFBUztvQkFDUixZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ3hCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO2dCQUM1QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEs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QUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtnQkFDcEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLFlBQVksR0FBRyw0QkFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQy9ELElBQUk7b0JBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQWlCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUYsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzdDLENBQUM7aUJBQ0Y7d0JBQVM7b0JBQ1IsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO2lCQUN4QjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEltcG9ydE1vY2sgfSBmcm9tICd0cy1tb2NrLWltcG9ydHMnO1xuaW1wb3J0IHsgU3ltbGlua0ZvbGxvd01vZGUgfSBmcm9tICcuLi8uLi9saWIvZnMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi9saWIvZnMvdXRpbHMnO1xuXG5kZXNjcmliZSgndXRpbHMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzaG91bGRGb2xsb3cnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2Fsd2F5cycsICgpID0+IHtcbiAgICAgIHRlc3QoJ2ZvbGxvd3MgaW50ZXJuYWwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBwYXRoLmpvaW4oJ3NvdXJjZScsICdyb290Jyk7XG4gICAgICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBwYXRoLmpvaW4oc291cmNlUm9vdCwgJ3JlZmVyZW50Jyk7XG5cbiAgICAgICAgY29uc3QgbW9ja0ZzRXhpc3RzID0gSW1wb3J0TW9jay5tb2NrRnVuY3Rpb24oZnMsICdleGlzdHNTeW5jJywgdHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHV0aWwuc2hvdWxkRm9sbG93KFN5bWxpbmtGb2xsb3dNb2RlLkFMV0FZUywgc291cmNlUm9vdCwgbGlua1RhcmdldCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tGc0V4aXN0cy5jYWxsZWRPbmNlV2l0aChsaW5rVGFyZ2V0KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICA7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgbW9ja0ZzRXhpc3RzLnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2ZvbGxvd3MgZXh0ZXJuYWwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBwYXRoLmpvaW4oJ3NvdXJjZScsICdyb290Jyk7XG4gICAgICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBwYXRoLmpvaW4oJ2FsdGVybmF0ZScsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnLCB0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuQUxXQVlTLCBzb3VyY2VSb290LCBsaW5rVGFyZ2V0KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLmNhbGxlZE9uY2VXaXRoKGxpbmtUYXJnZXQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBtb2NrRnNFeGlzdHMucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZG9lcyBub3QgZm9sbG93IGludGVybmFsIHdoZW4gdGhlIHJlZmVyZW50IGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2VSb290ID0gcGF0aC5qb2luKCdzb3VyY2UnLCAncm9vdCcpO1xuICAgICAgICBjb25zdCBsaW5rVGFyZ2V0ID0gcGF0aC5qb2luKHNvdXJjZVJvb3QsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnLCBmYWxzZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHV0aWwuc2hvdWxkRm9sbG93KFN5bWxpbmtGb2xsb3dNb2RlLkFMV0FZUywgc291cmNlUm9vdCwgbGlua1RhcmdldCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgIGV4cGVjdChtb2NrRnNFeGlzdHMuY2FsbGVkT25jZVdpdGgobGlua1RhcmdldCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIG1vY2tGc0V4aXN0cy5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdkb2VzIG5vdCBmb2xsb3cgZXh0ZXJuYWwgd2hlbiB0aGUgcmVmZXJlbnQgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBwYXRoLmpvaW4oJ3NvdXJjZScsICdyb290Jyk7XG4gICAgICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBwYXRoLmpvaW4oJ2FsdGVybmF0ZScsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnLCBmYWxzZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHV0aWwuc2hvdWxkRm9sbG93KFN5bWxpbmtGb2xsb3dNb2RlLkFMV0FZUywgc291cmNlUm9vdCwgbGlua1RhcmdldCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgIGV4cGVjdChtb2NrRnNFeGlzdHMuY2FsbGVkT25jZVdpdGgobGlua1RhcmdldCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIG1vY2tGc0V4aXN0cy5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2V4dGVybmFsJywgKCkgPT4ge1xuICAgICAgdGVzdCgnZG9lcyBub3QgZm9sbG93IGludGVybmFsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2VSb290ID0gcGF0aC5qb2luKCdzb3VyY2UnLCAncm9vdCcpO1xuICAgICAgICBjb25zdCBsaW5rVGFyZ2V0ID0gcGF0aC5qb2luKHNvdXJjZVJvb3QsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuRVhURVJOQUwsIHNvdXJjZVJvb3QsIGxpbmtUYXJnZXQpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLm5vdENhbGxlZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICA7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgbW9ja0ZzRXhpc3RzLnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2ZvbGxvd3MgZXh0ZXJuYWwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBwYXRoLmpvaW4oJ3NvdXJjZScsICdyb290Jyk7XG4gICAgICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBwYXRoLmpvaW4oJ2FsdGVybmF0ZScsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnLCB0cnVlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuRVhURVJOQUwsIHNvdXJjZVJvb3QsIGxpbmtUYXJnZXQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIGV4cGVjdChtb2NrRnNFeGlzdHMuY2FsbGVkT25jZVdpdGgobGlua1RhcmdldCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIG1vY2tGc0V4aXN0cy5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdkb2VzIG5vdCBmb2xsb3cgZXh0ZXJuYWwgd2hlbiByZWZlcmVudCBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlUm9vdCA9IHBhdGguam9pbignc291cmNlJywgJ3Jvb3QnKTtcbiAgICAgICAgY29uc3QgbGlua1RhcmdldCA9IHBhdGguam9pbignYWx0ZXJuYXRlJywgJ3JlZmVyZW50Jyk7XG4gICAgICAgIGNvbnN0IG1vY2tGc0V4aXN0cyA9IEltcG9ydE1vY2subW9ja0Z1bmN0aW9uKGZzLCAnZXhpc3RzU3luYycsIGZhbHNlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuRVhURVJOQUwsIHNvdXJjZVJvb3QsIGxpbmtUYXJnZXQpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLmNhbGxlZE9uY2VXaXRoKGxpbmtUYXJnZXQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBtb2NrRnNFeGlzdHMucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdibG9ja0V4dGVybmFsJywgKCkgPT4ge1xuICAgICAgdGVzdCgnZm9sbG93cyBpbnRlcm5hbCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlUm9vdCA9IHBhdGguam9pbignc291cmNlJywgJ3Jvb3QnKTtcbiAgICAgICAgY29uc3QgbGlua1RhcmdldCA9IHBhdGguam9pbihzb3VyY2VSb290LCAncmVmZXJlbnQnKTtcbiAgICAgICAgY29uc3QgbW9ja0ZzRXhpc3RzID0gSW1wb3J0TW9jay5tb2NrRnVuY3Rpb24oZnMsICdleGlzdHNTeW5jJywgdHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHV0aWwuc2hvdWxkRm9sbG93KFN5bWxpbmtGb2xsb3dNb2RlLkJMT0NLX0VYVEVSTkFMLCBzb3VyY2VSb290LCBsaW5rVGFyZ2V0KSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLmNhbGxlZE9uY2VXaXRoKGxpbmtUYXJnZXQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBtb2NrRnNFeGlzdHMucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZG9lcyBub3QgZm9sbG93IGludGVybmFsIHdoZW4gcmVmZXJlbnQgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNvdXJjZVJvb3QgPSBwYXRoLmpvaW4oJ3NvdXJjZScsICdyb290Jyk7XG4gICAgICAgIGNvbnN0IGxpbmtUYXJnZXQgPSBwYXRoLmpvaW4oc291cmNlUm9vdCwgJ3JlZmVyZW50Jyk7XG4gICAgICAgIGNvbnN0IG1vY2tGc0V4aXN0cyA9IEltcG9ydE1vY2subW9ja0Z1bmN0aW9uKGZzLCAnZXhpc3RzU3luYycsIGZhbHNlKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuQkxPQ0tfRVhURVJOQUwsIHNvdXJjZVJvb3QsIGxpbmtUYXJnZXQpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLmNhbGxlZE9uY2VXaXRoKGxpbmtUYXJnZXQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBtb2NrRnNFeGlzdHMucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnZG9lcyBub3QgZm9sbG93IGV4dGVybmFsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2VSb290ID0gcGF0aC5qb2luKCdzb3VyY2UnLCAncm9vdCcpO1xuICAgICAgICBjb25zdCBsaW5rVGFyZ2V0ID0gcGF0aC5qb2luKCdhbHRlcm5hdGUnLCAncmVmZXJlbnQnKTtcbiAgICAgICAgY29uc3QgbW9ja0ZzRXhpc3RzID0gSW1wb3J0TW9jay5tb2NrRnVuY3Rpb24oZnMsICdleGlzdHNTeW5jJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXhwZWN0KHV0aWwuc2hvdWxkRm9sbG93KFN5bWxpbmtGb2xsb3dNb2RlLkJMT0NLX0VYVEVSTkFMLCBzb3VyY2VSb290LCBsaW5rVGFyZ2V0KSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgZXhwZWN0KG1vY2tGc0V4aXN0cy5ub3RDYWxsZWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIG1vY2tGc0V4aXN0cy5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ25ldmVyJywgKCkgPT4ge1xuICAgICAgdGVzdCgnZG9lcyBub3QgZm9sbG93IGludGVybmFsJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBzb3VyY2VSb290ID0gcGF0aC5qb2luKCdzb3VyY2UnLCAncm9vdCcpO1xuICAgICAgICBjb25zdCBsaW5rVGFyZ2V0ID0gcGF0aC5qb2luKHNvdXJjZVJvb3QsICdyZWZlcmVudCcpO1xuICAgICAgICBjb25zdCBtb2NrRnNFeGlzdHMgPSBJbXBvcnRNb2NrLm1vY2tGdW5jdGlvbihmcywgJ2V4aXN0c1N5bmMnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHBlY3QodXRpbC5zaG91bGRGb2xsb3coU3ltbGlua0ZvbGxvd01vZGUuTkVWRVIsIHNvdXJjZVJvb3QsIGxpbmtUYXJnZXQpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICBleHBlY3QobW9ja0ZzRXhpc3RzLm5vdENhbGxlZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICA7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgbW9ja0ZzRXhpc3RzLnJlc3RvcmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2RvZXMgbm90IGZvbGxvdyBleHRlcm5hbCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc291cmNlUm9vdCA9IHBhdGguam9pbignc291cmNlJywgJ3Jvb3QnKTtcbiAgICAgICAgY29uc3QgbGlua1RhcmdldCA9IHBhdGguam9pbignYWx0ZXJuYXRlJywgJ3JlZmVyZW50Jyk7XG4gICAgICAgIGNvbnN0IG1vY2tGc0V4aXN0cyA9IEltcG9ydE1vY2subW9ja0Z1bmN0aW9uKGZzLCAnZXhpc3RzU3luYycpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4cGVjdCh1dGlsLnNob3VsZEZvbGxvdyhTeW1saW5rRm9sbG93TW9kZS5ORVZFUiwgc291cmNlUm9vdCwgbGlua1RhcmdldCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgIGV4cGVjdChtb2NrRnNFeGlzdHMubm90Q2FsbGVkKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgIDtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBtb2NrRnNFeGlzdHMucmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==