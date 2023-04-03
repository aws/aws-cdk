"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexMatcher = exports.stringLike = void 0;
const assertions_1 = require("@aws-cdk/assertions");
function stringLike(pattern) {
    return new RegexMatcher(new RegExp(pattern));
}
exports.stringLike = stringLike;
class RegexMatcher extends assertions_1.Matcher {
    constructor(pattern, name = 'RegexMatch') {
        super();
        this.pattern = pattern;
        this.name = name;
    }
    test(actual) {
        const result = new assertions_1.MatchResult(actual);
        if (!this.pattern.test(actual)) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Expected ${actual} to match ${this.pattern}`,
            });
        }
        return result;
    }
}
exports.RegexMatcher = RegexMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0RBQTJEO0FBRTNELFNBQWdCLFVBQVUsQ0FBQyxPQUF3QjtJQUNqRCxPQUFPLElBQUksWUFBWSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELGdDQUVDO0FBRUQsTUFBYSxZQUFhLFNBQVEsb0JBQU87SUFDdkMsWUFBNkIsT0FBZSxFQUFrQixPQUFlLFlBQVk7UUFBSSxLQUFLLEVBQUUsQ0FBQztRQUF4RSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQWtCLFNBQUksR0FBSixJQUFJLENBQXVCO0tBQWM7SUFDaEcsSUFBSSxDQUFDLE1BQVc7UUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QixNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsSUFBSTtnQkFDYixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsWUFBWSxNQUFNLGFBQWEsSUFBSSxDQUFDLE9BQU8sRUFBRTthQUN2RCxDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7Q0FDRjtBQWJELG9DQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2hlciwgTWF0Y2hSZXN1bHQgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0xpa2UocGF0dGVybjogc3RyaW5nIHwgUmVnRXhwKTogTWF0Y2hlciB7XG4gIHJldHVybiBuZXcgUmVnZXhNYXRjaGVyKG5ldyBSZWdFeHAocGF0dGVybikpO1xufVxuXG5leHBvcnQgY2xhc3MgUmVnZXhNYXRjaGVyIGV4dGVuZHMgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGF0dGVybjogUmVnRXhwLCBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nID0gJ1JlZ2V4TWF0Y2gnKSB7IHN1cGVyKCk7IH1cbiAgcHVibGljIHRlc3QoYWN0dWFsOiBhbnkpOiBNYXRjaFJlc3VsdCB7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hdGNoUmVzdWx0KGFjdHVhbCk7XG4gICAgaWYgKCF0aGlzLnBhdHRlcm4udGVzdChhY3R1YWwpKSB7XG4gICAgICByZXN1bHQucmVjb3JkRmFpbHVyZSh7XG4gICAgICAgIG1hdGNoZXI6IHRoaXMsXG4gICAgICAgIHBhdGg6IFtdLFxuICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgJHthY3R1YWx9IHRvIG1hdGNoICR7dGhpcy5wYXR0ZXJufWAsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19