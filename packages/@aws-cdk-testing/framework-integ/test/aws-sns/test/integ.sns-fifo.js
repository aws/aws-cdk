"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
class SNSFifoInteg extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new aws_sns_1.Topic(this, 'MyTopic', {
            topicName: 'fooTopic',
            displayName: 'fooDisplayName',
            contentBasedDeduplication: true,
            fifo: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new SNSFifoInteg(app, 'SNSFifoInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLWZpZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zbnMtZmlmby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFxRDtBQUNyRCxpREFBNEM7QUFFNUMsTUFBTSxZQUFhLFNBQVEsbUJBQUs7SUFDOUIsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDekIsU0FBUyxFQUFFLFVBQVU7WUFDckIsV0FBVyxFQUFFLGdCQUFnQjtZQUM3Qix5QkFBeUIsRUFBRSxJQUFJO1lBQy9CLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRXRDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBUb3BpYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuXG5jbGFzcyBTTlNGaWZvSW50ZWcgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IFRvcGljKHRoaXMsICdNeVRvcGljJywge1xuICAgICAgdG9waWNOYW1lOiAnZm9vVG9waWMnLFxuICAgICAgZGlzcGxheU5hbWU6ICdmb29EaXNwbGF5TmFtZScsXG4gICAgICBjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uOiB0cnVlLFxuICAgICAgZmlmbzogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbm5ldyBTTlNGaWZvSW50ZWcoYXBwLCAnU05TRmlmb0ludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19