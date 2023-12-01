"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    const key = event.headers['x-api-key'];
    return {
        isAuthorized: key === '123',
    };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFeEIsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQXVDLEVBQUUsRUFBRTtJQUN2RSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXZDLE9BQU87UUFDTCxZQUFZLEVBQUUsR0FBRyxLQUFLLEtBQUs7S0FDNUIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQU5XLFFBQUEsT0FBTyxXQU1sQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFXU0xhbWJkYS5BUElHYXRld2F5UHJveHlFdmVudFYyKSA9PiB7XG4gIGNvbnN0IGtleSA9IGV2ZW50LmhlYWRlcnNbJ3gtYXBpLWtleSddO1xuXG4gIHJldHVybiB7XG4gICAgaXNBdXRob3JpemVkOiBrZXkgPT09ICcxMjMnLFxuICB9O1xufTsiXX0=