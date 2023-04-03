"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aspects = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ASPECTS_SYMBOL = Symbol.for('cdk-aspects');
/**
 * Aspects can be applied to CDK tree scopes and can operate on the tree before
 * synthesis.
 */
class Aspects {
    constructor() {
        this._aspects = [];
    }
    /**
     * Returns the `Aspects` object associated with a construct scope.
     * @param scope The scope for which these aspects will apply.
     */
    static of(scope) {
        let aspects = scope[ASPECTS_SYMBOL];
        if (!aspects) {
            aspects = new Aspects();
            Object.defineProperty(scope, ASPECTS_SYMBOL, {
                value: aspects,
                configurable: false,
                enumerable: false,
            });
        }
        return aspects;
    }
    /**
     * Adds an aspect to apply this scope before synthesis.
     * @param aspect The aspect to add.
     */
    add(aspect) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IAspect(aspect);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.add);
            }
            throw error;
        }
        this._aspects.push(aspect);
    }
    /**
     * The list of aspects which were directly applied on this scope.
     */
    get all() {
        return [...this._aspects];
    }
}
exports.Aspects = Aspects;
_a = JSII_RTTI_SYMBOL_1;
Aspects[_a] = { fqn: "@aws-cdk/core.Aspects", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNwZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXNwZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFZakQ7OztHQUdHO0FBQ0gsTUFBYSxPQUFPO0lBcUJsQjtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0tBQ3BCO0lBdEJEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBaUI7UUFDaEMsSUFBSSxPQUFPLEdBQUksS0FBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUV4QixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7Z0JBQzNDLEtBQUssRUFBRSxPQUFPO2dCQUNkLFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBUUQ7OztPQUdHO0lBQ0ksR0FBRyxDQUFDLE1BQWU7Ozs7Ozs7Ozs7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUI7SUFFRDs7T0FFRztJQUNILElBQVcsR0FBRztRQUNaLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUMzQjs7QUF0Q0gsMEJBdUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5jb25zdCBBU1BFQ1RTX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ2Nkay1hc3BlY3RzJyk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBBc3BlY3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQXNwZWN0IHtcbiAgLyoqXG4gICAqIEFsbCBhc3BlY3RzIGNhbiB2aXNpdCBhbiBJQ29uc3RydWN0XG4gICAqL1xuICB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZDtcbn1cblxuLyoqXG4gKiBBc3BlY3RzIGNhbiBiZSBhcHBsaWVkIHRvIENESyB0cmVlIHNjb3BlcyBhbmQgY2FuIG9wZXJhdGUgb24gdGhlIHRyZWUgYmVmb3JlXG4gKiBzeW50aGVzaXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3BlY3RzIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBBc3BlY3RzYCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIGEgY29uc3RydWN0IHNjb3BlLlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHNjb3BlIGZvciB3aGljaCB0aGVzZSBhc3BlY3RzIHdpbGwgYXBwbHkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9mKHNjb3BlOiBJQ29uc3RydWN0KTogQXNwZWN0cyB7XG4gICAgbGV0IGFzcGVjdHMgPSAoc2NvcGUgYXMgYW55KVtBU1BFQ1RTX1NZTUJPTF07XG4gICAgaWYgKCFhc3BlY3RzKSB7XG4gICAgICBhc3BlY3RzID0gbmV3IEFzcGVjdHMoKTtcblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNjb3BlLCBBU1BFQ1RTX1NZTUJPTCwge1xuICAgICAgICB2YWx1ZTogYXNwZWN0cyxcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFzcGVjdHM7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IF9hc3BlY3RzOiBJQXNwZWN0W107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9hc3BlY3RzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhbiBhc3BlY3QgdG8gYXBwbHkgdGhpcyBzY29wZSBiZWZvcmUgc3ludGhlc2lzLlxuICAgKiBAcGFyYW0gYXNwZWN0IFRoZSBhc3BlY3QgdG8gYWRkLlxuICAgKi9cbiAgcHVibGljIGFkZChhc3BlY3Q6IElBc3BlY3QpIHtcbiAgICB0aGlzLl9hc3BlY3RzLnB1c2goYXNwZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBhc3BlY3RzIHdoaWNoIHdlcmUgZGlyZWN0bHkgYXBwbGllZCBvbiB0aGlzIHNjb3BlLlxuICAgKi9cbiAgcHVibGljIGdldCBhbGwoKTogSUFzcGVjdFtdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2FzcGVjdHNdO1xuICB9XG59Il19