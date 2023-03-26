"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleConstruct = void 0;
const constructs_1 = require("constructs");
const iam = require("../lib");
class ExampleConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const role = new iam.Role(this, 'MyRole', {
            assumedBy: new iam.AccountPrincipal('123456789012'),
            externalIds: ['SUPPLY-ME'],
        });
        /// !hide
        Array.isArray(role);
    }
}
exports.ExampleConstruct = ExampleConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5leHRlcm5hbC1pZC5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGFtcGxlLmV4dGVybmFsLWlkLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMsOEJBQThCO0FBRTlCLE1BQWEsZ0JBQWlCLFNBQVEsc0JBQVM7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixTQUFTO1FBQ1QsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDeEMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztZQUNuRCxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsU0FBUztRQUVULEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckI7Q0FDRjtBQWJELDRDQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnLi4vbGliJztcblxuZXhwb3J0IGNsYXNzIEV4YW1wbGVDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vLyAhc2hvd1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcxMjM0NTY3ODkwMTInKSxcbiAgICAgIGV4dGVybmFsSWRzOiBbJ1NVUFBMWS1NRSddLFxuICAgIH0pO1xuICAgIC8vLyAhaGlkZVxuXG4gICAgQXJyYXkuaXNBcnJheShyb2xlKTtcbiAgfVxufVxuIl19