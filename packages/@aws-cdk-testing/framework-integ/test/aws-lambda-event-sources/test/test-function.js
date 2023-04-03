"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFunction = void 0;
const lambda = require("aws-cdk-lib/aws-lambda");
class TestFunction extends lambda.Function {
    constructor(scope, id) {
        super(scope, id, {
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
    }
}
exports.TestFunction = TestFunction;
/* eslint-disable no-console */
async function handler(event) {
    console.log('event:', JSON.stringify(event, undefined, 2));
    return { event };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QtZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQWlEO0FBR2pELE1BQWEsWUFBYSxTQUFRLE1BQU0sQ0FBQyxRQUFRO0lBQy9DLFlBQVksS0FBMkIsRUFBRSxFQUFVO1FBQ2pELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztZQUN2RSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQVJELG9DQVFDO0FBRUQsK0JBQStCO0FBQy9CLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBVTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRCxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBjbGFzcyBUZXN0RnVuY3Rpb24gZXh0ZW5kcyBsYW1iZGEuRnVuY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9ICR7aGFuZGxlci50b1N0cmluZygpfWApLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gIH1cbn1cblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogYW55KSB7XG4gIGNvbnNvbGUubG9nKCdldmVudDonLCBKU09OLnN0cmluZ2lmeShldmVudCwgdW5kZWZpbmVkLCAyKSk7XG4gIHJldHVybiB7IGV2ZW50IH07XG59XG4iXX0=