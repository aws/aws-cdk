"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainStackApp = exports.BucketStack = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
/// !cdk-integ VarablePipelineStack pragma:set-context:@aws-cdk/core:newStyleStackSynthesis=true
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const pipelines = require("aws-cdk-lib/pipelines");
/**
 * A test stack
 *
 * It contains a single Bucket. Such robust. Much uptime.
 */
class BucketStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.bucket = new s3.Bucket(this, 'Bucket');
    }
}
exports.BucketStack = BucketStack;
class PlainStackApp extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        new BucketStack(this, 'Stack');
    }
}
exports.PlainStackApp = PlainStackApp;
class MyStage extends aws_cdk_lib_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stack = new aws_cdk_lib_1.Stack(this, 'Stack', {
            ...props,
            synthesizer: new aws_cdk_lib_1.DefaultStackSynthesizer(),
        });
        new PlainStackApp(stack, 'MyApp');
    }
}
class PipelineStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.s3(sourceBucket, 'key'),
                // input: pipelines.CodePipelineSource.gitHub('cdklabs/construct-hub-probe', 'main', {
                //   trigger: GitHubTrigger.POLL,
                // }),
                commands: ['mkdir cdk.out', 'touch cdk.out/dummy'],
            }),
            selfMutation: false,
            useChangeSets: false,
        });
        pipeline.addStage(new MyStage(this, 'MyStage', {}));
    }
}
const app = new aws_cdk_lib_1.App({
    context: {
        '@aws-cdk/core:newStyleStackSynthesis': '1',
    },
});
const stack = new PipelineStack(app, 'PreparelessPipelineStack');
new integ.IntegTest(app, 'PreparelessPipelineTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtd2l0aG91dC1wcmVwYXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtd2l0aG91dC1wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQUE2RDtBQUM3RCxnR0FBZ0c7QUFDaEcseUNBQXlDO0FBQ3pDLDZDQUFnSDtBQUNoSCxvREFBb0Q7QUFFcEQsbURBQW1EO0FBRW5EOzs7O0dBSUc7QUFDSCxNQUFhLFdBQVksU0FBUSxtQkFBSztJQUdwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM5QyxDQUFDO0NBQ0Y7QUFQRCxrQ0FPQztBQUdELE1BQWEsYUFBYyxTQUFRLG1CQUFLO0lBQ3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQUxELHNDQUtDO0FBRUQsTUFBTSxPQUFRLFNBQVEsbUJBQUs7SUFDekIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNyQyxHQUFHLEtBQUs7WUFDUixXQUFXLEVBQUUsSUFBSSxxQ0FBdUIsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxhQUFjLFNBQVEsbUJBQUs7SUFDL0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN2RCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1lBQ3BDLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUQsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7Z0JBQzNELHNGQUFzRjtnQkFDdEYsaUNBQWlDO2dCQUNqQyxNQUFNO2dCQUNOLFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQzthQUNuRCxDQUFDO1lBQ0YsWUFBWSxFQUFFLEtBQUs7WUFDbkIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLHNDQUFzQyxFQUFFLEdBQUc7S0FDNUM7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQWEsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUVqRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHlCQUF5QixFQUFFO0lBQ2xELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG4vLy8gIWNkay1pbnRlZyBWYXJhYmxlUGlwZWxpbmVTdGFjayBwcmFnbWE6c2V0LWNvbnRleHQ6QGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPXRydWVcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzLCBSZW1vdmFsUG9saWN5LCBTdGFnZSwgU3RhZ2VQcm9wcywgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xuXG4vKipcbiAqIEEgdGVzdCBzdGFja1xuICpcbiAqIEl0IGNvbnRhaW5zIGEgc2luZ2xlIEJ1Y2tldC4gU3VjaCByb2J1c3QuIE11Y2ggdXB0aW1lLlxuICovXG5leHBvcnQgY2xhc3MgQnVja2V0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgdGhpcy5idWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdCdWNrZXQnKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBQbGFpblN0YWNrQXBwIGV4dGVuZHMgU3RhZ2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWdlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBuZXcgQnVja2V0U3RhY2sodGhpcywgJ1N0YWNrJyk7XG4gIH1cbn1cblxuY2xhc3MgTXlTdGFnZSBleHRlbmRzIFN0YWdlIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFnZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh0aGlzLCAnU3RhY2snLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICB9KTtcblxuICAgIG5ldyBQbGFpblN0YWNrQXBwKHN0YWNrLCAnTXlBcHAnKTtcbiAgfVxufVxuXG5jbGFzcyBQaXBlbGluZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNvdXJjZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1NvdXJjZUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgJ1BpcGVsaW5lJywge1xuICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcbiAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuczMoc291cmNlQnVja2V0LCAna2V5JyksXG4gICAgICAgIC8vIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmdpdEh1YignY2RrbGFicy9jb25zdHJ1Y3QtaHViLXByb2JlJywgJ21haW4nLCB7XG4gICAgICAgIC8vICAgdHJpZ2dlcjogR2l0SHViVHJpZ2dlci5QT0xMLFxuICAgICAgICAvLyB9KSxcbiAgICAgICAgY29tbWFuZHM6IFsnbWtkaXIgY2RrLm91dCcsICd0b3VjaCBjZGsub3V0L2R1bW15J10sXG4gICAgICB9KSxcbiAgICAgIHNlbGZNdXRhdGlvbjogZmFsc2UsXG4gICAgICB1c2VDaGFuZ2VTZXRzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKG5ldyBNeVN0YWdlKHRoaXMsICdNeVN0YWdlJywge30pKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgY29udGV4dDoge1xuICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiAnMScsXG4gIH0sXG59KTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgUGlwZWxpbmVTdGFjayhhcHAsICdQcmVwYXJlbGVzc1BpcGVsaW5lU3RhY2snKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdQcmVwYXJlbGVzc1BpcGVsaW5lVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19