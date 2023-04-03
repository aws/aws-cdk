"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./certificate"), exports);
__exportStar(require("./dns-validated-certificate"), exports);
__exportStar(require("./private-certificate"), exports);
__exportStar(require("./util"), exports);
// AWS::CertificateManager CloudFormation Resources:
__exportStar(require("./certificatemanager.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxnREFBOEI7QUFDOUIsOERBQTRDO0FBQzVDLHdEQUFzQztBQUN0Qyx5Q0FBdUI7QUFFdkIsb0RBQW9EO0FBQ3BELGlFQUErQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vY2VydGlmaWNhdGUnO1xuZXhwb3J0ICogZnJvbSAnLi9kbnMtdmFsaWRhdGVkLWNlcnRpZmljYXRlJztcbmV4cG9ydCAqIGZyb20gJy4vcHJpdmF0ZS1jZXJ0aWZpY2F0ZSc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWwnO1xuXG4vLyBBV1M6OkNlcnRpZmljYXRlTWFuYWdlciBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZXM6XG5leHBvcnQgKiBmcm9tICcuL2NlcnRpZmljYXRlbWFuYWdlci5nZW5lcmF0ZWQnO1xuIl19