"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3 = require("aws-cdk-lib/aws-s3");
const core = require("aws-cdk-lib/core");
exports.default = async () => {
    const app = new core.App();
    const stack = new core.Stack(app, 'Stack1');
    new s3.Bucket(stack, 'MyBucket');
    return app.synth();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUN6Qyx5Q0FBeUM7QUFFekMsa0JBQWUsS0FBSyxJQUFJLEVBQUU7SUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JCLENBQUMsQ0FBQyJ9