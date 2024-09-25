"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipDirectory = void 0;
const fs_1 = require("fs");
const path = require("path");
const glob = require("glob");
// namespace object imports won't work in the bundle for function exports
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver');
async function zipDirectory(directory, outputFile, logger) {
    // We write to a temporary file and rename at the last moment. This is so that if we are
    // interrupted during this process, we don't leave a half-finished file in the target location.
    const temporaryOutputFile = `${outputFile}.${randomString()}._tmp`;
    await writeZipFile(directory, temporaryOutputFile);
    await moveIntoPlace(temporaryOutputFile, outputFile, logger);
}
exports.zipDirectory = zipDirectory;
function writeZipFile(directory, outputFile) {
    return new Promise(async (ok, fail) => {
        // The below options are needed to support following symlinks when building zip files:
        // - nodir: This will prevent symlinks themselves from being copied into the zip.
        // - follow: This will follow symlinks and copy the files within.
        const globOptions = {
            dot: true,
            nodir: true,
            follow: true,
            cwd: directory,
        };
        const files = glob.sync('**', globOptions); // The output here is already sorted
        const output = (0, fs_1.createWriteStream)(outputFile);
        const archive = archiver('zip');
        archive.on('warning', fail);
        archive.on('error', fail);
        // archive has been finalized and the output file descriptor has closed, resolve promise
        // this has to be done before calling `finalize` since the events may fire immediately after.
        // see https://www.npmjs.com/package/archiver
        output.once('close', ok);
        archive.pipe(output);
        // Append files serially to ensure file order
        for (const file of files) {
            const fullPath = path.resolve(directory, file);
            const [data, stat] = await Promise.all([fs_1.promises.readFile(fullPath), fs_1.promises.stat(fullPath)]);
            archive.append(data, {
                name: file,
                date: new Date('1980-01-01T00:00:00.000Z'), // reset dates to get the same hash for the same content
                mode: stat.mode,
            });
        }
        await archive.finalize();
    });
}
/**
 * Rename the file to the target location, taking into account:
 *
 * - That we may see EPERM on Windows while an Antivirus scanner still has the
 *   file open, so retry a couple of times.
 * - This same function may be called in parallel and be interrupted at any point.
 */
