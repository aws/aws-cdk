"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const intrinsic_1 = require("./private/intrinsic");
const REFERENCE_SYMBOL = Symbol.for('@aws-cdk/core.Reference');
/**
 * An intrinsic Token that represents a reference to a construct.
 *
 * References are recorded.
 */
class Reference extends intrinsic_1.Intrinsic {
    /**
     * Check whether this is actually a Reference
     */
    static isReference(x) {
        return typeof x === 'object' && x !== null && REFERENCE_SYMBOL in x;
    }
    constructor(value, target, displayName, typeHint) {
        super(value, { typeHint });
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ResolutionTypeHint(typeHint);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Reference);
            }
            throw error;
        }
        Object.defineProperty(this, REFERENCE_SYMBOL, { value: true });
        this.target = target;
        this.displayName = displayName || 'Reference';
    }
}
_a = JSII_RTTI_SYMBOL_1;
Reference[_a] = { fqn: "@aws-cdk/core.Reference", version: "0.0.0" };
exports.Reference = Reference;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVmZXJlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG1EQUFnRDtBQUdoRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUUvRDs7OztHQUlHO0FBQ0gsTUFBc0IsU0FBVSxTQUFRLHFCQUFTO0lBQy9DOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFNO1FBQzlCLE9BQU8sT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksZ0JBQWdCLElBQUksQ0FBQyxDQUFDO0tBQ3JFO0lBS0QsWUFBWSxLQUFVLEVBQUUsTUFBa0IsRUFBRSxXQUFvQixFQUFFLFFBQTZCO1FBQzdGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBWlQsU0FBUzs7OztRQWEzQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxJQUFJLFdBQVcsQ0FBQztLQUMvQzs7OztBQWhCbUIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJbnRyaW5zaWMgfSBmcm9tICcuL3ByaXZhdGUvaW50cmluc2ljJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4vdHlwZS1oaW50cyc7XG5cbmNvbnN0IFJFRkVSRU5DRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLlJlZmVyZW5jZScpO1xuXG4vKipcbiAqIEFuIGludHJpbnNpYyBUb2tlbiB0aGF0IHJlcHJlc2VudHMgYSByZWZlcmVuY2UgdG8gYSBjb25zdHJ1Y3QuXG4gKlxuICogUmVmZXJlbmNlcyBhcmUgcmVjb3JkZWQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWZlcmVuY2UgZXh0ZW5kcyBJbnRyaW5zaWMge1xuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGlzIGlzIGFjdHVhbGx5IGEgUmVmZXJlbmNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzUmVmZXJlbmNlKHg6IGFueSk6IHggaXMgUmVmZXJlbmNlIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGwgJiYgUkVGRVJFTkNFX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHRhcmdldDogSUNvbnN0cnVjdDtcbiAgcHVibGljIHJlYWRvbmx5IGRpc3BsYXlOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGFyZ2V0OiBJQ29uc3RydWN0LCBkaXNwbGF5TmFtZT86IHN0cmluZywgdHlwZUhpbnQ/OiBSZXNvbHV0aW9uVHlwZUhpbnQpIHtcbiAgICBzdXBlcih2YWx1ZSwgeyB0eXBlSGludCB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgUkVGRVJFTkNFX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWUgfHwgJ1JlZmVyZW5jZSc7XG4gIH1cbn1cblxuIl19