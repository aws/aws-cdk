"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
test('path.resolve is sane', async () => {
    // Reasons why this might not be true:
    // graceful-fs, which is used by Jest, hooks into process.cwd() and
    // process.chdir() and caches the values. Because... profit?
    const targetDir = path.join(__dirname, 'fixture');
    const cwd = process.cwd();
    try {
        process.chdir(targetDir);
        expect(process.cwd()).toEqual(targetDir);
        const resolved = path.resolve('.');
        expect(resolved).toEqual(targetDir);
    }
    finally {
        process.chdir(cwd);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXR5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYW5pdHkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUU3QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDdEMsc0NBQXNDO0lBQ3RDLG1FQUFtRTtJQUNuRSw0REFBNEQ7SUFFNUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbEQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRTFCLElBQUk7UUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBRXJDO1lBQVM7UUFDUixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG50ZXN0KCdwYXRoLnJlc29sdmUgaXMgc2FuZScsIGFzeW5jICgpID0+IHtcbiAgLy8gUmVhc29ucyB3aHkgdGhpcyBtaWdodCBub3QgYmUgdHJ1ZTpcbiAgLy8gZ3JhY2VmdWwtZnMsIHdoaWNoIGlzIHVzZWQgYnkgSmVzdCwgaG9va3MgaW50byBwcm9jZXNzLmN3ZCgpIGFuZFxuICAvLyBwcm9jZXNzLmNoZGlyKCkgYW5kIGNhY2hlcyB0aGUgdmFsdWVzLiBCZWNhdXNlLi4uIHByb2ZpdD9cblxuICBjb25zdCB0YXJnZXREaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZScpO1xuXG4gIGNvbnN0IGN3ZCA9IHByb2Nlc3MuY3dkKCk7XG5cbiAgdHJ5IHtcbiAgICBwcm9jZXNzLmNoZGlyKHRhcmdldERpcik7XG4gICAgZXhwZWN0KHByb2Nlc3MuY3dkKCkpLnRvRXF1YWwodGFyZ2V0RGlyKTtcblxuICAgIGNvbnN0IHJlc29sdmVkID0gcGF0aC5yZXNvbHZlKCcuJyk7XG4gICAgZXhwZWN0KHJlc29sdmVkKS50b0VxdWFsKHRhcmdldERpcik7XG5cbiAgfSBmaW5hbGx5IHtcbiAgICBwcm9jZXNzLmNoZGlyKGN3ZCk7XG4gIH1cbn0pOyJdfQ==