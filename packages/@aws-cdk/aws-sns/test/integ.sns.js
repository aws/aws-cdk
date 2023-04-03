"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_kms_1 = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
class SNSInteg extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const key = new aws_kms_1.Key(this, 'CustomKey');
        new lib_1.Topic(this, 'MyTopic', {
            topicName: 'fooTopic',
            displayName: 'fooDisplayName',
            masterKey: key,
        });
    }
}
const app = new core_1.App();
new SNSInteg(app, 'SNSInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQXVDO0FBQ3ZDLHdDQUF1RDtBQUN2RCxnQ0FBK0I7QUFFL0IsTUFBTSxRQUFTLFNBQVEsWUFBSztJQUMxQixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXZDLElBQUksV0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDekIsU0FBUyxFQUFFLFVBQVU7WUFDckIsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixTQUFTLEVBQUUsR0FBRztTQUNmLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBRXRCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUU5QixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLZXkgfSBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRvcGljIH0gZnJvbSAnLi4vbGliJztcblxuY2xhc3MgU05TSW50ZWcgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IEtleSh0aGlzLCAnQ3VzdG9tS2V5Jyk7XG5cbiAgICBuZXcgVG9waWModGhpcywgJ015VG9waWMnLCB7XG4gICAgICB0b3BpY05hbWU6ICdmb29Ub3BpYycsXG4gICAgICBkaXNwbGF5TmFtZTogJ2Zvb0Rpc3BsYXlOYW1lJyxcbiAgICAgIG1hc3RlcktleToga2V5LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IFNOU0ludGVnKGFwcCwgJ1NOU0ludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19