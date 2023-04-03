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
        if (typeof lastEl === 'object' && lastEl !== null && Object.keys(object_1.dropUndefined(lastEl)).length === 0) {
            return o.slice(0, o.length - 1);
        }
        return o;
    }
}
exports.DropEmptyObjectAtTheEndOfAnArray = DropEmptyObjectAtTheEndOfAnArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcC1lbXB0eS1vYmplY3QtYXQtdGhlLWVuZC1vZi1hbi1hcnJheS10b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyb3AtZW1wdHktb2JqZWN0LWF0LXRoZS1lbmQtb2YtYW4tYXJyYXktdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHFDQUF5QztBQUV6Qzs7Ozs7R0FLRztBQUNILE1BQWEsZ0NBQWdDO0lBRzNDLFlBQTZCLEtBQVU7UUFBVixVQUFLLEdBQUwsS0FBSyxDQUFLO1FBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDOUM7SUFFTSxPQUFPLENBQUMsT0FBNEI7UUFDekMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFFTSxXQUFXLENBQUMsQ0FBTSxFQUFFLFFBQTZCO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTyxDQUFDLENBQUM7U0FBRTtRQUVwQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUUvQixJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEcsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxDQUFDLENBQUM7S0FDVjtDQUNGO0FBdkJELDRFQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IGRyb3BVbmRlZmluZWQgfSBmcm9tICcuL29iamVjdCc7XG5cbi8qKlxuICogQSBUb2tlbiBvYmplY3QgdGhhdCB3aWxsIGRyb3AgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheSBpZiBpdCBpcyBhbiBlbXB0eSBvYmplY3RcbiAqXG4gKiBOZWNlc3NhcnkgdG8gcHJldmVudCBvcHRpb25zIG9iamVjdHMgdGhhdCBvbmx5IGNvbnRhaW4gXCJyZWdpb25cIiBhbmQgXCJhY2NvdW50XCIga2V5c1xuICogdGhhdCBldmFsdWF0ZSB0byBcInVuZGVmaW5lZFwiIGZyb20gc2hvd2luZyB1cCBpbiB0aGUgcmVuZGVyZWQgSlNPTi5cbiAqL1xuZXhwb3J0IGNsYXNzIERyb3BFbXB0eU9iamVjdEF0VGhlRW5kT2ZBbkFycmF5IGltcGxlbWVudHMgY2RrLklSZXNvbHZhYmxlLCBjZGsuSVBvc3RQcm9jZXNzb3Ige1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5jcmVhdGlvblN0YWNrID0gY2RrLmNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShjb250ZXh0OiBjZGsuSVJlc29sdmVDb250ZXh0KSB7XG4gICAgY29udGV4dC5yZWdpc3RlclBvc3RQcm9jZXNzb3IodGhpcyk7XG4gICAgcmV0dXJuIGNvbnRleHQucmVzb2x2ZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBwb3N0UHJvY2VzcyhvOiBhbnksIF9jb250ZXh0OiBjZGsuSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobykpIHsgcmV0dXJuIG87IH1cblxuICAgIGNvbnN0IGxhc3RFbCA9IG9bby5sZW5ndGggLSAxXTtcblxuICAgIGlmICh0eXBlb2YgbGFzdEVsID09PSAnb2JqZWN0JyAmJiBsYXN0RWwgIT09IG51bGwgJiYgT2JqZWN0LmtleXMoZHJvcFVuZGVmaW5lZChsYXN0RWwpKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBvLnNsaWNlKDAsIG8ubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG87XG4gIH1cbn1cbiJdfQ==