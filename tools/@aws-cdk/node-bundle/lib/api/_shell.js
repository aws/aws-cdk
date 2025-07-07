"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shell = shell;
const child_process = __importStar(require("child_process"));
function shell(command, options = {}) {
    const stdio = options.quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'];
    const buffer = child_process.execSync(command, {
        cwd: options.cwd,
        stdio: stdio,
    });
    return buffer ? buffer.toString('utf-8').trim() : '';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoZWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9fc2hlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLHNCQU9DO0FBZEQsNkRBQStDO0FBTy9DLFNBQWdCLEtBQUssQ0FBQyxPQUFlLEVBQUUsVUFBd0IsRUFBRTtJQUMvRCxNQUFNLEtBQUssR0FBK0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEgsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDN0MsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1FBQ2hCLEtBQUssRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuZXhwb3J0IGludGVyZmFjZSBTaGVsbE9wdGlvbnMge1xuICByZWFkb25seSBjd2Q/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHF1aWV0PzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNoZWxsKGNvbW1hbmQ6IHN0cmluZywgb3B0aW9uczogU2hlbGxPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICBjb25zdCBzdGRpbzogY2hpbGRfcHJvY2Vzcy5TdGRpb09wdGlvbnMgPSBvcHRpb25zLnF1aWV0ID8gWydpZ25vcmUnLCAncGlwZScsICdwaXBlJ10gOiBbJ2lnbm9yZScsICdpbmhlcml0JywgJ2luaGVyaXQnXTtcbiAgY29uc3QgYnVmZmVyID0gY2hpbGRfcHJvY2Vzcy5leGVjU3luYyhjb21tYW5kLCB7XG4gICAgY3dkOiBvcHRpb25zLmN3ZCxcbiAgICBzdGRpbzogc3RkaW8sXG4gIH0pO1xuICByZXR1cm4gYnVmZmVyID8gYnVmZmVyLnRvU3RyaW5nKCd1dGYtOCcpLnRyaW0oKSA6ICcnO1xufVxuIl19