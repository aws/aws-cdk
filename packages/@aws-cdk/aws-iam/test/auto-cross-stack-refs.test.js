"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const iam = require("../lib");
describe('automatic cross-stack references', () => {
    test('automatic exports are created when attributes are referneced across stacks', () => {
        // GIVEN
        const app = new cdk.App();
        const stackWithUser = new cdk.Stack(app, 'stack1');
        const stackWithGroup = new cdk.Stack(app, 'stack2');
        const user = new iam.User(stackWithUser, 'User');
        const group = new iam.Group(stackWithGroup, 'Group');
        // WHEN
        group.addUser(user);
        //
        // `group.addUser` adds the group to the user resource definition, so we expect
        // that an automatic export will be created for the group and the user's stack
        // to use ImportValue to import it.
        // note that order of "expect"s matters. we first need to synthesize the user's
        // stack so that the cross stack reference will be reported and only then the
        // group's stack. in the real world, App will take care of this.
        //
        // THEN
        assertions_1.Template.fromStack(stackWithUser).templateMatches({
            Resources: {
                User00B015A1: {
                    Type: 'AWS::IAM::User',
                    Properties: {
                        Groups: [{ 'Fn::ImportValue': 'stack2:ExportsOutputRefGroupC77FDACD8CF7DD5B' }],
                    },
                },
            },
        });
        assertions_1.Template.fromStack(stackWithGroup).templateMatches({
            Outputs: {
                ExportsOutputRefGroupC77FDACD8CF7DD5B: {
                    Value: { Ref: 'GroupC77FDACD' },
                    Export: { Name: 'stack2:ExportsOutputRefGroupC77FDACD8CF7DD5B' },
                },
            },
            Resources: {
                GroupC77FDACD: {
                    Type: 'AWS::IAM::Group',
                },
            },
        });
    });
    test('cannot reference tokens across apps', () => {
        // GIVEN
        const stack1 = new cdk.Stack();
        const stack2 = new cdk.Stack();
        const user = new iam.User(stack1, 'User');
        const group = new iam.Group(stack2, 'Group');
        group.addUser(user);
        // THEN
        expect(() => cdk.App.of(stack1).synth()).toThrow(/Cannot reference across apps/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1jcm9zcy1zdGFjay1yZWZzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdXRvLWNyb3NzLXN0YWNrLXJlZnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLFFBQVEsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7SUFDaEQsSUFBSSxDQUFDLDRFQUE0RSxFQUFFLEdBQUcsRUFBRTtRQUN0RixRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVyRCxPQUFPO1FBQ1AsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQixFQUFFO1FBQ0YsK0VBQStFO1FBQy9FLDhFQUE4RTtRQUM5RSxtQ0FBbUM7UUFDbkMsK0VBQStFO1FBQy9FLDZFQUE2RTtRQUM3RSxnRUFBZ0U7UUFDaEUsRUFBRTtRQUVGLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDaEQsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUU7d0JBQ1YsTUFBTSxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSw4Q0FBOEMsRUFBRSxDQUFDO3FCQUNoRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ2pELE9BQU8sRUFBRTtnQkFDUCxxQ0FBcUMsRUFBRTtvQkFDckMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRTtvQkFDL0IsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLDhDQUE4QyxFQUFFO2lCQUNqRTthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsaUJBQWlCO2lCQUN4QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLFFBQVE7UUFDUixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQixPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2F1dG9tYXRpYyBjcm9zcy1zdGFjayByZWZlcmVuY2VzJywgKCkgPT4ge1xuICB0ZXN0KCdhdXRvbWF0aWMgZXhwb3J0cyBhcmUgY3JlYXRlZCB3aGVuIGF0dHJpYnV0ZXMgYXJlIHJlZmVybmVjZWQgYWNyb3NzIHN0YWNrcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2tXaXRoVXNlciA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2tXaXRoR3JvdXAgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3N0YWNrMicpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2tXaXRoVXNlciwgJ1VzZXInKTtcbiAgICBjb25zdCBncm91cCA9IG5ldyBpYW0uR3JvdXAoc3RhY2tXaXRoR3JvdXAsICdHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGdyb3VwLmFkZFVzZXIodXNlcik7XG5cbiAgICAvL1xuICAgIC8vIGBncm91cC5hZGRVc2VyYCBhZGRzIHRoZSBncm91cCB0byB0aGUgdXNlciByZXNvdXJjZSBkZWZpbml0aW9uLCBzbyB3ZSBleHBlY3RcbiAgICAvLyB0aGF0IGFuIGF1dG9tYXRpYyBleHBvcnQgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGUgZ3JvdXAgYW5kIHRoZSB1c2VyJ3Mgc3RhY2tcbiAgICAvLyB0byB1c2UgSW1wb3J0VmFsdWUgdG8gaW1wb3J0IGl0LlxuICAgIC8vIG5vdGUgdGhhdCBvcmRlciBvZiBcImV4cGVjdFwicyBtYXR0ZXJzLiB3ZSBmaXJzdCBuZWVkIHRvIHN5bnRoZXNpemUgdGhlIHVzZXInc1xuICAgIC8vIHN0YWNrIHNvIHRoYXQgdGhlIGNyb3NzIHN0YWNrIHJlZmVyZW5jZSB3aWxsIGJlIHJlcG9ydGVkIGFuZCBvbmx5IHRoZW4gdGhlXG4gICAgLy8gZ3JvdXAncyBzdGFjay4gaW4gdGhlIHJlYWwgd29ybGQsIEFwcCB3aWxsIHRha2UgY2FyZSBvZiB0aGlzLlxuICAgIC8vXG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrV2l0aFVzZXIpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgVXNlcjAwQjAxNUExOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBHcm91cHM6IFt7ICdGbjo6SW1wb3J0VmFsdWUnOiAnc3RhY2syOkV4cG9ydHNPdXRwdXRSZWZHcm91cEM3N0ZEQUNEOENGN0RENUInIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFja1dpdGhHcm91cCkudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgRXhwb3J0c091dHB1dFJlZkdyb3VwQzc3RkRBQ0Q4Q0Y3REQ1Qjoge1xuICAgICAgICAgIFZhbHVlOiB7IFJlZjogJ0dyb3VwQzc3RkRBQ0QnIH0sXG4gICAgICAgICAgRXhwb3J0OiB7IE5hbWU6ICdzdGFjazI6RXhwb3J0c091dHB1dFJlZkdyb3VwQzc3RkRBQ0Q4Q0Y3REQ1QicgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgR3JvdXBDNzdGREFDRDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6R3JvdXAnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IHJlZmVyZW5jZSB0b2tlbnMgYWNyb3NzIGFwcHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2sxLCAnVXNlcicpO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IGlhbS5Hcm91cChzdGFjazIsICdHcm91cCcpO1xuICAgIGdyb3VwLmFkZFVzZXIodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNkay5BcHAub2Yoc3RhY2sxKSEuc3ludGgoKSkudG9UaHJvdygvQ2Fubm90IHJlZmVyZW5jZSBhY3Jvc3MgYXBwcy8pO1xuICB9KTtcbn0pO1xuIl19