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
exports.ConcreteWidget = ConcreteWidget;
_a = JSII_RTTI_SYMBOL_1;
ConcreteWidget[_a] = { fqn: "@aws-cdk/aws-cloudwatch.ConcreteWidget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBZ0M3Qjs7OztHQUlHO0FBQ0gsTUFBc0IsY0FBYztJQVFsQyxZQUFZLEtBQWEsRUFBRSxNQUFjO1FBRnpCLGFBQVEsR0FBeUIsRUFBRSxDQUFDO1FBR2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxrQkFBVSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLGtCQUFVLGdCQUFnQixDQUFDLENBQUM7U0FDeEU7S0FDRjtJQUVNLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUNsQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFJRDs7T0FFRztJQUNPLGtCQUFrQixDQUFDLEdBQUcsRUFBYTs7Ozs7Ozs7OztRQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7O0FBN0JILHdDQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNZXRyaWMgfSBmcm9tICcuL21ldHJpYy10eXBlcyc7XG5cbi8qKlxuICogVGhlIHdpZHRoIG9mIHRoZSBncmlkIHdlJ3JlIGZpbGxpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEdSSURfV0lEVEggPSAyNDtcblxuLyoqXG4gKiBBIHNpbmdsZSBkYXNoYm9hcmQgd2lkZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVdpZGdldCB7XG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIGhvcml6b250YWwgZ3JpZCB1bml0cyB0aGUgd2lkZ2V0IHdpbGwgdGFrZSB1cFxuICAgKi9cbiAgcmVhZG9ubHkgd2lkdGg6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiB2ZXJ0aWNhbCBncmlkIHVuaXRzIHRoZSB3aWRnZXQgd2lsbCB0YWtlIHVwXG4gICAqL1xuICByZWFkb25seSBoZWlnaHQ6IG51bWJlcjtcblxuICAvKipcbiAgICogQW55IHdhcm5pbmdzIHRoYXQgYXJlIHByb2R1Y2VkIGFzIGEgcmVzdWx0IG9mIHB1dHRpbmcgdG9nZXRoZXIgdGhpcyB3aWRnZXRcbiAgICovXG4gIHJlYWRvbmx5IHdhcm5pbmdzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFBsYWNlIHRoZSB3aWRnZXQgYXQgYSBnaXZlbiBwb3NpdGlvblxuICAgKi9cbiAgcG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHdpZGdldCBKU09OIGZvciB1c2UgaW4gdGhlIGRhc2hib2FyZFxuICAgKi9cbiAgdG9Kc29uKCk6IGFueVtdO1xufVxuXG4vKipcbiAqIEEgcmVhbCBDbG91ZFdhdGNoIHdpZGdldCB0aGF0IGhhcyBpdHMgb3duIGZpeGVkIHNpemUgYW5kIHJlbWVtYmVycyBpdHMgcG9zaXRpb25cbiAqXG4gKiBUaGlzIGlzIGluIGNvbnRyYXN0IHRvIG90aGVyIHdpZGdldHMgd2hpY2ggZXhpc3QgZm9yIGxheW91dCBwdXJwb3Nlcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbmNyZXRlV2lkZ2V0IGltcGxlbWVudHMgSVdpZGdldCB7XG4gIHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgaGVpZ2h0OiBudW1iZXI7XG4gIHByb3RlY3RlZCB4PzogbnVtYmVyO1xuICBwcm90ZWN0ZWQgeT86IG51bWJlcjtcblxuICBwdWJsaWMgcmVhZG9ubHkgd2FybmluZ3M6IHN0cmluZ1tdIHwgdW5kZWZpbmVkID0gW107XG5cbiAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBpZiAodGhpcy53aWR0aCA+IEdSSURfV0lEVEgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgV2lkZ2V0IGlzIHRvbyB3aWRlLCBtYXggJHtHUklEX1dJRFRIfSB1bml0cyBhbGxvd2VkYCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IHRvSnNvbigpOiBhbnlbXTtcblxuICAvKipcbiAgICogQ29weSB0aGUgd2FybmluZ3MgZnJvbSB0aGUgZ2l2ZW4gbWV0cmljXG4gICAqL1xuICBwcm90ZWN0ZWQgY29weU1ldHJpY1dhcm5pbmdzKC4uLm1zOiBJTWV0cmljW10pIHtcbiAgICB0aGlzLndhcm5pbmdzPy5wdXNoKC4uLm1zLmZsYXRNYXAobSA9PiBtLndhcm5pbmdzID8/IFtdKSk7XG4gIH1cbn1cbiJdfQ==