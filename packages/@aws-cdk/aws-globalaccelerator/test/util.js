"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFixture = void 0;
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
function testFixture() {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'VPC');
    return { stack, vpc, app };
}
exports.testFixture = testFixture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdDO0FBQ3hDLHdDQUEyQztBQUUzQyxTQUFnQixXQUFXO0lBQ3pCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdEMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDN0IsQ0FBQztBQU5ELGtDQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdEZpeHR1cmUoKSB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcblxuICByZXR1cm4geyBzdGFjaywgdnBjLCBhcHAgfTtcbn0iXX0=