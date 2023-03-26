"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const fs_1 = require("../../lib/fs");
describe('fs copy', () => {
    test('Default: copies all files and subdirectories, with default follow mode is "External"', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
        // WHEN
        fs_1.FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir);
        // THEN
        expect(tree(outdir)).toEqual([
            'external-link.txt',
            'file1.txt',
            'local-link.txt => file1.txt',
            'subdir (D)',
            '    file2.txt',
            'subdir2 (D)',
            '    empty-subdir (D)',
            '        .hidden',
            '    subdir3 (D)',
            '        file3.txt',
        ]);
    });
    test('Always: follow all symlinks', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
        // WHEN
        fs_1.FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
            follow: fs_1.SymlinkFollowMode.ALWAYS,
        });
        // THEN
        expect(tree(outdir)).toEqual([
            'external-dir-link (D)',
            '    file2.txt',
            'external-link.txt',
            'indirect-external-link.txt',
            'local-dir-link (D)',
            '    file-in-subdir.txt',
            'local-link.txt',
            'normal-dir (D)',
            '    file-in-subdir.txt',
            'normal-file.txt',
        ]);
    });
    test('Never: do not follow all symlinks', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
        // WHEN
        fs_1.FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
            follow: fs_1.SymlinkFollowMode.NEVER,
        });
        // THEN
        expect(tree(outdir)).toEqual([
            'external-dir-link => ../test1/subdir',
            'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
            'indirect-external-link.txt => external-link.txt',
            'local-dir-link => normal-dir',
            'local-link.txt => normal-file.txt',
            'normal-dir (D)',
            '    file-in-subdir.txt',
            'normal-file.txt',
        ]);
    });
    test('External: follow only external symlinks', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
        // WHEN
        fs_1.FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
            follow: fs_1.SymlinkFollowMode.EXTERNAL,
        });
        // THEN
        expect(tree(outdir)).toEqual([
            'external-dir-link (D)',
            '    file2.txt',
            'external-link.txt',
            'indirect-external-link.txt => external-link.txt',
            'local-dir-link => normal-dir',
            'local-link.txt => normal-file.txt',
            'normal-dir (D)',
            '    file-in-subdir.txt',
            'normal-file.txt',
        ]);
    });
    test('exclude', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
        // WHEN
        fs_1.FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
            exclude: [
                '*',
                '!subdir2',
                '!subdir2/**/*',
                '.*',
            ],
        });
        // THEN
        expect(tree(outdir)).toEqual([
            'subdir2 (D)',
            '    empty-subdir (D)',
            '    subdir3 (D)',
            '        file3.txt',
        ]);
    });
});
function tree(dir, depth = '') {
    const lines = new Array();
    for (const file of fs.readdirSync(dir).sort()) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isSymbolicLink()) {
            const linkDest = fs.readlinkSync(filePath);
            lines.push(depth + file + ' => ' + linkDest);
        }
        else if (stat.isDirectory()) {
            lines.push(depth + file + ' (D)');
            lines.push(...tree(filePath, depth + '    '));
        }
        else {
            lines.push(depth + file);
        }
    }
    return lines;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMtY29weS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZnMtY29weS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IscUNBQTZEO0FBRTdELFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLElBQUksQ0FBQyxzRkFBc0YsRUFBRSxHQUFHLEVBQUU7UUFDaEcsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUVwRSxPQUFPO1FBQ1AsZUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFNUUsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDM0IsbUJBQW1CO1lBQ25CLFdBQVc7WUFDWCw2QkFBNkI7WUFDN0IsWUFBWTtZQUNaLGVBQWU7WUFDZixhQUFhO1lBQ2Isc0JBQXNCO1lBQ3RCLGlCQUFpQjtZQUNqQixpQkFBaUI7WUFDakIsbUJBQW1CO1NBQ3BCLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxRQUFRO1FBQ1IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRXBFLE9BQU87UUFDUCxlQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDN0UsTUFBTSxFQUFFLHNCQUFpQixDQUFDLE1BQU07U0FDakMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDM0IsdUJBQXVCO1lBQ3ZCLGVBQWU7WUFDZixtQkFBbUI7WUFDbkIsNEJBQTRCO1lBQzVCLG9CQUFvQjtZQUNwQix3QkFBd0I7WUFDeEIsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQix3QkFBd0I7WUFDeEIsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxRQUFRO1FBQ1IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRXBFLE9BQU87UUFDUCxlQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDN0UsTUFBTSxFQUFFLHNCQUFpQixDQUFDLEtBQUs7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDM0Isc0NBQXNDO1lBQ3RDLHlEQUF5RDtZQUN6RCxpREFBaUQ7WUFDakQsOEJBQThCO1lBQzlCLG1DQUFtQztZQUNuQyxnQkFBZ0I7WUFDaEIsd0JBQXdCO1lBQ3hCLGlCQUFpQjtTQUNsQixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUVwRSxPQUFPO1FBQ1AsZUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsTUFBTSxFQUFFO1lBQzdFLE1BQU0sRUFBRSxzQkFBaUIsQ0FBQyxRQUFRO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzNCLHVCQUF1QjtZQUN2QixlQUFlO1lBQ2YsbUJBQW1CO1lBQ25CLGlEQUFpRDtZQUNqRCw4QkFBOEI7WUFDOUIsbUNBQW1DO1lBQ25DLGdCQUFnQjtZQUNoQix3QkFBd0I7WUFDeEIsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDbkIsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUVwRSxPQUFPO1FBQ1AsZUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFO1lBQzFFLE9BQU8sRUFBRTtnQkFDUCxHQUFHO2dCQUNILFVBQVU7Z0JBQ1YsZUFBZTtnQkFDZixJQUFJO2FBQ0w7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUMzQixhQUFhO1lBQ2Isc0JBQXNCO1lBQ3RCLGlCQUFpQjtZQUNqQixtQkFBbUI7U0FDcEIsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsSUFBSSxDQUFDLEdBQVcsRUFBRSxLQUFLLEdBQUcsRUFBRTtJQUNuQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBQ2xDLEtBQUssTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztTQUM5QzthQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvQzthQUFNO1lBQ0wsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDMUI7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtLCBTeW1saW5rRm9sbG93TW9kZSB9IGZyb20gJy4uLy4uL2xpYi9mcyc7XG5cbmRlc2NyaWJlKCdmcyBjb3B5JywgKCkgPT4ge1xuICB0ZXN0KCdEZWZhdWx0OiBjb3BpZXMgYWxsIGZpbGVzIGFuZCBzdWJkaXJlY3Rvcmllcywgd2l0aCBkZWZhdWx0IGZvbGxvdyBtb2RlIGlzIFwiRXh0ZXJuYWxcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG91dGRpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2NvcHktdGVzdHMnKSk7XG5cbiAgICAvLyBXSEVOXG4gICAgRmlsZVN5c3RlbS5jb3B5RGlyZWN0b3J5KHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICd0ZXN0MScpLCBvdXRkaXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0cmVlKG91dGRpcikpLnRvRXF1YWwoW1xuICAgICAgJ2V4dGVybmFsLWxpbmsudHh0JyxcbiAgICAgICdmaWxlMS50eHQnLFxuICAgICAgJ2xvY2FsLWxpbmsudHh0ID0+IGZpbGUxLnR4dCcsXG4gICAgICAnc3ViZGlyIChEKScsXG4gICAgICAnICAgIGZpbGUyLnR4dCcsXG4gICAgICAnc3ViZGlyMiAoRCknLFxuICAgICAgJyAgICBlbXB0eS1zdWJkaXIgKEQpJyxcbiAgICAgICcgICAgICAgIC5oaWRkZW4nLFxuICAgICAgJyAgICBzdWJkaXIzIChEKScsXG4gICAgICAnICAgICAgICBmaWxlMy50eHQnLFxuICAgIF0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ0Fsd2F5czogZm9sbG93IGFsbCBzeW1saW5rcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IG91dGRpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2NvcHktdGVzdHMnKSk7XG5cbiAgICAvLyBXSEVOXG4gICAgRmlsZVN5c3RlbS5jb3B5RGlyZWN0b3J5KHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdzeW1saW5rcycpLCBvdXRkaXIsIHtcbiAgICAgIGZvbGxvdzogU3ltbGlua0ZvbGxvd01vZGUuQUxXQVlTLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0cmVlKG91dGRpcikpLnRvRXF1YWwoW1xuICAgICAgJ2V4dGVybmFsLWRpci1saW5rIChEKScsXG4gICAgICAnICAgIGZpbGUyLnR4dCcsXG4gICAgICAnZXh0ZXJuYWwtbGluay50eHQnLFxuICAgICAgJ2luZGlyZWN0LWV4dGVybmFsLWxpbmsudHh0JyxcbiAgICAgICdsb2NhbC1kaXItbGluayAoRCknLFxuICAgICAgJyAgICBmaWxlLWluLXN1YmRpci50eHQnLFxuICAgICAgJ2xvY2FsLWxpbmsudHh0JyxcbiAgICAgICdub3JtYWwtZGlyIChEKScsXG4gICAgICAnICAgIGZpbGUtaW4tc3ViZGlyLnR4dCcsXG4gICAgICAnbm9ybWFsLWZpbGUudHh0JyxcbiAgICBdKTtcblxuICB9KTtcblxuICB0ZXN0KCdOZXZlcjogZG8gbm90IGZvbGxvdyBhbGwgc3ltbGlua3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBvdXRkaXIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdjb3B5LXRlc3RzJykpO1xuXG4gICAgLy8gV0hFTlxuICAgIEZpbGVTeXN0ZW0uY29weURpcmVjdG9yeShwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAnc3ltbGlua3MnKSwgb3V0ZGlyLCB7XG4gICAgICBmb2xsb3c6IFN5bWxpbmtGb2xsb3dNb2RlLk5FVkVSLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0cmVlKG91dGRpcikpLnRvRXF1YWwoW1xuICAgICAgJ2V4dGVybmFsLWRpci1saW5rID0+IC4uL3Rlc3QxL3N1YmRpcicsXG4gICAgICAnZXh0ZXJuYWwtbGluay50eHQgPT4gLi4vdGVzdDEvc3ViZGlyMi9zdWJkaXIzL2ZpbGUzLnR4dCcsXG4gICAgICAnaW5kaXJlY3QtZXh0ZXJuYWwtbGluay50eHQgPT4gZXh0ZXJuYWwtbGluay50eHQnLFxuICAgICAgJ2xvY2FsLWRpci1saW5rID0+IG5vcm1hbC1kaXInLFxuICAgICAgJ2xvY2FsLWxpbmsudHh0ID0+IG5vcm1hbC1maWxlLnR4dCcsXG4gICAgICAnbm9ybWFsLWRpciAoRCknLFxuICAgICAgJyAgICBmaWxlLWluLXN1YmRpci50eHQnLFxuICAgICAgJ25vcm1hbC1maWxlLnR4dCcsXG4gICAgXSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnRXh0ZXJuYWw6IGZvbGxvdyBvbmx5IGV4dGVybmFsIHN5bWxpbmtzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgb3V0ZGlyID0gZnMubWtkdGVtcFN5bmMocGF0aC5qb2luKG9zLnRtcGRpcigpLCAnY29weS10ZXN0cycpKTtcblxuICAgIC8vIFdIRU5cbiAgICBGaWxlU3lzdGVtLmNvcHlEaXJlY3RvcnkocGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ3N5bWxpbmtzJyksIG91dGRpciwge1xuICAgICAgZm9sbG93OiBTeW1saW5rRm9sbG93TW9kZS5FWFRFUk5BTCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodHJlZShvdXRkaXIpKS50b0VxdWFsKFtcbiAgICAgICdleHRlcm5hbC1kaXItbGluayAoRCknLFxuICAgICAgJyAgICBmaWxlMi50eHQnLFxuICAgICAgJ2V4dGVybmFsLWxpbmsudHh0JyxcbiAgICAgICdpbmRpcmVjdC1leHRlcm5hbC1saW5rLnR4dCA9PiBleHRlcm5hbC1saW5rLnR4dCcsXG4gICAgICAnbG9jYWwtZGlyLWxpbmsgPT4gbm9ybWFsLWRpcicsXG4gICAgICAnbG9jYWwtbGluay50eHQgPT4gbm9ybWFsLWZpbGUudHh0JyxcbiAgICAgICdub3JtYWwtZGlyIChEKScsXG4gICAgICAnICAgIGZpbGUtaW4tc3ViZGlyLnR4dCcsXG4gICAgICAnbm9ybWFsLWZpbGUudHh0JyxcbiAgICBdKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2V4Y2x1ZGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBvdXRkaXIgPSBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4ob3MudG1wZGlyKCksICdjb3B5LXRlc3RzJykpO1xuXG4gICAgLy8gV0hFTlxuICAgIEZpbGVTeXN0ZW0uY29weURpcmVjdG9yeShwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnLCAndGVzdDEnKSwgb3V0ZGlyLCB7XG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICcqJyxcbiAgICAgICAgJyFzdWJkaXIyJyxcbiAgICAgICAgJyFzdWJkaXIyLyoqLyonLFxuICAgICAgICAnLionLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodHJlZShvdXRkaXIpKS50b0VxdWFsKFtcbiAgICAgICdzdWJkaXIyIChEKScsXG4gICAgICAnICAgIGVtcHR5LXN1YmRpciAoRCknLFxuICAgICAgJyAgICBzdWJkaXIzIChEKScsXG4gICAgICAnICAgICAgICBmaWxlMy50eHQnLFxuICAgIF0pO1xuXG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHRyZWUoZGlyOiBzdHJpbmcsIGRlcHRoID0gJycpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxpbmVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKGRpcikuc29ydCgpKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlKTtcbiAgICBjb25zdCBzdGF0ID0gZnMubHN0YXRTeW5jKGZpbGVQYXRoKTtcbiAgICBpZiAoc3RhdC5pc1N5bWJvbGljTGluaygpKSB7XG4gICAgICBjb25zdCBsaW5rRGVzdCA9IGZzLnJlYWRsaW5rU3luYyhmaWxlUGF0aCk7XG4gICAgICBsaW5lcy5wdXNoKGRlcHRoICsgZmlsZSArICcgPT4gJyArIGxpbmtEZXN0KTtcbiAgICB9IGVsc2UgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgbGluZXMucHVzaChkZXB0aCArIGZpbGUgKyAnIChEKScpO1xuICAgICAgbGluZXMucHVzaCguLi50cmVlKGZpbGVQYXRoLCBkZXB0aCArICcgICAgJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lcy5wdXNoKGRlcHRoICsgZmlsZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBsaW5lcztcbn1cbiJdfQ==