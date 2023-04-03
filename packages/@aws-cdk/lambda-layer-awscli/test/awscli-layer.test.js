"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('synthesized to a layer version', () => {
    //GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.AwsCliLayer(stack, 'MyLayer');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
        Description: '/opt/awscli/aws',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzY2xpLWxheWVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3NjbGktbGF5ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsZ0NBQXFDO0FBRXJDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFDMUMsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFbEMsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1FBQzNFLFdBQVcsRUFBRSxpQkFBaUI7S0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEF3c0NsaUxheWVyIH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnc3ludGhlc2l6ZWQgdG8gYSBsYXllciB2ZXJzaW9uJywgKCkgPT4ge1xuICAvL0dJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ2xpTGF5ZXIoc3RhY2ssICdNeUxheWVyJyk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkxheWVyVmVyc2lvbicsIHtcbiAgICBEZXNjcmlwdGlvbjogJy9vcHQvYXdzY2xpL2F3cycsXG4gIH0pO1xufSk7XG4iXX0=