async function moveIntoPlace(source, target, logger) {
    let delay = 100;
    let attempts = 5;
    while (true) {
        try {
            // 'rename' is guaranteed to overwrite an existing target, as long as it is a file (not a directory)
            await fs_1.promises.rename(source, target);
            return;
        }
        catch (e) {
            if (e.code !== 'EPERM' || attempts-- <= 0) {
                throw e;
            }
            logger(e.message);
            await sleep(Math.floor(Math.random() * delay));
            delay *= 2;
        }
    }
}
function sleep(ms) {
    return new Promise(ok => setTimeout(ok, ms));
}
function randomString() {
    return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFyY2hpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkJBQXVEO0FBQ3ZELDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFFN0IseUVBQXlFO0FBQ3pFLGlFQUFpRTtBQUNqRSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFJOUIsS0FBSyxVQUFVLFlBQVksQ0FBQyxTQUFpQixFQUFFLFVBQWtCLEVBQUUsTUFBYztJQUN0Rix3RkFBd0Y7SUFDeEYsK0ZBQStGO0lBQy9GLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxVQUFVLElBQUksWUFBWSxFQUFFLE9BQU8sQ0FBQztJQUNuRSxNQUFNLFlBQVksQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNuRCxNQUFNLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQU5ELG9DQU1DO0FBRUQsU0FBUyxZQUFZLENBQUMsU0FBaUIsRUFBRSxVQUFrQjtJQUN6RCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEMsc0ZBQXNGO1FBQ3RGLGlGQUFpRjtRQUNqRixpRUFBaUU7UUFDakUsTUFBTSxXQUFXLEdBQUc7WUFDbEIsR0FBRyxFQUFFLElBQUk7WUFDVCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUFFLFNBQVM7U0FDZixDQUFDO1FBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxvQ0FBb0M7UUFFaEYsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBaUIsRUFBQyxVQUFVLENBQUMsQ0FBQztRQUU3QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFMUIsd0ZBQXdGO1FBQ3hGLDZGQUE2RjtRQUM3Riw2Q0FBNkM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekIsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyQiw2Q0FBNkM7UUFDN0MsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUN6QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkYsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxFQUFFLHdEQUF3RDtnQkFDcEcsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2hCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxLQUFLLFVBQVUsYUFBYSxDQUFDLE1BQWMsRUFBRSxNQUFjLEVBQUUsTUFBYztJQUN6RSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDaEIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUM7WUFDSCxvR0FBb0c7WUFDcEcsTUFBTSxhQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNoQyxPQUFPO1FBQ1QsQ0FBQztRQUFDLE9BQU8sQ0FBTSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLENBQUM7WUFDVixDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQixNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFVO0lBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVELFNBQVMsWUFBWTtJQUNuQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlV3JpdGVTdHJlYW0sIHByb21pc2VzIGFzIGZzIH0gZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5cbi8vIG5hbWVzcGFjZSBvYmplY3QgaW1wb3J0cyB3b24ndCB3b3JrIGluIHRoZSBidW5kbGUgZm9yIGZ1bmN0aW9uIGV4cG9ydHNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG5jb25zdCBhcmNoaXZlciA9IHJlcXVpcmUoJ2FyY2hpdmVyJyk7XG5cbnR5cGUgTG9nZ2VyID0gKHg6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHppcERpcmVjdG9yeShkaXJlY3Rvcnk6IHN0cmluZywgb3V0cHV0RmlsZTogc3RyaW5nLCBsb2dnZXI6IExvZ2dlcik6IFByb21pc2U8dm9pZD4ge1xuICAvLyBXZSB3cml0ZSB0byBhIHRlbXBvcmFyeSBmaWxlIGFuZCByZW5hbWUgYXQgdGhlIGxhc3QgbW9tZW50LiBUaGlzIGlzIHNvIHRoYXQgaWYgd2UgYXJlXG4gIC8vIGludGVycnVwdGVkIGR1cmluZyB0aGlzIHByb2Nlc3MsIHdlIGRvbid0IGxlYXZlIGEgaGFsZi1maW5pc2hlZCBmaWxlIGluIHRoZSB0YXJnZXQgbG9jYXRpb24uXG4gIGNvbnN0IHRlbXBvcmFyeU91dHB1dEZpbGUgPSBgJHtvdXRwdXRGaWxlfS4ke3JhbmRvbVN0cmluZygpfS5fdG1wYDtcbiAgYXdhaXQgd3JpdGVaaXBGaWxlKGRpcmVjdG9yeSwgdGVtcG9yYXJ5T3V0cHV0RmlsZSk7XG4gIGF3YWl0IG1vdmVJbnRvUGxhY2UodGVtcG9yYXJ5T3V0cHV0RmlsZSwgb3V0cHV0RmlsZSwgbG9nZ2VyKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVaaXBGaWxlKGRpcmVjdG9yeTogc3RyaW5nLCBvdXRwdXRGaWxlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChvaywgZmFpbCkgPT4ge1xuICAgIC8vIFRoZSBiZWxvdyBvcHRpb25zIGFyZSBuZWVkZWQgdG8gc3VwcG9ydCBmb2xsb3dpbmcgc3ltbGlua3Mgd2hlbiBidWlsZGluZyB6aXAgZmlsZXM6XG4gICAgLy8gLSBub2RpcjogVGhpcyB3aWxsIHByZXZlbnQgc3ltbGlua3MgdGhlbXNlbHZlcyBmcm9tIGJlaW5nIGNvcGllZCBpbnRvIHRoZSB6aXAuXG4gICAgLy8gLSBmb2xsb3c6IFRoaXMgd2lsbCBmb2xsb3cgc3ltbGlua3MgYW5kIGNvcHkgdGhlIGZpbGVzIHdpdGhpbi5cbiAgICBjb25zdCBnbG9iT3B0aW9ucyA9IHtcbiAgICAgIGRvdDogdHJ1ZSxcbiAgICAgIG5vZGlyOiB0cnVlLFxuICAgICAgZm9sbG93OiB0cnVlLFxuICAgICAgY3dkOiBkaXJlY3RvcnksXG4gICAgfTtcbiAgICBjb25zdCBmaWxlcyA9IGdsb2Iuc3luYygnKionLCBnbG9iT3B0aW9ucyk7IC8vIFRoZSBvdXRwdXQgaGVyZSBpcyBhbHJlYWR5IHNvcnRlZFxuXG4gICAgY29uc3Qgb3V0cHV0ID0gY3JlYXRlV3JpdGVTdHJlYW0ob3V0cHV0RmlsZSk7XG5cbiAgICBjb25zdCBhcmNoaXZlID0gYXJjaGl2ZXIoJ3ppcCcpO1xuICAgIGFyY2hpdmUub24oJ3dhcm5pbmcnLCBmYWlsKTtcbiAgICBhcmNoaXZlLm9uKCdlcnJvcicsIGZhaWwpO1xuXG4gICAgLy8gYXJjaGl2ZSBoYXMgYmVlbiBmaW5hbGl6ZWQgYW5kIHRoZSBvdXRwdXQgZmlsZSBkZXNjcmlwdG9yIGhhcyBjbG9zZWQsIHJlc29sdmUgcHJvbWlzZVxuICAgIC8vIHRoaXMgaGFzIHRvIGJlIGRvbmUgYmVmb3JlIGNhbGxpbmcgYGZpbmFsaXplYCBzaW5jZSB0aGUgZXZlbnRzIG1heSBmaXJlIGltbWVkaWF0ZWx5IGFmdGVyLlxuICAgIC8vIHNlZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9hcmNoaXZlclxuICAgIG91dHB1dC5vbmNlKCdjbG9zZScsIG9rKTtcblxuICAgIGFyY2hpdmUucGlwZShvdXRwdXQpO1xuXG4gICAgLy8gQXBwZW5kIGZpbGVzIHNlcmlhbGx5IHRvIGVuc3VyZSBmaWxlIG9yZGVyXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZShkaXJlY3RvcnksIGZpbGUpO1xuICAgICAgY29uc3QgW2RhdGEsIHN0YXRdID0gYXdhaXQgUHJvbWlzZS5hbGwoW2ZzLnJlYWRGaWxlKGZ1bGxQYXRoKSwgZnMuc3RhdChmdWxsUGF0aCldKTtcbiAgICAgIGFyY2hpdmUuYXBwZW5kKGRhdGEsIHtcbiAgICAgICAgbmFtZTogZmlsZSxcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoJzE5ODAtMDEtMDFUMDA6MDA6MDAuMDAwWicpLCAvLyByZXNldCBkYXRlcyB0byBnZXQgdGhlIHNhbWUgaGFzaCBmb3IgdGhlIHNhbWUgY29udGVudFxuICAgICAgICBtb2RlOiBzdGF0Lm1vZGUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhd2FpdCBhcmNoaXZlLmZpbmFsaXplKCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFJlbmFtZSB0aGUgZmlsZSB0byB0aGUgdGFyZ2V0IGxvY2F0aW9uLCB0YWtpbmcgaW50byBhY2NvdW50OlxuICpcbiAqIC0gVGhhdCB3ZSBtYXkgc2VlIEVQRVJNIG9uIFdpbmRvd3Mgd2hpbGUgYW4gQW50aXZpcnVzIHNjYW5uZXIgc3RpbGwgaGFzIHRoZVxuICogICBmaWxlIG9wZW4sIHNvIHJldHJ5IGEgY291cGxlIG9mIHRpbWVzLlxuICogLSBUaGlzIHNhbWUgZnVuY3Rpb24gbWF5IGJlIGNhbGxlZCBpbiBwYXJhbGxlbCBhbmQgYmUgaW50ZXJydXB0ZWQgYXQgYW55IHBvaW50LlxuICovXG5hc3luYyBmdW5jdGlvbiBtb3ZlSW50b1BsYWNlKHNvdXJjZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgbGV0IGRlbGF5ID0gMTAwO1xuICBsZXQgYXR0ZW1wdHMgPSA1O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyAncmVuYW1lJyBpcyBndWFyYW50ZWVkIHRvIG92ZXJ3cml0ZSBhbiBleGlzdGluZyB0YXJnZXQsIGFzIGxvbmcgYXMgaXQgaXMgYSBmaWxlIChub3QgYSBkaXJlY3RvcnkpXG4gICAgICBhd2FpdCBmcy5yZW5hbWUoc291cmNlLCB0YXJnZXQpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ0VQRVJNJyB8fCBhdHRlbXB0cy0tIDw9IDApIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICAgIGxvZ2dlcihlLm1lc3NhZ2UpO1xuICAgICAgYXdhaXQgc2xlZXAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGVsYXkpKTtcbiAgICAgIGRlbGF5ICo9IDI7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKG9rID0+IHNldFRpbWVvdXQob2ssIG1zKSk7XG59XG5cbmZ1bmN0aW9uIHJhbmRvbVN0cmluZygpIHtcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnJlcGxhY2UoL1teYS16MC05XSsvZywgJycpO1xufVxuIl19