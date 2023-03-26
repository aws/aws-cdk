"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./aspects"), exports);
__exportStar(require("./bastion-host"), exports);
__exportStar(require("./connections"), exports);
__exportStar(require("./cfn-init"), exports);
__exportStar(require("./cfn-init-elements"), exports);
__exportStar(require("./instance-types"), exports);
__exportStar(require("./instance"), exports);
__exportStar(require("./launch-template"), exports);
__exportStar(require("./machine-image"), exports);
__exportStar(require("./nat"), exports);
__exportStar(require("./network-acl"), exports);
__exportStar(require("./network-acl-types"), exports);
__exportStar(require("./port"), exports);
__exportStar(require("./security-group"), exports);
__exportStar(require("./subnet"), exports);
__exportStar(require("./peer"), exports);
__exportStar(require("./volume"), exports);
__exportStar(require("./vpc"), exports);
__exportStar(require("./vpc-lookup"), exports);
__exportStar(require("./vpn"), exports);
__exportStar(require("./vpc-endpoint"), exports);
__exportStar(require("./vpc-endpoint-service"), exports);
__exportStar(require("./user-data"), exports);
__exportStar(require("./windows-versions"), exports);
__exportStar(require("./vpc-flow-logs"), exports);
__exportStar(require("./client-vpn-endpoint-types"), exports);
__exportStar(require("./client-vpn-endpoint"), exports);
__exportStar(require("./client-vpn-authorization-rule"), exports);
__exportStar(require("./client-vpn-route"), exports);
__exportStar(require("./ip-addresses"), exports);
// AWS::EC2 CloudFormation Resources:
__exportStar(require("./ec2.generated"), exports);
require("./ec2-augmentations.generated");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBMEI7QUFDMUIsaURBQStCO0FBQy9CLGdEQUE4QjtBQUM5Qiw2Q0FBMkI7QUFDM0Isc0RBQW9DO0FBQ3BDLG1EQUFpQztBQUNqQyw2Q0FBMkI7QUFDM0Isb0RBQWtDO0FBQ2xDLGtEQUFnQztBQUNoQyx3Q0FBc0I7QUFDdEIsZ0RBQThCO0FBQzlCLHNEQUFvQztBQUNwQyx5Q0FBdUI7QUFDdkIsbURBQWlDO0FBQ2pDLDJDQUF5QjtBQUN6Qix5Q0FBdUI7QUFDdkIsMkNBQXlCO0FBQ3pCLHdDQUFzQjtBQUN0QiwrQ0FBNkI7QUFDN0Isd0NBQXNCO0FBQ3RCLGlEQUErQjtBQUMvQix5REFBdUM7QUFDdkMsOENBQTRCO0FBQzVCLHFEQUFtQztBQUNuQyxrREFBZ0M7QUFDaEMsOERBQTRDO0FBQzVDLHdEQUFzQztBQUN0QyxrRUFBZ0Q7QUFDaEQscURBQW1DO0FBQ25DLGlEQUErQjtBQUUvQixxQ0FBcUM7QUFDckMsa0RBQWdDO0FBRWhDLHlDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vYXNwZWN0cyc7XG5leHBvcnQgKiBmcm9tICcuL2Jhc3Rpb24taG9zdCc7XG5leHBvcnQgKiBmcm9tICcuL2Nvbm5lY3Rpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vY2ZuLWluaXQnO1xuZXhwb3J0ICogZnJvbSAnLi9jZm4taW5pdC1lbGVtZW50cyc7XG5leHBvcnQgKiBmcm9tICcuL2luc3RhbmNlLXR5cGVzJztcbmV4cG9ydCAqIGZyb20gJy4vaW5zdGFuY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9sYXVuY2gtdGVtcGxhdGUnO1xuZXhwb3J0ICogZnJvbSAnLi9tYWNoaW5lLWltYWdlJztcbmV4cG9ydCAqIGZyb20gJy4vbmF0JztcbmV4cG9ydCAqIGZyb20gJy4vbmV0d29yay1hY2wnO1xuZXhwb3J0ICogZnJvbSAnLi9uZXR3b3JrLWFjbC10eXBlcyc7XG5leHBvcnQgKiBmcm9tICcuL3BvcnQnO1xuZXhwb3J0ICogZnJvbSAnLi9zZWN1cml0eS1ncm91cCc7XG5leHBvcnQgKiBmcm9tICcuL3N1Ym5ldCc7XG5leHBvcnQgKiBmcm9tICcuL3BlZXInO1xuZXhwb3J0ICogZnJvbSAnLi92b2x1bWUnO1xuZXhwb3J0ICogZnJvbSAnLi92cGMnO1xuZXhwb3J0ICogZnJvbSAnLi92cGMtbG9va3VwJztcbmV4cG9ydCAqIGZyb20gJy4vdnBuJztcbmV4cG9ydCAqIGZyb20gJy4vdnBjLWVuZHBvaW50JztcbmV4cG9ydCAqIGZyb20gJy4vdnBjLWVuZHBvaW50LXNlcnZpY2UnO1xuZXhwb3J0ICogZnJvbSAnLi91c2VyLWRhdGEnO1xuZXhwb3J0ICogZnJvbSAnLi93aW5kb3dzLXZlcnNpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vdnBjLWZsb3ctbG9ncyc7XG5leHBvcnQgKiBmcm9tICcuL2NsaWVudC12cG4tZW5kcG9pbnQtdHlwZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9jbGllbnQtdnBuLWVuZHBvaW50JztcbmV4cG9ydCAqIGZyb20gJy4vY2xpZW50LXZwbi1hdXRob3JpemF0aW9uLXJ1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9jbGllbnQtdnBuLXJvdXRlJztcbmV4cG9ydCAqIGZyb20gJy4vaXAtYWRkcmVzc2VzJztcblxuLy8gQVdTOjpFQzIgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2VzOlxuZXhwb3J0ICogZnJvbSAnLi9lYzIuZ2VuZXJhdGVkJztcblxuaW1wb3J0ICcuL2VjMi1hdWdtZW50YXRpb25zLmdlbmVyYXRlZCc7XG4iXX0=