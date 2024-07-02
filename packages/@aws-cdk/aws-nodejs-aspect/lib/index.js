"use strict";
// The index.ts files contains a list of files we want to
// include as part of the public API of this module.
// In general, all files including L2 classes will be listed here,
// while all files including only utility functions will be omitted from here.
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
// obviously, the ExampleResource L2 should be exported
__exportStar(require("./nodejs-aspect"), exports);
// notice that private/example-resource-common.ts is not exported!
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseURBQXlEO0FBQ3pELG9EQUFvRDtBQUNwRCxrRUFBa0U7QUFDbEUsOEVBQThFOzs7Ozs7Ozs7Ozs7Ozs7O0FBRTlFLHVEQUF1RDtBQUN2RCxrREFBZ0M7QUFFaEMsa0VBQWtFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIGluZGV4LnRzIGZpbGVzIGNvbnRhaW5zIGEgbGlzdCBvZiBmaWxlcyB3ZSB3YW50IHRvXG4vLyBpbmNsdWRlIGFzIHBhcnQgb2YgdGhlIHB1YmxpYyBBUEkgb2YgdGhpcyBtb2R1bGUuXG4vLyBJbiBnZW5lcmFsLCBhbGwgZmlsZXMgaW5jbHVkaW5nIEwyIGNsYXNzZXMgd2lsbCBiZSBsaXN0ZWQgaGVyZSxcbi8vIHdoaWxlIGFsbCBmaWxlcyBpbmNsdWRpbmcgb25seSB1dGlsaXR5IGZ1bmN0aW9ucyB3aWxsIGJlIG9taXR0ZWQgZnJvbSBoZXJlLlxuXG4vLyBvYnZpb3VzbHksIHRoZSBFeGFtcGxlUmVzb3VyY2UgTDIgc2hvdWxkIGJlIGV4cG9ydGVkXG5leHBvcnQgKiBmcm9tICcuL25vZGVqcy1hc3BlY3QnO1xuXG4vLyBub3RpY2UgdGhhdCBwcml2YXRlL2V4YW1wbGUtcmVzb3VyY2UtY29tbW9uLnRzIGlzIG5vdCBleHBvcnRlZCFcbiJdfQ==