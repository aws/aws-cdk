"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticBeanstalkEnvironmentEndpointTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const region_info_1 = require("@aws-cdk/region-info");
/**
 * Use an Elastic Beanstalk environment URL as an alias record target.
 * E.g. mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com
 * or mycustomcnameprefix.us-east-1.elasticbeanstalk.com
 *
 * Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.
 */
class ElasticBeanstalkEnvironmentEndpointTarget {
    constructor(environmentEndpoint) {
        this.environmentEndpoint = environmentEndpoint;
    }
    bind(_record, _zone) {
        if (cdk.Token.isUnresolved(this.environmentEndpoint)) {
            throw new Error('Cannot use an EBS alias as `environmentEndpoint`. You must find your EBS environment endpoint via the AWS console. See the Elastic Beanstalk developer guide: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customdomains.html');
        }
        const dnsName = this.environmentEndpoint;
        const subDomains = cdk.Fn.split('.', dnsName);
        const regionSubdomainIndex = subDomains.length - 3;
        const region = cdk.Fn.select(regionSubdomainIndex, subDomains);
        const { ebsEnvEndpointHostedZoneId: hostedZoneId } = region_info_1.RegionInfo.get(region);
        if (!hostedZoneId || !dnsName) {
            throw new Error(`Elastic Beanstalk environment target is not supported for the "${region}" region.`);
        }
        return {
            hostedZoneId,
            dnsName,
        };
    }
}
exports.ElasticBeanstalkEnvironmentEndpointTarget = ElasticBeanstalkEnvironmentEndpointTarget;
_a = JSII_RTTI_SYMBOL_1;
ElasticBeanstalkEnvironmentEndpointTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.ElasticBeanstalkEnvironmentEndpointTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1iZWFuc3RhbGstZW52aXJvbm1lbnQtdGFyZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWxhc3RpYy1iZWFuc3RhbGstZW52aXJvbm1lbnQtdGFyZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EscUNBQXFDO0FBQ3JDLHNEQUFrRDtBQUVsRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLHlDQUF5QztJQUNwRCxZQUE2QixtQkFBMkI7UUFBM0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO0tBQ3ZEO0lBRU0sSUFBSSxDQUFDLE9BQTJCLEVBQUUsS0FBMkI7UUFDbEUsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLHlPQUF5TyxDQUFDLENBQUM7U0FDNVA7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDekMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLE1BQU0sb0JBQW9CLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0QsTUFBTSxFQUFFLDBCQUEwQixFQUFFLFlBQVksRUFBRSxHQUFHLHdCQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsTUFBTSxXQUFXLENBQUMsQ0FBQztTQUN0RztRQUVELE9BQU87WUFDTCxZQUFZO1lBQ1osT0FBTztTQUNSLENBQUM7S0FDSDs7QUF2QkgsOEZBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBSZWdpb25JbmZvIH0gZnJvbSAnQGF3cy1jZGsvcmVnaW9uLWluZm8nO1xuXG4vKipcbiAqIFVzZSBhbiBFbGFzdGljIEJlYW5zdGFsayBlbnZpcm9ubWVudCBVUkwgYXMgYW4gYWxpYXMgcmVjb3JkIHRhcmdldC5cbiAqIEUuZy4gbXlzYW1wbGVlbnZpcm9ubWVudC54eXoudXMtZWFzdC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tXG4gKiBvciBteWN1c3RvbWNuYW1lcHJlZml4LnVzLWVhc3QtMS5lbGFzdGljYmVhbnN0YWxrLmNvbVxuICpcbiAqIE9ubHkgc3VwcG9ydHMgRWxhc3RpYyBCZWFuc3RhbGsgZW52aXJvbm1lbnRzIGNyZWF0ZWQgYWZ0ZXIgMjAxNiB0aGF0IGhhdmUgYSByZWdpb25hbCBlbmRwb2ludC5cbiAqL1xuZXhwb3J0IGNsYXNzIEVsYXN0aWNCZWFuc3RhbGtFbnZpcm9ubWVudEVuZHBvaW50VGFyZ2V0IGltcGxlbWVudHMgcm91dGU1My5JQWxpYXNSZWNvcmRUYXJnZXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVudmlyb25tZW50RW5kcG9pbnQ6IHN0cmluZykge1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3JlY29yZDogcm91dGU1My5JUmVjb3JkU2V0LCBfem9uZT86IHJvdXRlNTMuSUhvc3RlZFpvbmUpOiByb3V0ZTUzLkFsaWFzUmVjb3JkVGFyZ2V0Q29uZmlnIHtcbiAgICBpZiAoY2RrLlRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmVudmlyb25tZW50RW5kcG9pbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYW4gRUJTIGFsaWFzIGFzIGBlbnZpcm9ubWVudEVuZHBvaW50YC4gWW91IG11c3QgZmluZCB5b3VyIEVCUyBlbnZpcm9ubWVudCBlbmRwb2ludCB2aWEgdGhlIEFXUyBjb25zb2xlLiBTZWUgdGhlIEVsYXN0aWMgQmVhbnN0YWxrIGRldmVsb3BlciBndWlkZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNiZWFuc3RhbGsvbGF0ZXN0L2RnL2N1c3RvbWRvbWFpbnMuaHRtbCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGRuc05hbWUgPSB0aGlzLmVudmlyb25tZW50RW5kcG9pbnQ7XG4gICAgY29uc3Qgc3ViRG9tYWlucyA9IGNkay5Gbi5zcGxpdCgnLicsIGRuc05hbWUpO1xuICAgIGNvbnN0IHJlZ2lvblN1YmRvbWFpbkluZGV4ID0gc3ViRG9tYWlucy5sZW5ndGggLSAzO1xuICAgIGNvbnN0IHJlZ2lvbiA9IGNkay5Gbi5zZWxlY3QocmVnaW9uU3ViZG9tYWluSW5kZXgsIHN1YkRvbWFpbnMpO1xuICAgIGNvbnN0IHsgZWJzRW52RW5kcG9pbnRIb3N0ZWRab25lSWQ6IGhvc3RlZFpvbmVJZCB9ID0gUmVnaW9uSW5mby5nZXQocmVnaW9uKTtcblxuICAgIGlmICghaG9zdGVkWm9uZUlkIHx8ICFkbnNOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVsYXN0aWMgQmVhbnN0YWxrIGVudmlyb25tZW50IHRhcmdldCBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGUgXCIke3JlZ2lvbn1cIiByZWdpb24uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGhvc3RlZFpvbmVJZCxcbiAgICAgIGRuc05hbWUsXG4gICAgfTtcbiAgfVxufVxuIl19