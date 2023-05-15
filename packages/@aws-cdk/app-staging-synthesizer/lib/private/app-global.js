"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppScopedGlobal = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
/**
 * Hold an App-wide global variable
 *
 * This is a replacement for a `static` variable, but does the right thing in case people
 * instantiate multiple Apps in the same process space (for example, in unit tests or
 * people using `cli-lib` in advanced configurations).
 *
 * This class assumes that the global you're going to be storing is a mutable object.
 */
class AppScopedGlobal {
    constructor(factory) {
        this.factory = factory;
        this.map = new WeakMap();
    }
    for(ctr) {
        const app = aws_cdk_lib_1.App.of(ctr);
        if (!aws_cdk_lib_1.App.isApp(app)) {
            throw new Error(`Construct ${ctr.node.path} must be part of an App`);
        }
        const existing = this.map.get(app);
        if (existing) {
            return existing;
        }
        const instance = this.factory();
        this.map.set(app, instance);
        return instance;
    }
}
exports.AppScopedGlobal = AppScopedGlobal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWdsb2JhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1nbG9iYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWtDO0FBR2xDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxlQUFlO0lBRzFCLFlBQTZCLE9BQWdCO1FBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFGNUIsUUFBRyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7SUFHN0MsQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUFlO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLGlCQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxpQkFBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLHlCQUF5QixDQUFDLENBQUM7U0FDdEU7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLFFBQVEsRUFBRTtZQUNaLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO1FBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QixPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUFwQkQsMENBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIEhvbGQgYW4gQXBwLXdpZGUgZ2xvYmFsIHZhcmlhYmxlXG4gKlxuICogVGhpcyBpcyBhIHJlcGxhY2VtZW50IGZvciBhIGBzdGF0aWNgIHZhcmlhYmxlLCBidXQgZG9lcyB0aGUgcmlnaHQgdGhpbmcgaW4gY2FzZSBwZW9wbGVcbiAqIGluc3RhbnRpYXRlIG11bHRpcGxlIEFwcHMgaW4gdGhlIHNhbWUgcHJvY2VzcyBzcGFjZSAoZm9yIGV4YW1wbGUsIGluIHVuaXQgdGVzdHMgb3JcbiAqIHBlb3BsZSB1c2luZyBgY2xpLWxpYmAgaW4gYWR2YW5jZWQgY29uZmlndXJhdGlvbnMpLlxuICpcbiAqIFRoaXMgY2xhc3MgYXNzdW1lcyB0aGF0IHRoZSBnbG9iYWwgeW91J3JlIGdvaW5nIHRvIGJlIHN0b3JpbmcgaXMgYSBtdXRhYmxlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwcFNjb3BlZEdsb2JhbDxBPiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gbmV3IFdlYWtNYXA8QXBwLCBBPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZmFjdG9yeTogKCkgPT4gQSkge1xuICB9XG5cbiAgcHVibGljIGZvcihjdHI6IElDb25zdHJ1Y3QpOiBBIHtcbiAgICBjb25zdCBhcHAgPSBBcHAub2YoY3RyKTtcbiAgICBpZiAoIUFwcC5pc0FwcChhcHApKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbnN0cnVjdCAke2N0ci5ub2RlLnBhdGh9IG11c3QgYmUgcGFydCBvZiBhbiBBcHBgKTtcbiAgICB9XG5cbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMubWFwLmdldChhcHApO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgcmV0dXJuIGV4aXN0aW5nO1xuICAgIH1cbiAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZmFjdG9yeSgpO1xuICAgIHRoaXMubWFwLnNldChhcHAsIGluc3RhbmNlKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cbn1cbiJdfQ==