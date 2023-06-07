"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNetworkStack = void 0;
const core = require("aws-cdk-lib");
const index_1 = require("../../lib/index");
const support_1 = require("./support");
//import * as path from 'path';
class ServiceNetworkStack extends core.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const support = new support_1.SupportResources(this, 'Support');
        /**
         * Create a ServiceNetwork.
         * OPINIONATED DEFAULT: The default behavior is to create a
         * service network that requries an IAM policy
         */
        const myLatticeService = new index_1.Service(this, 'myLatticeService', {
            allowExternalPrincipals: false,
            rejectAnonymousAccess: false,
        });
        const myListener = myLatticeService.addListener({});
        myListener.addListenerRule({
            name: 'thing',
            priority: 100,
            action: [
                {
                    targetGroup: new index_1.TargetGroup(this, 'lambdatargets', {
                        name: 'lambda1',
                        lambdaTargets: [
                            support.helloWorld,
                        ],
                    }),
                },
            ],
            pathMatch: {
                path: '/helloWorld',
            },
            allowedPrincipals: [support.checkHelloWorld.role],
        });
        myLatticeService.applyAuthPolicy();
        const serviceNetwork = new index_1.ServiceNetwork(this, 'LatticeServiceNetwork', {
            services: [myLatticeService],
            vpcs: [
                support.vpc1,
                support.vpc2,
            ],
        });
        serviceNetwork.applyAuthPolicyToServiceNetwork();
    }
}
exports.ServiceNetworkStack = ServiceNetworkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF0dGljZXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXR0aWNldGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQ0FBb0M7QUFRcEMsMkNBS3lCO0FBRXpCLHVDQUVtQjtBQUduQiwrQkFBK0I7QUFHL0IsTUFBYSxtQkFBb0IsU0FBUSxJQUFJLENBQUMsS0FBSztJQUVqRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXVCO1FBQy9ELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sT0FBTyxHQUFHLElBQUksMEJBQWdCLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXREOzs7O1dBSUc7UUFDSCxNQUFNLGdCQUFnQixHQUFHLElBQUksZUFBTyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUM3RCx1QkFBdUIsRUFBRSxLQUFLO1lBQzlCLHFCQUFxQixFQUFFLEtBQUs7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBELFVBQVUsQ0FBQyxlQUFlLENBQUM7WUFDekIsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUUsR0FBRztZQUNiLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxXQUFXLEVBQUUsSUFBSSxtQkFBVyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7d0JBQ2xELElBQUksRUFBRSxTQUFTO3dCQUNmLGFBQWEsRUFBRTs0QkFDYixPQUFPLENBQUMsVUFBVTt5QkFDbkI7cUJBQ0YsQ0FBQztpQkFDSDthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxhQUFhO2FBQ3BCO1lBQ0QsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQWdCLENBQUM7U0FDOUQsQ0FBQyxDQUFDO1FBRUgsZ0JBQWdCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxzQkFBYyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUN2RSxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUM1QixJQUFJLEVBQUU7Z0JBQ0osT0FBTyxDQUFDLElBQUk7Z0JBQ1osT0FBTyxDQUFDLElBQUk7YUFDYjtTQUNGLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQywrQkFBK0IsRUFBRSxDQUFDO0tBRWxEO0NBQ0Y7QUFuREQsa0RBbURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5cbmltcG9ydCB7XG4gIGF3c19pYW0gYXMgaWFtLFxufVxuICBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuaW1wb3J0IHtcbiAgU2VydmljZU5ldHdvcmssXG4gIFNlcnZpY2UsXG4gIFRhcmdldEdyb3VwLFxufVxuICBmcm9tICcuLi8uLi9saWIvaW5kZXgnO1xuXG5pbXBvcnQge1xuICBTdXBwb3J0UmVzb3VyY2VzLFxufSBmcm9tICcuL3N1cHBvcnQnO1xuXG5cbi8vaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuXG5leHBvcnQgY2xhc3MgU2VydmljZU5ldHdvcmtTdGFjayBleHRlbmRzIGNvcmUuU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY29yZS5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdXBwb3J0ID0gbmV3IFN1cHBvcnRSZXNvdXJjZXModGhpcywgJ1N1cHBvcnQnKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFNlcnZpY2VOZXR3b3JrLlxuICAgICAqIE9QSU5JT05BVEVEIERFRkFVTFQ6IFRoZSBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIGNyZWF0ZSBhXG4gICAgICogc2VydmljZSBuZXR3b3JrIHRoYXQgcmVxdXJpZXMgYW4gSUFNIHBvbGljeVxuICAgICAqL1xuICAgIGNvbnN0IG15TGF0dGljZVNlcnZpY2UgPSBuZXcgU2VydmljZSh0aGlzLCAnbXlMYXR0aWNlU2VydmljZScsIHtcbiAgICAgIGFsbG93RXh0ZXJuYWxQcmluY2lwYWxzOiBmYWxzZSxcbiAgICAgIHJlamVjdEFub255bW91c0FjY2VzczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCBteUxpc3RlbmVyID0gbXlMYXR0aWNlU2VydmljZS5hZGRMaXN0ZW5lcih7fSk7XG5cbiAgICBteUxpc3RlbmVyLmFkZExpc3RlbmVyUnVsZSh7XG4gICAgICBuYW1lOiAndGhpbmcnLFxuICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICAgIGFjdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdGFyZ2V0R3JvdXA6IG5ldyBUYXJnZXRHcm91cCh0aGlzLCAnbGFtYmRhdGFyZ2V0cycsIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYW1iZGExJyxcbiAgICAgICAgICAgIGxhbWJkYVRhcmdldHM6IFtcbiAgICAgICAgICAgICAgc3VwcG9ydC5oZWxsb1dvcmxkLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBwYXRoTWF0Y2g6IHtcbiAgICAgICAgcGF0aDogJy9oZWxsb1dvcmxkJyxcbiAgICAgIH0sXG4gICAgICBhbGxvd2VkUHJpbmNpcGFsczogW3N1cHBvcnQuY2hlY2tIZWxsb1dvcmxkLnJvbGUgYXMgaWFtLlJvbGVdLFxuICAgIH0pO1xuXG4gICAgbXlMYXR0aWNlU2VydmljZS5hcHBseUF1dGhQb2xpY3koKTtcblxuICAgIGNvbnN0IHNlcnZpY2VOZXR3b3JrID0gbmV3IFNlcnZpY2VOZXR3b3JrKHRoaXMsICdMYXR0aWNlU2VydmljZU5ldHdvcmsnLCB7XG4gICAgICBzZXJ2aWNlczogW215TGF0dGljZVNlcnZpY2VdLFxuICAgICAgdnBjczogW1xuICAgICAgICBzdXBwb3J0LnZwYzEsXG4gICAgICAgIHN1cHBvcnQudnBjMixcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBzZXJ2aWNlTmV0d29yay5hcHBseUF1dGhQb2xpY3lUb1NlcnZpY2VOZXR3b3JrKCk7XG5cbiAgfVxufVxuIl19