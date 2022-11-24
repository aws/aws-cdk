"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmtDiagnostic = void 0;
function fmtDiagnostic(d) {
    return `${catTag(d.cat)} ${d.message}`;
}
exports.fmtDiagnostic = fmtDiagnostic;
function catTag(x) {
    switch (x) {
        case 'error': return ' [error] ';
        case 'warning': return '[warning]';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc3RpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpYWdub3N0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWUEsU0FBZ0IsYUFBYSxDQUFDLENBQWE7SUFDekMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3pDLENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQVMsTUFBTSxDQUFDLENBQXFCO0lBQ25DLFFBQVEsQ0FBQyxFQUFFO1FBQ1QsS0FBSyxPQUFPLENBQUMsQ0FBRyxPQUFPLFdBQVcsQ0FBQztRQUNuQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLE9BQU8sV0FBVyxDQUFDO0tBRXBDO0FBQ0gsQ0FBQyJ9