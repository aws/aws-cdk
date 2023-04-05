"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const efs = require("aws-cdk-lib/aws-efs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const backup = require("aws-cdk-lib/aws-backup");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new dynamodb.Table(this, 'Table', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        const fs = new efs.CfnFileSystem(this, 'FileSystem');
        fs.applyRemovalPolicy(aws_cdk_lib_1.RemovalPolicy.DESTROY);
        const vault = new backup.BackupVault(this, 'Vault', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            lockConfiguration: {
                minRetention: aws_cdk_lib_1.Duration.days(5),
            },
        });
        const secondaryVault = new backup.BackupVault(this, 'SecondaryVault', {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            lockConfiguration: {
                minRetention: aws_cdk_lib_1.Duration.days(5),
            },
        });
        const plan = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(this, 'Plan', vault);
        plan.addSelection('Selection', {
            resources: [
                backup.BackupResource.fromConstruct(this),
                backup.BackupResource.fromTag('stage', 'prod'), // Resources that are tagged stage=prod
            ],
        });
        plan.addRule(new backup.BackupPlanRule({
            copyActions: [{
                    destinationBackupVault: secondaryVault,
                    moveToColdStorageAfter: aws_cdk_lib_1.Duration.days(30),
                    deleteAfter: aws_cdk_lib_1.Duration.days(120),
                }],
        }));
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-backup');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYmFja3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYmFja3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQXFEO0FBQ3JELDJDQUEyQztBQUMzQyw2Q0FBOEU7QUFFOUUsaURBQWlEO0FBRWpELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDaEMsWUFBWSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDcEM7WUFDRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLGtCQUFrQixDQUFDLDJCQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDbEQsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRTtnQkFDakIsWUFBWSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDcEUsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxpQkFBaUIsRUFBRTtnQkFDakIsWUFBWSxFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvQjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVyRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsdUNBQXVDO2FBQ3hGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFDckMsV0FBVyxFQUFFLENBQUM7b0JBQ1osc0JBQXNCLEVBQUUsY0FBYztvQkFDdEMsc0JBQXNCLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUN6QyxXQUFXLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNoQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZHluYW1vZGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCAqIGFzIGVmcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWZzJztcbmltcG9ydCB7IEFwcCwgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBiYWNrdXAgZnJvbSAnYXdzLWNkay1saWIvYXdzLWJhY2t1cCc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgJ1RhYmxlJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdpZCcsXG4gICAgICAgIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HLFxuICAgICAgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGZzID0gbmV3IGVmcy5DZm5GaWxlU3lzdGVtKHRoaXMsICdGaWxlU3lzdGVtJyk7XG4gICAgZnMuYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuREVTVFJPWSk7XG5cbiAgICBjb25zdCB2YXVsdCA9IG5ldyBiYWNrdXAuQmFja3VwVmF1bHQodGhpcywgJ1ZhdWx0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgbG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgbWluUmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDUpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzZWNvbmRhcnlWYXVsdCA9IG5ldyBiYWNrdXAuQmFja3VwVmF1bHQodGhpcywgJ1NlY29uZGFyeVZhdWx0Jywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgbG9ja0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgbWluUmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDUpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBwbGFuID0gYmFja3VwLkJhY2t1cFBsYW4uZGFpbHlXZWVrbHlNb250aGx5NVllYXJSZXRlbnRpb24odGhpcywgJ1BsYW4nLCB2YXVsdCk7XG5cbiAgICBwbGFuLmFkZFNlbGVjdGlvbignU2VsZWN0aW9uJywge1xuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIGJhY2t1cC5CYWNrdXBSZXNvdXJjZS5mcm9tQ29uc3RydWN0KHRoaXMpLCAvLyBBbGwgYmFja3VwYWJsZSByZXNvdXJjZXMgaW4gdGhpcyBjb25zdHJ1Y3RcbiAgICAgICAgYmFja3VwLkJhY2t1cFJlc291cmNlLmZyb21UYWcoJ3N0YWdlJywgJ3Byb2QnKSwgLy8gUmVzb3VyY2VzIHRoYXQgYXJlIHRhZ2dlZCBzdGFnZT1wcm9kXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcGxhbi5hZGRSdWxlKG5ldyBiYWNrdXAuQmFja3VwUGxhblJ1bGUoe1xuICAgICAgY29weUFjdGlvbnM6IFt7XG4gICAgICAgIGRlc3RpbmF0aW9uQmFja3VwVmF1bHQ6IHNlY29uZGFyeVZhdWx0LFxuICAgICAgICBtb3ZlVG9Db2xkU3RvcmFnZUFmdGVyOiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgICAgICAgZGVsZXRlQWZ0ZXI6IER1cmF0aW9uLmRheXMoMTIwKSxcbiAgICAgIH1dLFxuICAgIH0pKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1iYWNrdXAnKTtcbmFwcC5zeW50aCgpO1xuIl19