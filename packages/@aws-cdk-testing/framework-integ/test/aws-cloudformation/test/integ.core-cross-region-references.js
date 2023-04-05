"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const constructs_1 = require("constructs");
// GIVEN
const app = new aws_cdk_lib_1.App({
    treeMetadata: false,
});
class ProducerStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id, {
            env: {
                region: 'us-east-1',
            },
            crossRegionReferences: true,
        });
        const nested = new aws_cdk_lib_1.NestedStack(this, 'IntegNested');
        this.queue = new aws_sqs_1.Queue(this, 'IntegQueue');
        this.nestedQueue = new aws_sqs_1.Queue(nested, 'NestedIntegQueue');
    }
}
class ConsumerStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            env: {
                region: 'us-east-2',
            },
            crossRegionReferences: true,
        });
        const nested = new aws_cdk_lib_1.NestedStack(this, 'IntegNested');
        props.queues.forEach((queue, i) => {
            new aws_ssm_1.StringParameter(this, 'IntegParameter' + i, {
                parameterName: 'integ-parameter' + i,
                stringValue: queue.queueName,
            });
            new aws_ssm_1.StringParameter(nested, 'IntegNestedParameter' + i, {
                parameterName: 'integ-nested-parameter' + i,
                stringValue: queue.queueName,
            });
        });
    }
}
class TestCase extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        this.producer = new ProducerStack(app, 'cross-region-producer');
        this.testCase = new ConsumerStack(app, 'cross-region-consumer', {
            queues: [this.producer.queue, this.producer.nestedQueue],
        });
    }
}
const testCase1 = new TestCase(app, 'TestCase1');
// THEN
const integ = new integ_tests_alpha_1.IntegTest(app, 'cross-region-references', {
    testCases: [testCase1.testCase],
    stackUpdateWorkflow: false,
});
/**
 * Test that if the references are still in use, deleting the producer
 * stack will fail
 *
 * When the test cleans up it will delete the consumer then the producer, which should
 * test that the parameters are cleaned up correctly.
 */
