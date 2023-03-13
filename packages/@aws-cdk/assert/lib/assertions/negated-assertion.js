"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegatedAssertion = void 0;
const assertion_1 = require("../assertion");
class NegatedAssertion extends assertion_1.Assertion {
    constructor(negated) {
        super();
        this.negated = negated;
    }
    assertUsing(inspector) {
        return !this.negated.assertUsing(inspector);
    }
    get description() {
        return `not ${this.negated.description}`;
    }
}
exports.NegatedAssertion = NegatedAssertion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVnYXRlZC1hc3NlcnRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZWdhdGVkLWFzc2VydGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBeUM7QUFHekMsTUFBYSxnQkFBc0MsU0FBUSxxQkFBWTtJQUNyRSxZQUE2QixPQUFxQjtRQUNoRCxLQUFLLEVBQUUsQ0FBQztRQURtQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBRWxELENBQUM7SUFFTSxXQUFXLENBQUMsU0FBWTtRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQVcsV0FBVztRQUNwQixPQUFPLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUFaRCw0Q0FZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzc2VydGlvbiB9IGZyb20gJy4uL2Fzc2VydGlvbic7XG5pbXBvcnQgeyBJbnNwZWN0b3IgfSBmcm9tICcuLi9pbnNwZWN0b3InO1xuXG5leHBvcnQgY2xhc3MgTmVnYXRlZEFzc2VydGlvbjxJIGV4dGVuZHMgSW5zcGVjdG9yPiBleHRlbmRzIEFzc2VydGlvbjxJPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbmVnYXRlZDogQXNzZXJ0aW9uPEk+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlcnRVc2luZyhpbnNwZWN0b3I6IEkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubmVnYXRlZC5hc3NlcnRVc2luZyhpbnNwZWN0b3IpO1xuICB9XG5cbiAgcHVibGljIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgbm90ICR7dGhpcy5uZWdhdGVkLmRlc2NyaXB0aW9ufWA7XG4gIH1cbn1cbiJdfQ==