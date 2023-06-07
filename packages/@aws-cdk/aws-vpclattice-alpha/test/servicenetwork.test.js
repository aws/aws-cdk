"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const core = require("aws-cdk-lib");
const vpclattice = require("../lib");
/* We allow quotes in the object keys used for CloudFormation template assertions */
/* eslint-disable quote-props */
describe('Example Resource', () => {
    let stack;
    beforeEach(() => {
        // try to factor out as much boilerplate test setup to before methods -
        // makes the tests much more readable
        stack = new core.Stack();
    });
    describe('created with default properties', () => {
        beforeEach(() => {
            new vpclattice.ServiceNetwork(stack, 'ServiceNetwork', {});
        });
        test('creates a lattice network', () => {
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::VpcLattice::ServiceNetwork', 1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZW5ldHdvcmsudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcnZpY2VuZXR3b3JrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBa0Q7QUFDbEQsb0NBQW9DO0FBQ3BDLHFDQUFxQztBQUVyQyxvRkFBb0Y7QUFDcEYsZ0NBQWdDO0FBR2hDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxLQUFpQixDQUFDO0lBRXRCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCx1RUFBdUU7UUFDdkUscUNBQXFDO1FBQ3JDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFFL0MsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyB2cGNsYXR0aWNlIGZyb20gJy4uL2xpYic7XG5cbi8qIFdlIGFsbG93IHF1b3RlcyBpbiB0aGUgb2JqZWN0IGtleXMgdXNlZCBmb3IgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgYXNzZXJ0aW9ucyAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuXG5kZXNjcmliZSgnRXhhbXBsZSBSZXNvdXJjZScsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjb3JlLlN0YWNrO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIHRyeSB0byBmYWN0b3Igb3V0IGFzIG11Y2ggYm9pbGVycGxhdGUgdGVzdCBzZXR1cCB0byBiZWZvcmUgbWV0aG9kcyAtXG4gICAgLy8gbWFrZXMgdGhlIHRlc3RzIG11Y2ggbW9yZSByZWFkYWJsZVxuICAgIHN0YWNrID0gbmV3IGNvcmUuU3RhY2soKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NyZWF0ZWQgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG5ldyB2cGNsYXR0aWNlLlNlcnZpY2VOZXR3b3JrKHN0YWNrLCAnU2VydmljZU5ldHdvcmsnLCB7fSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjcmVhdGVzIGEgbGF0dGljZSBuZXR3b3JrJywgKCkgPT4ge1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6VnBjTGF0dGljZTo6U2VydmljZU5ldHdvcmsnLCAxKTtcbiAgICB9KTtcblxuICB9KTtcbn0pO1xuIl19