"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/* eslint-disable no-console */
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const delay_1 = require("delay");
const s3 = new aws_sdk_1.S3();
async function handler() {
    console.log(s3);
    await (0, delay_1.default)(5);
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwZW5kZW5jaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixxQ0FBNkIsQ0FBQyx3REFBd0Q7QUFDdEYsaUNBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxFQUFFLENBQUM7QUFFYixLQUFLLFVBQVUsT0FBTztJQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hCLE1BQU0sSUFBQSxlQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsQ0FBQztBQUhELDBCQUdDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgUzMgfSBmcm9tICdhd3Mtc2RrJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCBkZWxheSBmcm9tICdkZWxheSc7XG5cbmNvbnN0IHMzID0gbmV3IFMzKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICBjb25zb2xlLmxvZyhzMyk7XG4gIGF3YWl0IGRlbGF5KDUpO1xufVxuIl19