"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('log stream', () => {
    test('simple instantiation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        new lib_1.LogStream(stack, 'Stream', {
            logGroup,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', {});
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nc3RyZWFtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dzdHJlYW0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMsZ0NBQTZDO0FBRTdDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqRCxJQUFJLGVBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzdCLFFBQVE7U0FDVCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsRUFBRyxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgTG9nR3JvdXAsIExvZ1N0cmVhbSB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdsb2cgc3RyZWFtJywgKCkgPT4ge1xuICB0ZXN0KCdzaW1wbGUgaW5zdGFudGlhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgbmV3IExvZ1N0cmVhbShzdGFjaywgJ1N0cmVhbScsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ1N0cmVhbScsIHsgfSk7XG4gIH0pO1xufSk7XG4iXX0=