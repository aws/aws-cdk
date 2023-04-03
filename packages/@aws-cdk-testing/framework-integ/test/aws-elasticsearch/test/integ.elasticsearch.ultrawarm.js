"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const es = require("aws-cdk-lib/aws-elasticsearch");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new es.Domain(this, 'Domain', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            version: es.ElasticsearchVersion.V7_1,
            capacity: {
                masterNodes: 2,
                warmNodes: 2,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-elasticsearch-ultrawarm');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxhc3RpY3NlYXJjaC51bHRyYXdhcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5lbGFzdGljc2VhcmNoLnVsdHJhd2FybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFvRTtBQUVwRSxvREFBb0Q7QUFFcEQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUM1QixhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLE9BQU8sRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSTtZQUNyQyxRQUFRLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7YUFDYjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3hELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGVzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lbGFzdGljc2VhcmNoJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBlcy5Eb21haW4odGhpcywgJ0RvbWFpbicsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHZlcnNpb246IGVzLkVsYXN0aWNzZWFyY2hWZXJzaW9uLlY3XzEsXG4gICAgICBjYXBhY2l0eToge1xuICAgICAgICBtYXN0ZXJOb2RlczogMixcbiAgICAgICAgd2FybU5vZGVzOiAyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1lbGFzdGljc2VhcmNoLXVsdHJhd2FybScpO1xuYXBwLnN5bnRoKCk7XG4iXX0=