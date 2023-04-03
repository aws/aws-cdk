"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new opensearch.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
            capacity: {
                masterNodes: 2,
                warmNodes: 2,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-opensearch-ultrawarm');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcub3BlbnNlYXJjaC51bHRyYXdhcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5vcGVuc2VhcmNoLnVsdHJhd2FybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFvRTtBQUVwRSxnRUFBZ0U7QUFFaEUsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNwQyxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLE9BQU8sRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLGlCQUFpQjtZQUNuRCxRQUFRLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7YUFDYjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3JELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIG9wZW5zZWFyY2ggZnJvbSAnYXdzLWNkay1saWIvYXdzLW9wZW5zZWFyY2hzZXJ2aWNlJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBvcGVuc2VhcmNoLkRvbWFpbih0aGlzLCAnRG9tYWluJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgdmVyc2lvbjogb3BlbnNlYXJjaC5FbmdpbmVWZXJzaW9uLkVMQVNUSUNTRUFSQ0hfN18xLFxuICAgICAgY2FwYWNpdHk6IHtcbiAgICAgICAgbWFzdGVyTm9kZXM6IDIsXG4gICAgICAgIHdhcm1Ob2RlczogMixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdjZGstaW50ZWctb3BlbnNlYXJjaC11bHRyYXdhcm0nKTtcbmFwcC5zeW50aCgpO1xuIl19