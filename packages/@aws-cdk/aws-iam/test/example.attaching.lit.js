"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleConstruct = void 0;
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
class ExampleConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const user = new lib_1.User(this, 'MyUser', { password: core_1.SecretValue.plainText('1234') });
        const group = new lib_1.Group(this, 'MyGroup');
        const policy = new lib_1.Policy(this, 'MyPolicy');
        policy.attachToUser(user);
        group.attachInlinePolicy(policy);
    }
}
exports.ExampleConstruct = ExampleConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5hdHRhY2hpbmcubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbXBsZS5hdHRhY2hpbmcubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUE0QztBQUM1QywyQ0FBdUM7QUFDdkMsZ0NBQTZDO0FBRTdDLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixTQUFTO1FBQ1QsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxrQkFBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkYsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLE1BQU0sTUFBTSxHQUFHLElBQUksWUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUVsQztDQUNGO0FBYkQsNENBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBHcm91cCwgUG9saWN5LCBVc2VyIH0gZnJvbSAnLi4vbGliJztcblxuZXhwb3J0IGNsYXNzIEV4YW1wbGVDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vLyAhc2hvd1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcih0aGlzLCAnTXlVc2VyJywgeyBwYXNzd29yZDogU2VjcmV0VmFsdWUucGxhaW5UZXh0KCcxMjM0JykgfSk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAodGhpcywgJ015R3JvdXAnKTtcblxuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBQb2xpY3kodGhpcywgJ015UG9saWN5Jyk7XG4gICAgcG9saWN5LmF0dGFjaFRvVXNlcih1c2VyKTtcbiAgICBncm91cC5hdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5KTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuIl19