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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5hash = void 0;
__exportStar(require("./cfn-parse"), exports);
// Other libraries are going to need this as well
var md5_1 = require("../private/md5");
Object.defineProperty(exports, "md5hash", { enumerable: true, get: function () { return md5_1.md5hash; } });
__exportStar(require("./customize-roles"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUE0QjtBQUM1QixpREFBaUQ7QUFDakQsc0NBQXlDO0FBQWhDLDhGQUFBLE9BQU8sT0FBQTtBQUNoQixvREFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL2Nmbi1wYXJzZSc7XG4vLyBPdGhlciBsaWJyYXJpZXMgYXJlIGdvaW5nIHRvIG5lZWQgdGhpcyBhcyB3ZWxsXG5leHBvcnQgeyBtZDVoYXNoIH0gZnJvbSAnLi4vcHJpdmF0ZS9tZDUnO1xuZXhwb3J0ICogZnJvbSAnLi9jdXN0b21pemUtcm9sZXMnO1xuIl19