integ.assertions.awsApiCall('CloudFormation', 'deleteStack', {
    StackName: testCase1.producer.stackName,
}).next(integ.assertions.awsApiCall('CloudFormation', 'describeStacks', {
    StackName: testCase1.producer.stackName,
}).expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Stacks: integ_tests_alpha_1.Match.arrayWith([
        integ_tests_alpha_1.Match.objectLike({
            StackName: testCase1.producer.stackName,
            StackStatus: 'DELETE_FAILED',
        }),
    ]),
})).waitForAssertions());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29yZS1jcm9zcy1yZWdpb24tcmVmZXJlbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvcmUtY3Jvc3MtcmVnaW9uLXJlZmVyZW5jZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBb0Q7QUFDcEQsaURBQXNEO0FBQ3RELDZDQUFrRTtBQUNsRSxrRUFBOEU7QUFDOUUsMkNBQXVDO0FBRXZDLFFBQVE7QUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsWUFBWSxFQUFFLEtBQUs7Q0FDcEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFjLFNBQVEsbUJBQUs7SUFHL0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7YUFDcEI7WUFDRCxxQkFBcUIsRUFBRSxJQUFJO1NBQzVCLENBQUMsQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQUssQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFLRCxNQUFNLGFBQWMsU0FBUSxtQkFBSztJQUMvQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsR0FBRyxLQUFLO1lBQ1IsR0FBRyxFQUFFO2dCQUNILE1BQU0sRUFBRSxXQUFXO2FBQ3BCO1lBQ0QscUJBQXFCLEVBQUUsSUFBSTtTQUM1QixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hDLElBQUkseUJBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEdBQUMsQ0FBQyxFQUFFO2dCQUM1QyxhQUFhLEVBQUUsaUJBQWlCLEdBQUMsQ0FBQztnQkFDbEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTO2FBQzdCLENBQUMsQ0FBQztZQUNILElBQUkseUJBQWUsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLEdBQUMsQ0FBQyxFQUFFO2dCQUNwRCxhQUFhLEVBQUUsd0JBQXdCLEdBQUMsQ0FBQztnQkFDekMsV0FBVyxFQUFFLEtBQUssQ0FBQyxTQUFTO2FBQzdCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxRQUFTLFNBQVEsc0JBQVM7SUFHOUIsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFO1lBQzlELE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1NBQ3pELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUNELE1BQU0sU0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUVqRCxPQUFPO0FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsRUFBRTtJQUMxRCxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQy9CLG1CQUFtQixFQUFFLEtBQUs7Q0FDM0IsQ0FBQyxDQUFDO0FBR0g7Ozs7OztHQU1HO0FBRUgsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFO0lBQzNELFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVM7Q0FDeEMsQ0FBQyxDQUFDLElBQUksQ0FDTCxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRTtJQUM5RCxTQUFTLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTO0NBQ3hDLENBQUMsQ0FBQyxNQUFNLENBQUMsa0NBQWMsQ0FBQyxVQUFVLENBQUM7SUFDbEMsTUFBTSxFQUFFLHlCQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3RCLHlCQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2YsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUztZQUN2QyxXQUFXLEVBQUUsZUFBZTtTQUM3QixDQUFDO0tBQ0gsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQ3hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBRdWV1ZSwgSVF1ZXVlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgeyBTdHJpbmdQYXJhbWV0ZXIgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMsIE5lc3RlZFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0LCBFeHBlY3RlZFJlc3VsdCwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLy8gR0lWRU5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICB0cmVlTWV0YWRhdGE6IGZhbHNlLFxufSk7XG5cbmNsYXNzIFByb2R1Y2VyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBxdWV1ZTogSVF1ZXVlO1xuICBwdWJsaWMgcmVhZG9ubHkgbmVzdGVkUXVldWU6IElRdWV1ZTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayh0aGlzLCAnSW50ZWdOZXN0ZWQnKTtcbiAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKHRoaXMsICdJbnRlZ1F1ZXVlJyk7XG4gICAgdGhpcy5uZXN0ZWRRdWV1ZSA9IG5ldyBRdWV1ZShuZXN0ZWQsICdOZXN0ZWRJbnRlZ1F1ZXVlJyk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIENvbnN1bWVyU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICByZWFkb25seSBxdWV1ZXM6IElRdWV1ZVtdO1xufVxuY2xhc3MgQ29uc3VtZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvbnN1bWVyU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBlbnY6IHtcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTmVzdGVkU3RhY2sodGhpcywgJ0ludGVnTmVzdGVkJyk7XG4gICAgcHJvcHMucXVldWVzLmZvckVhY2goKHF1ZXVlLCBpKSA9PiB7XG4gICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdJbnRlZ1BhcmFtZXRlcicraSwge1xuICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnaW50ZWctcGFyYW1ldGVyJytpLFxuICAgICAgICBzdHJpbmdWYWx1ZTogcXVldWUucXVldWVOYW1lLFxuICAgICAgfSk7XG4gICAgICBuZXcgU3RyaW5nUGFyYW1ldGVyKG5lc3RlZCwgJ0ludGVnTmVzdGVkUGFyYW1ldGVyJytpLCB7XG4gICAgICAgIHBhcmFtZXRlck5hbWU6ICdpbnRlZy1uZXN0ZWQtcGFyYW1ldGVyJytpLFxuICAgICAgICBzdHJpbmdWYWx1ZTogcXVldWUucXVldWVOYW1lLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgVGVzdENhc2UgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgdGVzdENhc2U6IFN0YWNrO1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvZHVjZXI6IFByb2R1Y2VyU3RhY2s7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMucHJvZHVjZXIgPSBuZXcgUHJvZHVjZXJTdGFjayhhcHAsICdjcm9zcy1yZWdpb24tcHJvZHVjZXInKTtcbiAgICB0aGlzLnRlc3RDYXNlID0gbmV3IENvbnN1bWVyU3RhY2soYXBwLCAnY3Jvc3MtcmVnaW9uLWNvbnN1bWVyJywge1xuICAgICAgcXVldWVzOiBbdGhpcy5wcm9kdWNlci5xdWV1ZSwgdGhpcy5wcm9kdWNlci5uZXN0ZWRRdWV1ZV0sXG4gICAgfSk7XG4gIH1cbn1cbmNvbnN0IHRlc3RDYXNlMSA9IG5ldyBUZXN0Q2FzZShhcHAsICdUZXN0Q2FzZTEnKTtcblxuLy8gVEhFTlxuY29uc3QgaW50ZWcgPSBuZXcgSW50ZWdUZXN0KGFwcCwgJ2Nyb3NzLXJlZ2lvbi1yZWZlcmVuY2VzJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZTEudGVzdENhc2VdLFxuICBzdGFja1VwZGF0ZVdvcmtmbG93OiBmYWxzZSxcbn0pO1xuXG5cbi8qKlxuICogVGVzdCB0aGF0IGlmIHRoZSByZWZlcmVuY2VzIGFyZSBzdGlsbCBpbiB1c2UsIGRlbGV0aW5nIHRoZSBwcm9kdWNlclxuICogc3RhY2sgd2lsbCBmYWlsXG4gKlxuICogV2hlbiB0aGUgdGVzdCBjbGVhbnMgdXAgaXQgd2lsbCBkZWxldGUgdGhlIGNvbnN1bWVyIHRoZW4gdGhlIHByb2R1Y2VyLCB3aGljaCBzaG91bGRcbiAqIHRlc3QgdGhhdCB0aGUgcGFyYW1ldGVycyBhcmUgY2xlYW5lZCB1cCBjb3JyZWN0bHkuXG4gKi9cblxuaW50ZWcuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdDbG91ZEZvcm1hdGlvbicsICdkZWxldGVTdGFjaycsIHtcbiAgU3RhY2tOYW1lOiB0ZXN0Q2FzZTEucHJvZHVjZXIuc3RhY2tOYW1lLFxufSkubmV4dChcbiAgaW50ZWcuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdDbG91ZEZvcm1hdGlvbicsICdkZXNjcmliZVN0YWNrcycsIHtcbiAgICBTdGFja05hbWU6IHRlc3RDYXNlMS5wcm9kdWNlci5zdGFja05hbWUsXG4gIH0pLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgICBTdGFja3M6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgU3RhY2tOYW1lOiB0ZXN0Q2FzZTEucHJvZHVjZXIuc3RhY2tOYW1lLFxuICAgICAgICBTdGFja1N0YXR1czogJ0RFTEVURV9GQUlMRUQnLFxuICAgICAgfSksXG4gICAgXSksXG4gIH0pKS53YWl0Rm9yQXNzZXJ0aW9ucygpLFxuKTtcbiJdfQ==