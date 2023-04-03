"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = void 0;
// eslint-disable-next-line import/order
const iam = require("@aws-cdk/aws-iam");
function createRole(scope, _role) {
    let role = _role;
    if (!role) {
        role = new iam.Role(scope, 'Role', {
            assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
        });
    }
    return role;
}
exports.createRole = createRole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFHeEMsU0FBZ0IsVUFBVSxDQUFDLEtBQTJCLEVBQUUsS0FBaUI7SUFDdkUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDakMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDO1NBQ2pFLENBQUMsQ0FBQztLQUNKO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVEQsZ0NBU0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L29yZGVyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUm9sZShzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIF9yb2xlPzogaWFtLklSb2xlKSB7XG4gIGxldCByb2xlID0gX3JvbGU7XG4gIGlmICghcm9sZSkge1xuICAgIHJvbGUgPSBuZXcgaWFtLlJvbGUoc2NvcGUsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2F1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByb2xlO1xufVxuIl19