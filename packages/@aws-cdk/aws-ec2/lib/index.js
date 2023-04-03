"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
__exportStar(require("./prefix-list"), exports);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQTBCO0FBQzFCLGlEQUErQjtBQUMvQixnREFBOEI7QUFDOUIsNkNBQTJCO0FBQzNCLHNEQUFvQztBQUNwQyxtREFBaUM7QUFDakMsNkNBQTJCO0FBQzNCLG9EQUFrQztBQUNsQyxrREFBZ0M7QUFDaEMsd0NBQXNCO0FBQ3RCLGdEQUE4QjtBQUM5QixzREFBb0M7QUFDcEMseUNBQXVCO0FBQ3ZCLG1EQUFpQztBQUNqQywyQ0FBeUI7QUFDekIseUNBQXVCO0FBQ3ZCLGdEQUE4QjtBQUM5QiwyQ0FBeUI7QUFDekIsd0NBQXNCO0FBQ3RCLCtDQUE2QjtBQUM3Qix3Q0FBc0I7QUFDdEIsaURBQStCO0FBQy9CLHlEQUF1QztBQUN2Qyw4Q0FBNEI7QUFDNUIscURBQW1DO0FBQ25DLGtEQUFnQztBQUNoQyw4REFBNEM7QUFDNUMsd0RBQXNDO0FBQ3RDLGtFQUFnRDtBQUNoRCxxREFBbUM7QUFDbkMsaURBQStCO0FBRS9CLHFDQUFxQztBQUNyQyxrREFBZ0M7QUFFaEMseUNBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9hc3BlY3RzJztcbmV4cG9ydCAqIGZyb20gJy4vYmFzdGlvbi1ob3N0JztcbmV4cG9ydCAqIGZyb20gJy4vY29ubmVjdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9jZm4taW5pdCc7XG5leHBvcnQgKiBmcm9tICcuL2Nmbi1pbml0LWVsZW1lbnRzJztcbmV4cG9ydCAqIGZyb20gJy4vaW5zdGFuY2UtdHlwZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9pbnN0YW5jZSc7XG5leHBvcnQgKiBmcm9tICcuL2xhdW5jaC10ZW1wbGF0ZSc7XG5leHBvcnQgKiBmcm9tICcuL21hY2hpbmUtaW1hZ2UnO1xuZXhwb3J0ICogZnJvbSAnLi9uYXQnO1xuZXhwb3J0ICogZnJvbSAnLi9uZXR3b3JrLWFjbCc7XG5leHBvcnQgKiBmcm9tICcuL25ldHdvcmstYWNsLXR5cGVzJztcbmV4cG9ydCAqIGZyb20gJy4vcG9ydCc7XG5leHBvcnQgKiBmcm9tICcuL3NlY3VyaXR5LWdyb3VwJztcbmV4cG9ydCAqIGZyb20gJy4vc3VibmV0JztcbmV4cG9ydCAqIGZyb20gJy4vcGVlcic7XG5leHBvcnQgKiBmcm9tICcuL3ByZWZpeC1saXN0JztcbmV4cG9ydCAqIGZyb20gJy4vdm9sdW1lJztcbmV4cG9ydCAqIGZyb20gJy4vdnBjJztcbmV4cG9ydCAqIGZyb20gJy4vdnBjLWxvb2t1cCc7XG5leHBvcnQgKiBmcm9tICcuL3Zwbic7XG5leHBvcnQgKiBmcm9tICcuL3ZwYy1lbmRwb2ludCc7XG5leHBvcnQgKiBmcm9tICcuL3ZwYy1lbmRwb2ludC1zZXJ2aWNlJztcbmV4cG9ydCAqIGZyb20gJy4vdXNlci1kYXRhJztcbmV4cG9ydCAqIGZyb20gJy4vd2luZG93cy12ZXJzaW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL3ZwYy1mbG93LWxvZ3MnO1xuZXhwb3J0ICogZnJvbSAnLi9jbGllbnQtdnBuLWVuZHBvaW50LXR5cGVzJztcbmV4cG9ydCAqIGZyb20gJy4vY2xpZW50LXZwbi1lbmRwb2ludCc7XG5leHBvcnQgKiBmcm9tICcuL2NsaWVudC12cG4tYXV0aG9yaXphdGlvbi1ydWxlJztcbmV4cG9ydCAqIGZyb20gJy4vY2xpZW50LXZwbi1yb3V0ZSc7XG5leHBvcnQgKiBmcm9tICcuL2lwLWFkZHJlc3Nlcyc7XG5cbi8vIEFXUzo6RUMyIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vZWMyLmdlbmVyYXRlZCc7XG5cbmltcG9ydCAnLi9lYzItYXVnbWVudGF0aW9ucy5nZW5lcmF0ZWQnO1xuIl19