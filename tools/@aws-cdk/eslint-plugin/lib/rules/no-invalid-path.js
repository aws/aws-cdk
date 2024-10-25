"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const path = require("path");
const fs = require("fs");
function isPathJoinFuncCall(node) {
    return (node.callee?.property?.name === 'join' &&
        (node.parent?.expression?.callee?.object?.name === 'path' ||
            node.parent?.arguments?.some((a) => a.callee?.object?.name === 'path')));
}
function noArgumentVariables(node) {
    // Outside of the first argument, all arguments should be strings
    const components = node.arguments.slice(1);
    return components.every((a) => a.value !== undefined);
}
function hasSlashes(args) {
    return args.some((a) => a.includes('/'));
}
function firstArgIsDirname(node) {
    return node.arguments[0].name && node.arguments[0].name === '__dirname';
}
function argumentList(node) {
    // Already confirmed that first argument is '__dirname', so can safely remove it
    const args = node.arguments.slice(1).map((a) => { return a.value; });
    return args;
}
function recreatePath(args) {
    return `path.join(__dirname, '${args.join('\', \'')}')`;
}
function create(context) {
    return {
        CallExpression(node) {
            if (isPathJoinFuncCall(node)) {
                if (node.arguments.length === 0) {
                    // ERROR: this is 'path.join()'
                    context.report({ node, message: '\'path.join()\' is not a valid path. You must specify arguments into the function.' });
                    return;
                }
                if (!noArgumentVariables(node)) {
                    // WARNING: unexpected non-string in the argument list. This happens if part of the argument list is a variable, i.e. `path.join(__dirname, myPath)`.
                    // We may be able to do something about this, but we currently are just going to let it pass.
                    return;
                }
                // We currently do not lint any path.join without '__dirname' as the first argument
                if (!firstArgIsDirname(node)) {
                    return;
                }
                const args = argumentList(node);
                if (hasSlashes(args)) {
                    // ERROR: This path looks like 'path.join(__dirname, 'a/b')' and should be changed to 'path.join(__dirname, 'a', 'b')'
                    context.report({ node, message: `${recreatePath(args)} is not a valid path. It has '/' in the arguments which is not allowed. Each directory should be its own separate argument.` });
                    return;
                }
                const firstDownDir = args.findIndex((p) => p !== '..');
                // Confirm path does not have any unnecessary '..' paths
                // This allows us to validate subsequent checks
                if (firstDownDir > 0 && args.some((p, i) => p === '..' && i > firstDownDir)) {
                    // ERROR: This path oscillates between up and down commands
                    context.report({ node, message: `${recreatePath(args)} is not a valid path. It goes backwards and forwards and backwards again, and can be simplified.` });
                    return;
                }
                // Exclude the case where there are no '..' at all in the path -- those are never invalid
                const currentFile = context.getFilename();
                if (firstDownDir > 0) {
                    for (let i = 0; i < firstDownDir; i++) {
                        const pjFile = path.join(...[path.dirname(currentFile), ...args.slice(0, i), 'package.json']);
                        if (fs.existsSync(pjFile)) {
                            // ERROR: this path will end up going out of the package.json directory
                            context.report({ node, message: `${recreatePath(args)} is not a valid path. It goes beyond the parent library's package.json file so the file it points to will not be available after the library is packaged.` });
                            return;
                        }
                    }
                }
            }
        }
    };
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8taW52YWxpZC1wYXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm8taW52YWxpZC1wYXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFFekIsU0FBUyxrQkFBa0IsQ0FBQyxJQUFTO0lBQ25DLE9BQU8sQ0FDTCxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEtBQUssTUFBTTtRQUN0QyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxLQUFLLE1BQU07WUFDekQsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FDN0UsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLElBQVM7SUFDcEMsaUVBQWlFO0lBQ2pFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsSUFBYztJQUNoQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFTO0lBQ2xDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFD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QUM7NEJBQzFCLHVFQUF1RTs0QkFDdkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLDJKQUEySixFQUFDLENBQUMsQ0FBQzs0QkFDbk4sT0FBTzt3QkFDVCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUF0REQsd0JBc0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5mdW5jdGlvbiBpc1BhdGhKb2luRnVuY0NhbGwobm9kZTogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgbm9kZS5jYWxsZWU/LnByb3BlcnR5Py5uYW1lID09PSAnam9pbicgJiZcbiAgICAobm9kZS5wYXJlbnQ/LmV4cHJlc3Npb24/LmNhbGxlZT8ub2JqZWN0Py5uYW1lID09PSAncGF0aCcgfHxcbiAgICBub2RlLnBhcmVudD8uYXJndW1lbnRzPy5zb21lKChhOiBhbnkpID0+IGEuY2FsbGVlPy5vYmplY3Q/Lm5hbWUgPT09ICdwYXRoJykpXG4gICk7XG59XG5cbmZ1bmN0aW9uIG5vQXJndW1lbnRWYXJpYWJsZXMobm9kZTogYW55KTogYm9vbGVhbiB7XG4gIC8vIE91dHNpZGUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50LCBhbGwgYXJndW1lbnRzIHNob3VsZCBiZSBzdHJpbmdzXG4gIGNvbnN0IGNvbXBvbmVudHMgPSBub2RlLmFyZ3VtZW50cy5zbGljZSgxKTtcbiAgcmV0dXJuIGNvbXBvbmVudHMuZXZlcnkoKGE6IGFueSkgPT4gYS52YWx1ZSAhPT0gdW5kZWZpbmVkKTtcbn1cblxuZnVuY3Rpb24gaGFzU2xhc2hlcyhhcmdzOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gYXJncy5zb21lKChhKSA9PiBhLmluY2x1ZGVzKCcvJykpO1xufVxuXG5mdW5jdGlvbiBmaXJzdEFyZ0lzRGlybmFtZShub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUuYXJndW1lbnRzWzBdLm5hbWUgJiYgbm9kZS5hcmd1bWVudHNbMF0ubmFtZSA9PT0gJ19fZGlybmFtZSc7XG59XG5cbmZ1bmN0aW9uIGFyZ3VtZW50TGlzdChub2RlOiBhbnkpOiBzdHJpbmdbXSB7XG4gIC8vIEFscmVhZHkgY29uZmlybWVkIHRoYXQgZmlyc3QgYXJndW1lbnQgaXMgJ19fZGlybmFtZScsIHNvIGNhbiBzYWZlbHkgcmVtb3ZlIGl0XG4gIGNvbnN0IGFyZ3M6IHN0cmluZ1tdID0gbm9kZS5hcmd1bWVudHMuc2xpY2UoMSkubWFwKChhOiBhbnkpID0+IHsgcmV0dXJuIGEudmFsdWU7IH0pO1xuICByZXR1cm4gYXJncztcbn1cblxuZnVuY3Rpb24gcmVjcmVhdGVQYXRoKGFyZ3M6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBwYXRoLmpvaW4oX19kaXJuYW1lLCAnJHthcmdzLmpvaW4oJ1xcJywgXFwnJyl9JylgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpOiBSdWxlLk5vZGVMaXN0ZW5lciB7XG4gIHJldHVybiB7XG4gICAgQ2FsbEV4cHJlc3Npb24obm9kZTogYW55KSB7XG4gICAgICBpZiAoaXNQYXRoSm9pbkZ1bmNDYWxsKG5vZGUpKSB7XG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBFUlJPUjogdGhpcyBpcyAncGF0aC5qb2luKCknXG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiAnXFwncGF0aC5qb2luKClcXCcgaXMgbm90IGEgdmFsaWQgcGF0aC4gWW91IG11c3Qgc3BlY2lmeSBhcmd1bWVudHMgaW50byB0aGUgZnVuY3Rpb24uJ30pXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFub0FyZ3VtZW50VmFyaWFibGVzKG5vZGUpKSB7XG4gICAgICAgICAgLy8gV0FSTklORzogdW5leHBlY3RlZCBub24tc3RyaW5nIGluIHRoZSBhcmd1bWVudCBsaXN0LiBUaGlzIGhhcHBlbnMgaWYgcGFydCBvZiB0aGUgYXJndW1lbnQgbGlzdCBpcyBhIHZhcmlhYmxlLCBpLmUuIGBwYXRoLmpvaW4oX19kaXJuYW1lLCBteVBhdGgpYC5cbiAgICAgICAgICAvLyBXZSBtYXkgYmUgYWJsZSB0byBkbyBzb21ldGhpbmcgYWJvdXQgdGhpcywgYnV0IHdlIGN1cnJlbnRseSBhcmUganVzdCBnb2luZyB0byBsZXQgaXQgcGFzcy5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBjdXJyZW50bHkgZG8gbm90IGxpbnQgYW55IHBhdGguam9pbiB3aXRob3V0ICdfX2Rpcm5hbWUnIGFzIHRoZSBmaXJzdCBhcmd1bWVudFxuICAgICAgICBpZiAoIWZpcnN0QXJnSXNEaXJuYW1lKG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50TGlzdChub2RlKTtcblxuICAgICAgICBpZiAoaGFzU2xhc2hlcyhhcmdzKSkge1xuICAgICAgICAgIC8vIEVSUk9SOiBUaGlzIHBhdGggbG9va3MgbGlrZSAncGF0aC5qb2luKF9fZGlybmFtZSwgJ2EvYicpJyBhbmQgc2hvdWxkIGJlIGNoYW5nZWQgdG8gJ3BhdGguam9pbihfX2Rpcm5hbWUsICdhJywgJ2InKSdcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IGAke3JlY3JlYXRlUGF0aChhcmdzKX0gaXMgbm90IGEgdmFsaWQgcGF0aC4gSXQgaGFzICcvJyBpbiB0aGUgYXJndW1lbnRzIHdoaWNoIGlzIG5vdCBhbGxvd2VkLiBFYWNoIGRpcmVjdG9yeSBzaG91bGQgYmUgaXRzIG93biBzZXBhcmF0ZSBhcmd1bWVudC5gfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlyc3REb3duRGlyID0gYXJncy5maW5kSW5kZXgoKHApID0+IHAgIT09ICcuLicpO1xuXG4gICAgICAgIC8vIENvbmZpcm0gcGF0aCBkb2VzIG5vdCBoYXZlIGFueSB1bm5lY2Vzc2FyeSAnLi4nIHBhdGhzXG4gICAgICAgIC8vIFRoaXMgYWxsb3dzIHVzIHRvIHZhbGlkYXRlIHN1YnNlcXVlbnQgY2hlY2tzXG4gICAgICAgIGlmIChmaXJzdERvd25EaXIgPiAwICYmIGFyZ3Muc29tZSgocCwgaSkgPT4gcCA9PT0gJy4uJyAmJiBpID4gZmlyc3REb3duRGlyKSkge1xuICAgICAgICAgIC8vIEVSUk9SOiBUaGlzIHBhdGggb3NjaWxsYXRlcyBiZXR3ZWVuIHVwIGFuZCBkb3duIGNvbW1hbmRzXG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBgJHtyZWNyZWF0ZVBhdGgoYXJncyl9IGlzIG5vdCBhIHZhbGlkIHBhdGguIEl0IGdvZXMgYmFja3dhcmRzIGFuZCBmb3J3YXJkcyBhbmQgYmFja3dhcmRzIGFnYWluLCBhbmQgY2FuIGJlIHNpbXBsaWZpZWQuYH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4Y2x1ZGUgdGhlIGNhc2Ugd2hlcmUgdGhlcmUgYXJlIG5vICcuLicgYXQgYWxsIGluIHRoZSBwYXRoIC0tIHRob3NlIGFyZSBuZXZlciBpbnZhbGlkXG4gICAgICAgIGNvbnN0IGN1cnJlbnRGaWxlID0gY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuICAgICAgICBpZiAoZmlyc3REb3duRGlyID4gMCkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlyc3REb3duRGlyOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBqRmlsZSA9IHBhdGguam9pbiguLi5bcGF0aC5kaXJuYW1lKGN1cnJlbnRGaWxlKSwgLi4uYXJncy5zbGljZSgwLCBpKSwgJ3BhY2thZ2UuanNvbiddKTtcbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBqRmlsZSkpIHtcbiAgICAgICAgICAgICAgLy8gRVJST1I6IHRoaXMgcGF0aCB3aWxsIGVuZCB1cCBnb2luZyBvdXQgb2YgdGhlIHBhY2thZ2UuanNvbiBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBgJHtyZWNyZWF0ZVBhdGgoYXJncyl9IGlzIG5vdCBhIHZhbGlkIHBhdGguIEl0IGdvZXMgYmV5b25kIHRoZSBwYXJlbnQgbGlicmFyeSdzIHBhY2thZ2UuanNvbiBmaWxlIHNvIHRoZSBmaWxlIGl0IHBvaW50cyB0byB3aWxsIG5vdCBiZSBhdmFpbGFibGUgYWZ0ZXIgdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQuYH0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=