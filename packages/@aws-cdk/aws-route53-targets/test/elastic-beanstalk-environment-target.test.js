"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const targets = require("../lib");
test('use EBS environment as record target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
    // WHEN
    new route53.ARecord(stack, 'Alias', {
        zone,
        recordName: '_foo',
        target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget('mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com')),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            DNSName: 'mysampleenvironment.xyz.us-east-1.elasticbeanstalk.com',
            HostedZoneId: 'Z117KPS5GTRQ2G',
        },
    });
});
test('support 4-levels subdomain URLs for EBS environments', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
    // WHEN
    new route53.ARecord(stack, 'Alias', {
        zone,
        recordName: '_foo',
        target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget('mycustomcnameprefix.us-east-1.elasticbeanstalk.com')),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            DNSName: 'mycustomcnameprefix.us-east-1.elasticbeanstalk.com',
            HostedZoneId: 'Z117KPS5GTRQ2G',
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1iZWFuc3RhbGstZW52aXJvbm1lbnQtdGFyZ2V0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbGFzdGljLWJlYW5zdGFsay1lbnZpcm9ubWVudC10YXJnZXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsd0NBQXNDO0FBQ3RDLGtDQUFrQztBQUVsQyxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO0lBQ2hELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUU1RixPQUFPO0lBQ1AsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDbEMsSUFBSTtRQUNKLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0tBQ3hKLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtRQUN6RSxXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUUsd0RBQXdEO1lBQ2pFLFlBQVksRUFBRSxnQkFBZ0I7U0FDL0I7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUdILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7SUFDaEUsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBRTVGLE9BQU87SUFDUCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUNsQyxJQUFJO1FBQ0osVUFBVSxFQUFFLE1BQU07UUFDbEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLHlDQUF5QyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7S0FDcEosQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1FBQ3pFLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxvREFBb0Q7WUFDN0QsWUFBWSxFQUFFLGdCQUFnQjtTQUMvQjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vbGliJztcblxudGVzdCgndXNlIEVCUyBlbnZpcm9ubWVudCBhcyByZWNvcmQgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7IHpvbmVOYW1lOiAndGVzdC5wdWJsaWMnIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHJvdXRlNTMuQVJlY29yZChzdGFjaywgJ0FsaWFzJywge1xuICAgIHpvbmUsXG4gICAgcmVjb3JkTmFtZTogJ19mb28nLFxuICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLkVsYXN0aWNCZWFuc3RhbGtFbnZpcm9ubWVudEVuZHBvaW50VGFyZ2V0KCdteXNhbXBsZWVudmlyb25tZW50Lnh5ei51cy1lYXN0LTEuZWxhc3RpY2JlYW5zdGFsay5jb20nKSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgIEFsaWFzVGFyZ2V0OiB7XG4gICAgICBETlNOYW1lOiAnbXlzYW1wbGVlbnZpcm9ubWVudC54eXoudXMtZWFzdC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tJyxcbiAgICAgIEhvc3RlZFpvbmVJZDogJ1oxMTdLUFM1R1RSUTJHJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5cbnRlc3QoJ3N1cHBvcnQgNC1sZXZlbHMgc3ViZG9tYWluIFVSTHMgZm9yIEVCUyBlbnZpcm9ubWVudHMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHpvbmUgPSBuZXcgcm91dGU1My5QdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICd0ZXN0LnB1YmxpYycgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgcm91dGU1My5BUmVjb3JkKHN0YWNrLCAnQWxpYXMnLCB7XG4gICAgem9uZSxcbiAgICByZWNvcmROYW1lOiAnX2ZvbycsXG4gICAgdGFyZ2V0OiByb3V0ZTUzLlJlY29yZFRhcmdldC5mcm9tQWxpYXMobmV3IHRhcmdldHMuRWxhc3RpY0JlYW5zdGFsa0Vudmlyb25tZW50RW5kcG9pbnRUYXJnZXQoJ215Y3VzdG9tY25hbWVwcmVmaXgudXMtZWFzdC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tJykpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICBBbGlhc1RhcmdldDoge1xuICAgICAgRE5TTmFtZTogJ215Y3VzdG9tY25hbWVwcmVmaXgudXMtZWFzdC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tJyxcbiAgICAgIEhvc3RlZFpvbmVJZDogJ1oxMTdLUFM1R1RSUTJHJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19