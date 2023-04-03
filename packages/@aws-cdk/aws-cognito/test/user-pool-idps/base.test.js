"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
const user_pool_idp_base_1 = require("../../lib/user-pool-idps/private/user-pool-idp-base");
class MyIdp extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor() {
        super(...arguments);
        this.providerName = 'MyProvider';
        this.mapping = this.configureAttributeMapping();
    }
}
describe('UserPoolIdentityProvider', () => {
    describe('attribute mapping', () => {
        test('absent or empty', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'UserPool');
            // WHEN
            const idp1 = new MyIdp(stack, 'MyIdp1', {
                userPool: pool,
            });
            const idp2 = new MyIdp(stack, 'MyIdp2', {
                userPool: pool,
                attributeMapping: {},
            });
            // THEN
            expect(idp1.mapping).toBeUndefined();
            expect(idp2.mapping).toBeUndefined();
        });
        test('standard attributes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'UserPool');
            // WHEN
            const idp = new MyIdp(stack, 'MyIdp', {
                userPool: pool,
                attributeMapping: {
                    givenName: lib_1.ProviderAttribute.FACEBOOK_NAME,
                    birthdate: lib_1.ProviderAttribute.FACEBOOK_BIRTHDAY,
                },
            });
            // THEN
            expect(idp.mapping).toStrictEqual({
                given_name: 'name',
                birthdate: 'birthday',
            });
        });
        test('custom', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'UserPool');
            // WHEN
            const idp = new MyIdp(stack, 'MyIdp', {
                userPool: pool,
                attributeMapping: {
                    custom: {
                        'custom-attr-1': lib_1.ProviderAttribute.AMAZON_EMAIL,
                        'custom-attr-2': lib_1.ProviderAttribute.AMAZON_NAME,
                    },
                },
            });
            // THEN
            expect(idp.mapping).toStrictEqual({
                'custom-attr-1': 'email',
                'custom-attr-2': 'name',
            });
        });
        test('custom provider attribute', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'UserPool');
            // WHEN
            const idp = new MyIdp(stack, 'MyIdp', {
                userPool: pool,
                attributeMapping: {
                    address: lib_1.ProviderAttribute.other('custom-provider-attr'),
                },
            });
            // THEN
            expect(idp.mapping).toStrictEqual({
                address: 'custom-provider-attr',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXNDO0FBQ3RDLG1DQUF3RDtBQUN4RCw0RkFBbUc7QUFFbkcsTUFBTSxLQUFNLFNBQVEsaURBQTRCO0lBQWhEOztRQUNrQixpQkFBWSxHQUFHLFlBQVksQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDN0QsQ0FBQztDQUFBO0FBRUQsUUFBUSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUN4QyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDM0IsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxRQUFRLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQztZQUNILE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3RDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGdCQUFnQixFQUFFLEVBQUU7YUFDckIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7WUFDL0IsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRTdDLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUNwQyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxnQkFBZ0IsRUFBRTtvQkFDaEIsU0FBUyxFQUFFLHVCQUFpQixDQUFDLGFBQWE7b0JBQzFDLFNBQVMsRUFBRSx1QkFBaUIsQ0FBQyxpQkFBaUI7aUJBQy9DO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUNoQyxVQUFVLEVBQUUsTUFBTTtnQkFDbEIsU0FBUyxFQUFFLFVBQVU7YUFDdEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNsQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3BDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGdCQUFnQixFQUFFO29CQUNoQixNQUFNLEVBQUU7d0JBQ04sZUFBZSxFQUFFLHVCQUFpQixDQUFDLFlBQVk7d0JBQy9DLGVBQWUsRUFBRSx1QkFBaUIsQ0FBQyxXQUFXO3FCQUMvQztpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDaEMsZUFBZSxFQUFFLE9BQU87Z0JBQ3hCLGVBQWUsRUFBRSxNQUFNO2FBQ3hCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtZQUNyQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFN0MsT0FBTztZQUNQLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3BDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGdCQUFnQixFQUFFO29CQUNoQixPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDO2lCQUN6RDthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDaEMsT0FBTyxFQUFFLHNCQUFzQjthQUNoQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUHJvdmlkZXJBdHRyaWJ1dGUsIFVzZXJQb29sIH0gZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2UgfSBmcm9tICcuLi8uLi9saWIvdXNlci1wb29sLWlkcHMvcHJpdmF0ZS91c2VyLXBvb2wtaWRwLWJhc2UnO1xuXG5jbGFzcyBNeUlkcCBleHRlbmRzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lID0gJ015UHJvdmlkZXInO1xuICBwdWJsaWMgcmVhZG9ubHkgbWFwcGluZyA9IHRoaXMuY29uZmlndXJlQXR0cmlidXRlTWFwcGluZygpO1xufVxuXG5kZXNjcmliZSgnVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXR0cmlidXRlIG1hcHBpbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnYWJzZW50IG9yIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnVXNlclBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaWRwMSA9IG5ldyBNeUlkcChzdGFjaywgJ015SWRwMScsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGlkcDIgPSBuZXcgTXlJZHAoc3RhY2ssICdNeUlkcDInLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBhdHRyaWJ1dGVNYXBwaW5nOiB7fSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoaWRwMS5tYXBwaW5nKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICBleHBlY3QoaWRwMi5tYXBwaW5nKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdGFuZGFyZCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnVXNlclBvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaWRwID0gbmV3IE15SWRwKHN0YWNrLCAnTXlJZHAnLCB7XG4gICAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgICAgICBhdHRyaWJ1dGVNYXBwaW5nOiB7XG4gICAgICAgICAgZ2l2ZW5OYW1lOiBQcm92aWRlckF0dHJpYnV0ZS5GQUNFQk9PS19OQU1FLFxuICAgICAgICAgIGJpcnRoZGF0ZTogUHJvdmlkZXJBdHRyaWJ1dGUuRkFDRUJPT0tfQklSVEhEQVksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGlkcC5tYXBwaW5nKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICAgZ2l2ZW5fbmFtZTogJ25hbWUnLFxuICAgICAgICBiaXJ0aGRhdGU6ICdiaXJ0aGRheScsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2N1c3RvbScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1VzZXJQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGlkcCA9IG5ldyBNeUlkcChzdGFjaywgJ015SWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGN1c3RvbToge1xuICAgICAgICAgICAgJ2N1c3RvbS1hdHRyLTEnOiBQcm92aWRlckF0dHJpYnV0ZS5BTUFaT05fRU1BSUwsXG4gICAgICAgICAgICAnY3VzdG9tLWF0dHItMic6IFByb3ZpZGVyQXR0cmlidXRlLkFNQVpPTl9OQU1FLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGlkcC5tYXBwaW5nKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICAgJ2N1c3RvbS1hdHRyLTEnOiAnZW1haWwnLFxuICAgICAgICAnY3VzdG9tLWF0dHItMic6ICduYW1lJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3VzdG9tIHByb3ZpZGVyIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1VzZXJQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGlkcCA9IG5ldyBNeUlkcChzdGFjaywgJ015SWRwJywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgYXR0cmlidXRlTWFwcGluZzoge1xuICAgICAgICAgIGFkZHJlc3M6IFByb3ZpZGVyQXR0cmlidXRlLm90aGVyKCdjdXN0b20tcHJvdmlkZXItYXR0cicpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChpZHAubWFwcGluZykudG9TdHJpY3RFcXVhbCh7XG4gICAgICAgIGFkZHJlc3M6ICdjdXN0b20tcHJvdmlkZXItYXR0cicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTsiXX0=