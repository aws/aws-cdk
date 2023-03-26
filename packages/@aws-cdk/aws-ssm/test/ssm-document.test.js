"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ssm = require("../lib");
test('association name is rendered properly in L1 construct', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new ssm.CfnAssociation(stack, 'Assoc', {
        name: 'document',
        parameters: {
            a: ['a'],
            B: [],
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SSM::Association', {
        Name: 'document',
        Parameters: {
            a: ['a'],
            B: [],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NtLWRvY3VtZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzc20tZG9jdW1lbnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7SUFDakUsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTlCLE9BQU87SUFDUCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUNyQyxJQUFJLEVBQUUsVUFBVTtRQUNoQixVQUFVLEVBQUU7WUFDVixDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDUixDQUFDLEVBQUUsRUFBRTtTQUNOO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO1FBQ3ZFLElBQUksRUFBRSxVQUFVO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNSLENBQUMsRUFBRSxFQUFFO1NBQ047S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnLi4vbGliJztcblxudGVzdCgnYXNzb2NpYXRpb24gbmFtZSBpcyByZW5kZXJlZCBwcm9wZXJseSBpbiBMMSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNzbS5DZm5Bc3NvY2lhdGlvbihzdGFjaywgJ0Fzc29jJywge1xuICAgIG5hbWU6ICdkb2N1bWVudCcsXG4gICAgcGFyYW1ldGVyczoge1xuICAgICAgYTogWydhJ10sXG4gICAgICBCOiBbXSxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNTTTo6QXNzb2NpYXRpb24nLCB7XG4gICAgTmFtZTogJ2RvY3VtZW50JyxcbiAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICBhOiBbJ2EnXSxcbiAgICAgIEI6IFtdLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=