"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteWidget = exports.GRID_WIDTH = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * The width of the grid we're filling
 */
exports.GRID_WIDTH = 24;
/**
 * A real CloudWatch widget that has its own fixed size and remembers its position
 *
 * This is in contrast to other widgets which exist for layout purposes.
 */
class ConcreteWidget {
    constructor(width, height) {
        this.warnings = [];
        this.width = width;
        this.height = height;
        if (this.width > exports.GRID_WIDTH) {
            throw new Error(`Widget is too wide, max ${exports.GRID_WIDTH} units allowed`);
        }
    }
    position(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Copy the warnings from the given metric
     */
    copyMetricWarnings(...ms) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_IMetric(ms);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.copyMetricWarnings);
            }
            throw error;
        }
        this.warnings?.push(...ms.flatMap(m => m.warnings ?? []));
    }
}
_a = JSII_RTTI_SYMBOL_1;
ConcreteWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.ConcreteWidget", version: "0.0.0" };
exports.ConcreteWidget = ConcreteWidget;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBZ0M3Qjs7OztHQUlHO0FBQ0gsTUFBc0IsY0FBYztJQVFsQyxZQUFZLEtBQWEsRUFBRSxNQUFjO1FBRnpCLGFBQVEsR0FBeUIsRUFBRSxDQUFDO1FBR2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxrQkFBVSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLGtCQUFVLGdCQUFnQixDQUFDLENBQUM7U0FDeEU7S0FDRjtJQUVNLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFJRDs7T0FFRztJQUNPLGtCQUFrQixDQUFDLEdBQUcsRUFBYTs7Ozs7Ozs7OztRQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7Ozs7QUE3Qm1CLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1ldHJpYyB9IGZyb20gJy4vbWV0cmljLXR5cGVzJztcblxuLyoqXG4gKiBUaGUgd2lkdGggb2YgdGhlIGdyaWQgd2UncmUgZmlsbGluZ1xuICovXG5leHBvcnQgY29uc3QgR1JJRF9XSURUSCA9IDI0O1xuXG4vKipcbiAqIEEgc2luZ2xlIGRhc2hib2FyZCB3aWRnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJV2lkZ2V0IHtcbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2YgaG9yaXpvbnRhbCBncmlkIHVuaXRzIHRoZSB3aWRnZXQgd2lsbCB0YWtlIHVwXG4gICAqL1xuICByZWFkb25seSB3aWR0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHZlcnRpY2FsIGdyaWQgdW5pdHMgdGhlIHdpZGdldCB3aWxsIHRha2UgdXBcbiAgICovXG4gIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBbnkgd2FybmluZ3MgdGhhdCBhcmUgcHJvZHVjZWQgYXMgYSByZXN1bHQgb2YgcHV0dGluZyB0b2dldGhlciB0aGlzIHdpZGdldFxuICAgKi9cbiAgcmVhZG9ubHkgd2FybmluZ3M/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogUGxhY2UgdGhlIHdpZGdldCBhdCBhIGdpdmVuIHBvc2l0aW9uXG4gICAqL1xuICBwb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgd2lkZ2V0IEpTT04gZm9yIHVzZSBpbiB0aGUgZGFzaGJvYXJkXG4gICAqL1xuICB0b0pzb24oKTogYW55W107XG59XG5cbi8qKlxuICogQSByZWFsIENsb3VkV2F0Y2ggd2lkZ2V0IHRoYXQgaGFzIGl0cyBvd24gZml4ZWQgc2l6ZSBhbmQgcmVtZW1iZXJzIGl0cyBwb3NpdGlvblxuICpcbiAqIFRoaXMgaXMgaW4gY29udHJhc3QgdG8gb3RoZXIgd2lkZ2V0cyB3aGljaCBleGlzdCBmb3IgbGF5b3V0IHB1cnBvc2VzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29uY3JldGVXaWRnZXQgaW1wbGVtZW50cyBJV2lkZ2V0IHtcbiAgcHVibGljIHJlYWRvbmx5IHdpZHRoOiBudW1iZXI7XG4gIHB1YmxpYyByZWFkb25seSBoZWlnaHQ6IG51bWJlcjtcbiAgcHJvdGVjdGVkIHg/OiBudW1iZXI7XG4gIHByb3RlY3RlZCB5PzogbnVtYmVyO1xuXG4gIHB1YmxpYyByZWFkb25seSB3YXJuaW5nczogc3RyaW5nW10gfCB1bmRlZmluZWQgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIGlmICh0aGlzLndpZHRoID4gR1JJRF9XSURUSCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaWRnZXQgaXMgdG9vIHdpZGUsIG1heCAke0dSSURfV0lEVEh9IHVuaXRzIGFsbG93ZWRgKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3QgdG9Kc29uKCk6IGFueVtdO1xuXG4gIC8qKlxuICAgKiBDb3B5IHRoZSB3YXJuaW5ncyBmcm9tIHRoZSBnaXZlbiBtZXRyaWNcbiAgICovXG4gIHByb3RlY3RlZCBjb3B5TWV0cmljV2FybmluZ3MoLi4ubXM6IElNZXRyaWNbXSkge1xuICAgIHRoaXMud2FybmluZ3M/LnB1c2goLi4ubXMuZmxhdE1hcChtID0+IG0ud2FybmluZ3MgPz8gW10pKTtcbiAgfVxufVxuIl19