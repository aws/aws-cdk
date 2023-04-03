"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('dynamic reference', () => {
    test('can create dynamic references with service and key with colons', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        const ref = new lib_1.CfnDynamicReference(lib_1.CfnDynamicReferenceService.SSM, 'a:b:c');
        // THEN
        expect(stack.resolve(ref)).toEqual('{{resolve:ssm:a:b:c}}');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1yZWZlcmVuY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImR5bmFtaWMtcmVmZXJlbmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBZ0Y7QUFFaEYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLHlCQUFtQixDQUFDLGdDQUEwQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU3RSxPQUFPO1FBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuRHluYW1pY1JlZmVyZW5jZSwgQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UsIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2R5bmFtaWMgcmVmZXJlbmNlJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gY3JlYXRlIGR5bmFtaWMgcmVmZXJlbmNlcyB3aXRoIHNlcnZpY2UgYW5kIGtleSB3aXRoIGNvbG9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVmID0gbmV3IENmbkR5bmFtaWNSZWZlcmVuY2UoQ2ZuRHluYW1pY1JlZmVyZW5jZVNlcnZpY2UuU1NNLCAnYTpiOmMnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZWYpKS50b0VxdWFsKCd7e3Jlc29sdmU6c3NtOmE6YjpjfX0nKTtcbiAgfSk7XG59KTtcbiJdfQ==