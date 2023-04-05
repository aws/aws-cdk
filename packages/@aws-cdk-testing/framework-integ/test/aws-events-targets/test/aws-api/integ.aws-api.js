"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("aws-cdk-lib/aws-events");
const cdk = require("aws-cdk-lib");
const targets = require("aws-cdk-lib/aws-events-targets");
const app = new cdk.App();
class AwsApi extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Force new deployment of 'cool-service' and stop 'dev-instance' at midnight everyday
        const scheduleRule = new events.Rule(this, 'ScheduleRule', {
            schedule: events.Schedule.cron({
                hour: '0',
                minute: '0',
            }),
        });
        scheduleRule.addTarget(new targets.AwsApi({
            service: 'ECS',
            action: 'updateService',
            parameters: {
                service: 'cool-service',
                forceNewDeployment: true,
            },
        }));
        scheduleRule.addTarget(new targets.AwsApi({
            service: 'RDS',
            action: 'stopDBInstance',
            parameters: {
                DBInstanceIdentifier: 'dev-instance',
            },
        }));
        // Create snapshots when a DB instance restarts
        const patternRule = new events.Rule(this, 'PatternRule', {
            eventPattern: {
                detailType: ['RDS DB Instance Event'],
                detail: {
                    Message: ['DB instance restarted'],
                },
            },
        });
        patternRule.addTarget(new targets.AwsApi({
            service: 'RDS',
            action: 'createDBSnapshot',
            parameters: {
                DBInstanceIdentifier: events.EventField.fromPath('$.detail.SourceArn'),
            },
        }));
    }
}
new AwsApi(app, 'aws-cdk-aws-api-target-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXdzLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmF3cy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLDBEQUEwRDtBQUUxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLE1BQU8sU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QixZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsc0ZBQXNGO1FBQ3RGLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3pELFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDN0IsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLEdBQUc7YUFDWixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDeEMsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsZUFBZTtZQUN2QixVQUFVLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLGtCQUFrQixFQUFFLElBQUk7YUFDTztTQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVKLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3hDLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTSxFQUFFLGdCQUFnQjtZQUN4QixVQUFVLEVBQUU7Z0JBQ1Ysb0JBQW9CLEVBQUUsY0FBYzthQUNKO1NBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUosK0NBQStDO1FBQy9DLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZELFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDckMsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUNuQzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDdkMsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLFVBQVUsRUFBRTtnQkFDVixvQkFBb0IsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQzthQUNwQztTQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDRjtBQUVELElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hELEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0cyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIEF3c0FwaSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBGb3JjZSBuZXcgZGVwbG95bWVudCBvZiAnY29vbC1zZXJ2aWNlJyBhbmQgc3RvcCAnZGV2LWluc3RhbmNlJyBhdCBtaWRuaWdodCBldmVyeWRheVxuICAgIGNvbnN0IHNjaGVkdWxlUnVsZSA9IG5ldyBldmVudHMuUnVsZSh0aGlzLCAnU2NoZWR1bGVSdWxlJywge1xuICAgICAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5jcm9uKHtcbiAgICAgICAgaG91cjogJzAnLFxuICAgICAgICBtaW51dGU6ICcwJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgc2NoZWR1bGVSdWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5Bd3NBcGkoe1xuICAgICAgc2VydmljZTogJ0VDUycsXG4gICAgICBhY3Rpb246ICd1cGRhdGVTZXJ2aWNlJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgc2VydmljZTogJ2Nvb2wtc2VydmljZScsXG4gICAgICAgIGZvcmNlTmV3RGVwbG95bWVudDogdHJ1ZSxcbiAgICAgIH0gYXMgQVdTLkVDUy5VcGRhdGVTZXJ2aWNlUmVxdWVzdCxcbiAgICB9KSk7XG5cbiAgICBzY2hlZHVsZVJ1bGUuYWRkVGFyZ2V0KG5ldyB0YXJnZXRzLkF3c0FwaSh7XG4gICAgICBzZXJ2aWNlOiAnUkRTJyxcbiAgICAgIGFjdGlvbjogJ3N0b3BEQkluc3RhbmNlJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgREJJbnN0YW5jZUlkZW50aWZpZXI6ICdkZXYtaW5zdGFuY2UnLFxuICAgICAgfSBhcyBBV1MuUkRTLlN0b3BEQkluc3RhbmNlTWVzc2FnZSxcbiAgICB9KSk7XG5cbiAgICAvLyBDcmVhdGUgc25hcHNob3RzIHdoZW4gYSBEQiBpbnN0YW5jZSByZXN0YXJ0c1xuICAgIGNvbnN0IHBhdHRlcm5SdWxlID0gbmV3IGV2ZW50cy5SdWxlKHRoaXMsICdQYXR0ZXJuUnVsZScsIHtcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBkZXRhaWxUeXBlOiBbJ1JEUyBEQiBJbnN0YW5jZSBFdmVudCddLFxuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBNZXNzYWdlOiBbJ0RCIGluc3RhbmNlIHJlc3RhcnRlZCddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHBhdHRlcm5SdWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5Bd3NBcGkoe1xuICAgICAgc2VydmljZTogJ1JEUycsXG4gICAgICBhY3Rpb246ICdjcmVhdGVEQlNuYXBzaG90JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgREJJbnN0YW5jZUlkZW50aWZpZXI6IGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5Tb3VyY2VBcm4nKSxcbiAgICAgIH0gYXMgQVdTLlJEUy5DcmVhdGVEQlNuYXBzaG90TWVzc2FnZSxcbiAgICB9KSk7XG4gIH1cbn1cblxubmV3IEF3c0FwaShhcHAsICdhd3MtY2RrLWF3cy1hcGktdGFyZ2V0LWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==