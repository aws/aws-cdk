"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitiveType = exports.PrimitiveType = void 0;
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType["String"] = "String";
    PrimitiveType["Long"] = "Long";
    PrimitiveType["Integer"] = "Integer";
    PrimitiveType["Double"] = "Double";
    PrimitiveType["Boolean"] = "Boolean";
    PrimitiveType["Timestamp"] = "Timestamp";
    PrimitiveType["Json"] = "Json";
})(PrimitiveType || (exports.PrimitiveType = PrimitiveType = {}));
function isPrimitiveType(str) {
    switch (str) {
        case PrimitiveType.String:
        case PrimitiveType.Long:
        case PrimitiveType.Integer:
        case PrimitiveType.Double:
        case PrimitiveType.Boolean:
        case PrimitiveType.Timestamp:
        case PrimitiveType.Json:
            return true;
        default:
            return false;
    }
}
exports.isPrimitiveType = isPrimitiveType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2UtdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsSUFBWSxhQVFYO0FBUkQsV0FBWSxhQUFhO0lBQ3ZCLGtDQUFpQixDQUFBO0lBQ2pCLDhCQUFhLENBQUE7SUFDYixvQ0FBbUIsQ0FBQTtJQUNuQixrQ0FBaUIsQ0FBQTtJQUNqQixvQ0FBbUIsQ0FBQTtJQUNuQix3Q0FBdUIsQ0FBQTtJQUN2Qiw4QkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQVJXLGFBQWEsNkJBQWIsYUFBYSxRQVF4QjtBQUVELFNBQWdCLGVBQWUsQ0FBQyxHQUFXO0lBQ3pDLFFBQVEsR0FBRyxFQUFFO1FBQ1gsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQzFCLEtBQUssYUFBYSxDQUFDLElBQUksQ0FBQztRQUN4QixLQUFLLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDM0IsS0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDO1FBQzFCLEtBQUssYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUMzQixLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDN0IsS0FBSyxhQUFhLENBQUMsSUFBSTtZQUNyQixPQUFPLElBQUksQ0FBQztRQUNkO1lBQ0UsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDSCxDQUFDO0FBYkQsMENBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIERvY3VtZW50ZWQge1xuICAvKiogQSBsaW5rIHRvIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gVXNlciBHdWlkZSB0aGF0IHByb3ZpZGVzIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgZW50aXR5LiAqL1xuICBEb2N1bWVudGF0aW9uPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZW51bSBQcmltaXRpdmVUeXBlIHtcbiAgU3RyaW5nID0gJ1N0cmluZycsXG4gIExvbmcgPSAnTG9uZycsXG4gIEludGVnZXIgPSAnSW50ZWdlcicsXG4gIERvdWJsZSA9ICdEb3VibGUnLFxuICBCb29sZWFuID0gJ0Jvb2xlYW4nLFxuICBUaW1lc3RhbXAgPSAnVGltZXN0YW1wJyxcbiAgSnNvbiA9ICdKc29uJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmVUeXBlKHN0cjogc3RyaW5nKTogc3RyIGlzIFByaW1pdGl2ZVR5cGUge1xuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgUHJpbWl0aXZlVHlwZS5TdHJpbmc6XG4gICAgY2FzZSBQcmltaXRpdmVUeXBlLkxvbmc6XG4gICAgY2FzZSBQcmltaXRpdmVUeXBlLkludGVnZXI6XG4gICAgY2FzZSBQcmltaXRpdmVUeXBlLkRvdWJsZTpcbiAgICBjYXNlIFByaW1pdGl2ZVR5cGUuQm9vbGVhbjpcbiAgICBjYXNlIFByaW1pdGl2ZVR5cGUuVGltZXN0YW1wOlxuICAgIGNhc2UgUHJpbWl0aXZlVHlwZS5Kc29uOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19