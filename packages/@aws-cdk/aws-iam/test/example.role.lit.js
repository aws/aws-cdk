"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleConstruct = void 0;
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
class ExampleConstruct extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        /// !show
        const role = new lib_1.Role(this, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        role.addToPolicy(new lib_1.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
        }));
    }
}
exports.ExampleConstruct = ExampleConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS5yb2xlLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4YW1wbGUucm9sZS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLGdDQUFpRTtBQUVqRSxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsU0FBUztRQUNULE1BQU0sSUFBSSxHQUFHLElBQUksVUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDcEMsU0FBUyxFQUFFLElBQUksc0JBQWdCLENBQUMsbUJBQW1CLENBQUM7U0FDckQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLHFCQUFlLENBQUM7WUFDbkMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO1NBQ25DLENBQUMsQ0FBQyxDQUFDO0tBRUw7Q0FDRjtBQWZELDRDQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICcuLi9saWInO1xuXG5leHBvcnQgY2xhc3MgRXhhbXBsZUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8vICFzaG93XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHRoaXMsICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgcm9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ2xhbWJkYTpJbnZva2VGdW5jdGlvbiddLFxuICAgIH0pKTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuIl19