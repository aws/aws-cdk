"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const archive_1 = require("../lib/archive");
describe('archive', () => {
    test('creates an archive for an EventBus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const eventBus = new lib_1.EventBus(stack, 'Bus');
        new archive_1.Archive(stack, 'Archive', {
            sourceEventBus: eventBus,
            eventPattern: {
                account: [stack.account],
            },
            retention: core_1.Duration.days(10),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
            EventPattern: {
                account: [{
                        Ref: 'AWS::AccountId',
                    }],
            },
            RetentionDays: 10,
            SourceArn: {
                'Fn::GetAtt': [
                    'BusEA82B648',
                    'Arn',
                ],
            },
        });
    });
    test('creates an archive for an EventBus with a pattern including a detailType property', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const eventBus = new lib_1.EventBus(stack, 'Bus');
        new archive_1.Archive(stack, 'Archive', {
            sourceEventBus: eventBus,
            eventPattern: {
                account: [stack.account],
                detailType: ['Custom Detail Type'],
            },
            retention: core_1.Duration.days(10),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
            EventPattern: {
                'account': [{
                        Ref: 'AWS::AccountId',
                    }],
                'detail-type': ['Custom Detail Type'],
            },
            RetentionDays: 10,
            SourceArn: {
                'Fn::GetAtt': [
                    'BusEA82B648',
                    'Arn',
                ],
            },
        });
    });
    test('should have defined defaultChild', () => {
        const stack = new core_1.Stack();
        const eventBus = new lib_1.EventBus(stack, 'Bus');
        const archive = new archive_1.Archive(stack, 'Archive', {
            sourceEventBus: eventBus,
            eventPattern: {
                account: [stack.account],
            },
            retention: core_1.Duration.days(10),
        });
        expect(archive.node.defaultChild).toBe(archive.node.findChild('Archive'));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJjaGl2ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFnRDtBQUNoRCxnQ0FBa0M7QUFDbEMsNENBQXlDO0FBRXpDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUM1QixjQUFjLEVBQUUsUUFBUTtZQUN4QixZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQzthQUN6QjtZQUNELFNBQVMsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUM3QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRTtZQUN0RSxZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLENBQUM7d0JBQ1IsR0FBRyxFQUFFLGdCQUFnQjtxQkFDdEIsQ0FBQzthQUNIO1lBQ0QsYUFBYSxFQUFFLEVBQUU7WUFDakIsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWixhQUFhO29CQUNiLEtBQUs7aUJBQ047YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1GQUFtRixFQUFFLEdBQUcsRUFBRTtRQUM3RixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTVDLElBQUksaUJBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQzVCLGNBQWMsRUFBRSxRQUFRO1lBQ3hCLFlBQVksRUFBRTtnQkFDWixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUN4QixVQUFVLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUNuQztZQUNELFNBQVMsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUM3QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRTtZQUN0RSxZQUFZLEVBQUU7Z0JBQ1osU0FBUyxFQUFFLENBQUM7d0JBQ1YsR0FBRyxFQUFFLGdCQUFnQjtxQkFDdEIsQ0FBQztnQkFDRixhQUFhLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUN0QztZQUNELGFBQWEsRUFBRSxFQUFFO1lBQ2pCLFNBQVMsRUFBRTtnQkFDVCxZQUFZLEVBQUU7b0JBQ1osYUFBYTtvQkFDYixLQUFLO2lCQUNOO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDNUMsY0FBYyxFQUFFLFFBQVE7WUFDeEIsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7YUFDekI7WUFDRCxTQUFTLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEV2ZW50QnVzIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEFyY2hpdmUgfSBmcm9tICcuLi9saWIvYXJjaGl2ZSc7XG5cbmRlc2NyaWJlKCdhcmNoaXZlJywgKCkgPT4ge1xuICB0ZXN0KCdjcmVhdGVzIGFuIGFyY2hpdmUgZm9yIGFuIEV2ZW50QnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgbmV3IEFyY2hpdmUoc3RhY2ssICdBcmNoaXZlJywge1xuICAgICAgc291cmNlRXZlbnRCdXM6IGV2ZW50QnVzLFxuICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGFjY291bnQ6IFtzdGFjay5hY2NvdW50XSxcbiAgICAgIH0sXG4gICAgICByZXRlbnRpb246IER1cmF0aW9uLmRheXMoMTApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXMnLCB7XG4gICAgICBOYW1lOiAnQnVzJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6QXJjaGl2ZScsIHtcbiAgICAgIEV2ZW50UGF0dGVybjoge1xuICAgICAgICBhY2NvdW50OiBbe1xuICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgICAgUmV0ZW50aW9uRGF5czogMTAsXG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0J1c0VBODJCNjQ4JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZXMgYW4gYXJjaGl2ZSBmb3IgYW4gRXZlbnRCdXMgd2l0aCBhIHBhdHRlcm4gaW5jbHVkaW5nIGEgZGV0YWlsVHlwZSBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIG5ldyBBcmNoaXZlKHN0YWNrLCAnQXJjaGl2ZScsIHtcbiAgICAgIHNvdXJjZUV2ZW50QnVzOiBldmVudEJ1cyxcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBhY2NvdW50OiBbc3RhY2suYWNjb3VudF0sXG4gICAgICAgIGRldGFpbFR5cGU6IFsnQ3VzdG9tIERldGFpbCBUeXBlJ10sXG4gICAgICB9LFxuICAgICAgcmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDEwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzJywge1xuICAgICAgTmFtZTogJ0J1cycsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkFyY2hpdmUnLCB7XG4gICAgICBFdmVudFBhdHRlcm46IHtcbiAgICAgICAgJ2FjY291bnQnOiBbe1xuICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgfV0sXG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQ3VzdG9tIERldGFpbCBUeXBlJ10sXG4gICAgICB9LFxuICAgICAgUmV0ZW50aW9uRGF5czogMTAsXG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0J1c0VBODJCNjQ4JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBoYXZlIGRlZmluZWQgZGVmYXVsdENoaWxkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgY29uc3QgYXJjaGl2ZSA9IG5ldyBBcmNoaXZlKHN0YWNrLCAnQXJjaGl2ZScsIHtcbiAgICAgIHNvdXJjZUV2ZW50QnVzOiBldmVudEJ1cyxcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBhY2NvdW50OiBbc3RhY2suYWNjb3VudF0sXG4gICAgICB9LFxuICAgICAgcmV0ZW50aW9uOiBEdXJhdGlvbi5kYXlzKDEwKSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChhcmNoaXZlLm5vZGUuZGVmYXVsdENoaWxkKS50b0JlKGFyY2hpdmUubm9kZS5maW5kQ2hpbGQoJ0FyY2hpdmUnKSk7XG4gIH0pO1xufSk7XG4iXX0=