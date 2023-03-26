"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
class SNSFifoInteg extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lib_1.Topic(this, 'MyTopic', {
            topicName: 'fooTopic',
            displayName: 'fooDisplayName',
            contentBasedDeduplication: true,
            fifo: true,
        });
    }
}
const app = new core_1.App();
new SNSFifoInteg(app, 'SNSFifoInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLWZpZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zbnMtZmlmby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF1RDtBQUN2RCxnQ0FBK0I7QUFFL0IsTUFBTSxZQUFhLFNBQVEsWUFBSztJQUM5QixZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN6QixTQUFTLEVBQUUsVUFBVTtZQUNyQixXQUFXLEVBQUUsZ0JBQWdCO1lBQzdCLHlCQUF5QixFQUFFLElBQUk7WUFDL0IsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFdEMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVG9waWMgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBTTlNGaWZvSW50ZWcgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgbmV3IFRvcGljKHRoaXMsICdNeVRvcGljJywge1xuICAgICAgdG9waWNOYW1lOiAnZm9vVG9waWMnLFxuICAgICAgZGlzcGxheU5hbWU6ICdmb29EaXNwbGF5TmFtZScsXG4gICAgICBjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uOiB0cnVlLFxuICAgICAgZmlmbzogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbm5ldyBTTlNGaWZvSW50ZWcoYXBwLCAnU05TRmlmb0ludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19