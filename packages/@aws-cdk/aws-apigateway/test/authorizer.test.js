"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('authorizer', () => {
    test('isAuthorizer correctly detects an instance of type Authorizer', () => {
        class MyAuthorizer extends lib_1.Authorizer {
            constructor() {
                super(...arguments);
                this.authorizerId = 'test-authorizer-id';
            }
            _attachToApi(_) {
            }
        }
        const stack = new core_1.Stack();
        const authorizer = new MyAuthorizer(stack, 'authorizer');
        expect(lib_1.Authorizer.isAuthorizer(authorizer)).toEqual(true);
        expect(lib_1.Authorizer.isAuthorizer(stack)).toEqual(false);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aG9yaXplci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXNDO0FBQ3RDLGdDQUE4QztBQUU5QyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1FBQ3pFLE1BQU0sWUFBYSxTQUFRLGdCQUFVO1lBQXJDOztnQkFDa0IsaUJBQVksR0FBRyxvQkFBb0IsQ0FBQztZQUl0RCxDQUFDO1lBSFEsWUFBWSxDQUFDLENBQVc7YUFFOUI7U0FDRjtRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXpELE1BQU0sQ0FBQyxnQkFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxNQUFNLENBQUMsZ0JBQVUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBdXRob3JpemVyLCBJUmVzdEFwaSB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdhdXRob3JpemVyJywgKCkgPT4ge1xuICB0ZXN0KCdpc0F1dGhvcml6ZXIgY29ycmVjdGx5IGRldGVjdHMgYW4gaW5zdGFuY2Ugb2YgdHlwZSBBdXRob3JpemVyJywgKCkgPT4ge1xuICAgIGNsYXNzIE15QXV0aG9yaXplciBleHRlbmRzIEF1dGhvcml6ZXIge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGF1dGhvcml6ZXJJZCA9ICd0ZXN0LWF1dGhvcml6ZXItaWQnO1xuICAgICAgcHVibGljIF9hdHRhY2hUb0FwaShfOiBJUmVzdEFwaSk6IHZvaWQge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXV0aG9yaXplciA9IG5ldyBNeUF1dGhvcml6ZXIoc3RhY2ssICdhdXRob3JpemVyJyk7XG5cbiAgICBleHBlY3QoQXV0aG9yaXplci5pc0F1dGhvcml6ZXIoYXV0aG9yaXplcikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KEF1dGhvcml6ZXIuaXNBdXRob3JpemVyKHN0YWNrKSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xufSk7Il19