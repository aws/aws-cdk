#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const targets = require("../lib");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const zone = new route53.PublicHostedZone(this, 'HostedZone', {
            zoneName: 'cdk-integ.com',
        });
        const www = new route53.ARecord(this, 'WWW', {
            zone,
            recordName: 'www.cdk-integ.com',
            target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
        });
        new route53.ARecord(this, 'Alias', {
            zone,
            target: route53.RecordTarget.fromAlias(new targets.Route53RecordTarget(www)),
        });
    }
}
const app = new core_1.App();
new TestStack(app, 'aws-cdk-r53-record-alias-target-integ');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucm91dGU1My1yZWNvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yb3V0ZTUzLXJlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnREFBZ0Q7QUFDaEQsd0NBQTJDO0FBRTNDLGtDQUFrQztBQUVsQyxNQUFNLFNBQVUsU0FBUSxZQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM1RCxRQUFRLEVBQUUsZUFBZTtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUMzQyxJQUFJO1lBQ0osVUFBVSxFQUFFLG1CQUFtQjtZQUMvQixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDO1NBQ3hELENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pDLElBQUk7WUFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0UsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxDQUFDLENBQUM7QUFDNUQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdjZGstaW50ZWcuY29tJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHd3dyA9IG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ1dXVycsIHtcbiAgICAgIHpvbmUsXG4gICAgICByZWNvcmROYW1lOiAnd3d3LmNkay1pbnRlZy5jb20nLFxuICAgICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tSXBBZGRyZXNzZXMoJzEuMi4zLjQnKSxcbiAgICB9KTtcblxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ0FsaWFzJywge1xuICAgICAgem9uZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLlJvdXRlNTNSZWNvcmRUYXJnZXQod3d3KSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLXI1My1yZWNvcmQtYWxpYXMtdGFyZ2V0LWludGVnJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==