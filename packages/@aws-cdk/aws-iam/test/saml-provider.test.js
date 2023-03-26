"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
let stack;
beforeEach(() => {
    stack = new core_1.Stack();
});
test('SAML provider', () => {
    new lib_1.SamlProvider(stack, 'Provider', {
        metadataDocument: lib_1.SamlMetadataDocument.fromXml('document'),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
        SamlMetadataDocument: 'document',
    });
});
test('SAML provider name', () => {
    new lib_1.SamlProvider(stack, 'Provider', {
        metadataDocument: lib_1.SamlMetadataDocument.fromXml('document'),
        name: 'provider-name',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
        SamlMetadataDocument: 'document',
        Name: 'provider-name',
    });
});
test('throws with invalid name', () => {
    expect(() => new lib_1.SamlProvider(stack, 'Provider', {
        name: 'invalid name',
        metadataDocument: lib_1.SamlMetadataDocument.fromXml('document'),
    })).toThrow(/Invalid SAML provider name/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtbC1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2FtbC1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxnQ0FBNEQ7QUFFNUQsSUFBSSxLQUFZLENBQUM7QUFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0FBQ3RCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDbEMsZ0JBQWdCLEVBQUUsMEJBQW9CLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUMzRCxDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtRQUN4RSxvQkFBb0IsRUFBRSxVQUFVO0tBQ2pDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUM5QixJQUFJLGtCQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNsQyxnQkFBZ0IsRUFBRSwwQkFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQzFELElBQUksRUFBRSxlQUFlO0tBQ3RCLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1FBQ3hFLG9CQUFvQixFQUFFLFVBQVU7UUFDaEMsSUFBSSxFQUFFLGVBQWU7S0FDdEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGtCQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUMvQyxJQUFJLEVBQUUsY0FBYztRQUNwQixnQkFBZ0IsRUFBRSwwQkFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0tBQzNELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTYW1sTWV0YWRhdGFEb2N1bWVudCwgU2FtbFByb3ZpZGVyIH0gZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBTdGFjaztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xufSk7XG5cbnRlc3QoJ1NBTUwgcHJvdmlkZXInLCAoKSA9PiB7XG4gIG5ldyBTYW1sUHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcicsIHtcbiAgICBtZXRhZGF0YURvY3VtZW50OiBTYW1sTWV0YWRhdGFEb2N1bWVudC5mcm9tWG1sKCdkb2N1bWVudCcpLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlNBTUxQcm92aWRlcicsIHtcbiAgICBTYW1sTWV0YWRhdGFEb2N1bWVudDogJ2RvY3VtZW50JyxcbiAgfSk7XG59KTtcblxudGVzdCgnU0FNTCBwcm92aWRlciBuYW1lJywgKCkgPT4ge1xuICBuZXcgU2FtbFByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXInLCB7XG4gICAgbWV0YWRhdGFEb2N1bWVudDogU2FtbE1ldGFkYXRhRG9jdW1lbnQuZnJvbVhtbCgnZG9jdW1lbnQnKSxcbiAgICBuYW1lOiAncHJvdmlkZXItbmFtZScsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6U0FNTFByb3ZpZGVyJywge1xuICAgIFNhbWxNZXRhZGF0YURvY3VtZW50OiAnZG9jdW1lbnQnLFxuICAgIE5hbWU6ICdwcm92aWRlci1uYW1lJyxcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIHdpdGggaW52YWxpZCBuYW1lJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4gbmV3IFNhbWxQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyJywge1xuICAgIG5hbWU6ICdpbnZhbGlkIG5hbWUnLFxuICAgIG1ldGFkYXRhRG9jdW1lbnQ6IFNhbWxNZXRhZGF0YURvY3VtZW50LmZyb21YbWwoJ2RvY3VtZW50JyksXG4gIH0pKS50b1Rocm93KC9JbnZhbGlkIFNBTUwgcHJvdmlkZXIgbmFtZS8pO1xufSk7XG4iXX0=