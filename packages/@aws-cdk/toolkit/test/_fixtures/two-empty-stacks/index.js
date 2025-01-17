"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("aws-cdk-lib/core");
exports.default = async () => {
    const app = new core.App();
    new core.Stack(app, 'Stack1');
    new core.Stack(app, 'Stack2');
    // @todo fix api
    return app.synth();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUV6QyxrQkFBZSxLQUFLLElBQUksRUFBRTtJQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFOUIsZ0JBQWdCO0lBQ2hCLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBUyxDQUFDO0FBQzVCLENBQUMsQ0FBQyJ9