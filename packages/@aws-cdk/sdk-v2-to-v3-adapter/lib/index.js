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
exports.normalizeActionName = exports.normalizeServiceName = exports.findV3ClientConstructor = exports.coerceApiParameters = void 0;
var coerce_api_parameters_1 = require("./coerce-api-parameters");
Object.defineProperty(exports, "coerceApiParameters", { enumerable: true, get: function () { return coerce_api_parameters_1.coerceApiParameters; } });
var find_client_constructor_1 = require("./find-client-constructor");
Object.defineProperty(exports, "findV3ClientConstructor", { enumerable: true, get: function () { return find_client_constructor_1.findV3ClientConstructor; } });
var sdk_info_1 = require("./sdk-info");
Object.defineProperty(exports, "normalizeServiceName", { enumerable: true, get: function () { return sdk_info_1.normalizeServiceName; } });
Object.defineProperty(exports, "normalizeActionName", { enumerable: true, get: function () { return sdk_info_1.normalizeActionName; } });
__exportStar(require("./api-call"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlFQUE4RDtBQUFyRCw0SEFBQSxtQkFBbUIsT0FBQTtBQUM1QixxRUFBb0U7QUFBM0Qsa0lBQUEsdUJBQXVCLE9BQUE7QUFDaEMsdUNBQXVFO0FBQTlELGdIQUFBLG9CQUFvQixPQUFBO0FBQUUsK0dBQUEsbUJBQW1CLE9BQUE7QUFDbEQsNkNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgY29lcmNlQXBpUGFyYW1ldGVycyB9IGZyb20gJy4vY29lcmNlLWFwaS1wYXJhbWV0ZXJzJztcbmV4cG9ydCB7IGZpbmRWM0NsaWVudENvbnN0cnVjdG9yIH0gZnJvbSAnLi9maW5kLWNsaWVudC1jb25zdHJ1Y3Rvcic7XG5leHBvcnQgeyBub3JtYWxpemVTZXJ2aWNlTmFtZSwgbm9ybWFsaXplQWN0aW9uTmFtZSB9IGZyb20gJy4vc2RrLWluZm8nO1xuZXhwb3J0ICogZnJvbSAnLi9hcGktY2FsbCc7XG4iXX0=