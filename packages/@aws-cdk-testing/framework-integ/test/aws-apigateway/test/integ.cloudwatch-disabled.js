"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class Test extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const api = new apigateway.RestApi(this, 'my-api', {
            retainDeployments: true,
        });
        api.root.addMethod('GET'); // must have at least one method or an API definition
    }
}
exports.Test = Test;
const app = new cdk.App();
new integ_tests_alpha_1.IntegTest(app, 'cloudwatch-logs-disabled', {
    testCases: [
        new Test(app, 'default-api'),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWR3YXRjaC1kaXNhYmxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNsb3Vkd2F0Y2gtZGlzYWJsZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCx5REFBeUQ7QUFFekQsTUFBYSxJQUFLLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDakMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ2pELGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxxREFBcUQ7SUFDbEYsQ0FBQztDQUNGO0FBUkQsb0JBUUM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLDBCQUEwQixFQUFFO0lBQzdDLFNBQVMsRUFBRTtRQUNULElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUM7S0FDN0I7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbmV4cG9ydCBjbGFzcyBUZXN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ215LWFwaScsIHtcbiAgICAgIHJldGFpbkRlcGxveW1lbnRzOiB0cnVlLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7IC8vIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgbWV0aG9kIG9yIGFuIEFQSSBkZWZpbml0aW9uXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnY2xvdWR3YXRjaC1sb2dzLWRpc2FibGVkJywge1xuICB0ZXN0Q2FzZXM6IFtcbiAgICBuZXcgVGVzdChhcHAsICdkZWZhdWx0LWFwaScpLFxuICBdLFxufSk7XG4iXX0=