"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropEmptyObjectAtTheEndOfAnArray = void 0;
const cdk = require("@aws-cdk/core");
const object_1 = require("./object");
/**
 * A Token object that will drop the last element of an array if it is an empty object
 *
 * Necessary to prevent options objects that only contain "region" and "account" keys
 * that evaluate to "undefined" from showing up in the rendered JSON.
 */
class DropEmptyObjectAtTheEndOfAnArray {
    constructor(value) {
        this.value = value;
        this.creationStack = cdk.captureStackTrace();
    }
    resolve(context) {
        context.registerPostProcessor(this);
        return context.resolve(this.value);
    }
    postProcess(o, _context) {
        if (!Array.isArray(o)) {
            return o;
        }
        const lastEl = o[o.length - 1];
        if (typeof lastEl === 'object' && lastEl !== null && Object.keys((0, object_1.dropUndefined)(lastEl)).length === 0) {
            return o.slice(0, o.length - 1);
        }
        return o;
    }
}
exports.DropEmptyObjectAtTheEndOfAnArray = DropEmptyObjectAtTheEndOfAnArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1lbXB0eS1vYmplY3QtYXQtdGhlLWVuZC1vZi1hbi1hcnJheS10b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyb3AtZW1wdHktb2JqZWN0LWF0LXRoZS1lbmQtb2YtYW4tYXJyYXktdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHFDQUF5QztBQUV6Qzs7Ozs7R0FLRztBQUNILE1BQWEsZ0NBQWdDO0lBRzNDLFlBQTZCLEtBQVU7UUFBVixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDOUM7SUFFTSxPQUFPLENBQUMsT0FBNEI7UUFDekMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFFTSxXQUFXLENBQUMsQ0FBTSxFQUFFLFFBQTZCO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTyxDQUFDLENBQUM7U0FBRTtRQUVwQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUUvQixJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBQSxzQkFBYSxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwRyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDakM7UUFFRCxPQUFPLENBQUMsQ0FBQztLQUNWO0NBQ0Y7QUF2QkQsNEVBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgZHJvcFVuZGVmaW5lZCB9IGZyb20gJy4vb2JqZWN0JztcblxuLyoqXG4gKiBBIFRva2VuIG9iamVjdCB0aGF0IHdpbGwgZHJvcCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5IGlmIGl0IGlzIGFuIGVtcHR5IG9iamVjdFxuICpcbiAqIE5lY2Vzc2FyeSB0byBwcmV2ZW50IG9wdGlvbnMgb2JqZWN0cyB0aGF0IG9ubHkgY29udGFpbiBcInJlZ2lvblwiIGFuZCBcImFjY291bnRcIiBrZXlzXG4gKiB0aGF0IGV2YWx1YXRlIHRvIFwidW5kZWZpbmVkXCIgZnJvbSBzaG93aW5nIHVwIGluIHRoZSByZW5kZXJlZCBKU09OLlxuICovXG5leHBvcnQgY2xhc3MgRHJvcEVtcHR5T2JqZWN0QXRUaGVFbmRPZkFuQXJyYXkgaW1wbGVtZW50cyBjZGsuSVJlc29sdmFibGUsIGNkay5JUG9zdFByb2Nlc3NvciB7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjZGsuY2FwdHVyZVN0YWNrVHJhY2UoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlKGNvbnRleHQ6IGNkay5JUmVzb2x2ZUNvbnRleHQpIHtcbiAgICBjb250ZXh0LnJlZ2lzdGVyUG9zdFByb2Nlc3Nvcih0aGlzKTtcbiAgICByZXR1cm4gY29udGV4dC5yZXNvbHZlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHBvc3RQcm9jZXNzKG86IGFueSwgX2NvbnRleHQ6IGNkay5JUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShvKSkgeyByZXR1cm4gbzsgfVxuXG4gICAgY29uc3QgbGFzdEVsID0gb1tvLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKHR5cGVvZiBsYXN0RWwgPT09ICdvYmplY3QnICYmIGxhc3RFbCAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyhkcm9wVW5kZWZpbmVkKGxhc3RFbCkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG8uc2xpY2UoMCwgby5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbztcbiAgfVxufVxuIl19