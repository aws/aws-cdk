"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsentMatch = void 0;
const matcher_1 = require("../../matcher");
class AbsentMatch extends matcher_1.Matcher {
    constructor(name) {
        super();
        this.name = name;
    }
    test(actual) {
        const result = new matcher_1.MatchResult(actual);
        if (actual !== undefined) {
            result.recordFailure({
                matcher: this,
                path: [],
                message: `Received ${actual}, but key should be absent`,
            });
        }
        return result;
    }
}
exports.AbsentMatch = AbsentMatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWJzZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFxRDtBQUVyRCxNQUFhLFdBQVksU0FBUSxpQkFBTztJQUN0QyxZQUE0QixJQUFZO1FBQ3RDLEtBQUssRUFBRSxDQUFDO1FBRGtCLFNBQUksR0FBSixJQUFJLENBQVE7S0FFdkM7SUFFTSxJQUFJLENBQUMsTUFBVztRQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxFQUFFO2dCQUNSLE9BQU8sRUFBRSxZQUFZLE1BQU0sNEJBQTRCO2FBQ3hELENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjtDQUNGO0FBaEJELGtDQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoZXIsIE1hdGNoUmVzdWx0IH0gZnJvbSAnLi4vLi4vbWF0Y2hlcic7XG5cbmV4cG9ydCBjbGFzcyBBYnNlbnRNYXRjaCBleHRlbmRzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0ZXN0KGFjdHVhbDogYW55KTogTWF0Y2hSZXN1bHQge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXRjaFJlc3VsdChhY3R1YWwpO1xuICAgIGlmIChhY3R1YWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0LnJlY29yZEZhaWx1cmUoe1xuICAgICAgICBtYXRjaGVyOiB0aGlzLFxuICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgbWVzc2FnZTogYFJlY2VpdmVkICR7YWN0dWFsfSwgYnV0IGtleSBzaG91bGQgYmUgYWJzZW50YCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59Il19