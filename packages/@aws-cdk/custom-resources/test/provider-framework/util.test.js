"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../lib/provider-framework/runtime/util");
test('withRetries() will invoke a throwing function multiple times', async () => {
    let invocations = 0;
    const retryOptions = {
        attempts: 3,
        sleep: 0,
    };
    await expect(() => util_1.withRetries(retryOptions, async () => {
        invocations += 1;
        throw new Error('Oh no');
    })()).rejects.toThrow(/Oh no/);
    expect(invocations).toBeGreaterThan(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0VBQXdFO0FBRXhFLElBQUksQ0FBQyw4REFBOEQsRUFBRSxLQUFLLElBQUksRUFBRTtJQUM5RSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDcEIsTUFBTSxZQUFZLEdBQUc7UUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDWCxLQUFLLEVBQUUsQ0FBQztLQUNULENBQUM7SUFFRixNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBVyxDQUFDLFlBQVksRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0RCxXQUFXLElBQUksQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHdpdGhSZXRyaWVzIH0gZnJvbSAnLi4vLi4vbGliL3Byb3ZpZGVyLWZyYW1ld29yay9ydW50aW1lL3V0aWwnO1xuXG50ZXN0KCd3aXRoUmV0cmllcygpIHdpbGwgaW52b2tlIGEgdGhyb3dpbmcgZnVuY3Rpb24gbXVsdGlwbGUgdGltZXMnLCBhc3luYyAoKSA9PiB7XG4gIGxldCBpbnZvY2F0aW9ucyA9IDA7XG4gIGNvbnN0IHJldHJ5T3B0aW9ucyA9IHtcbiAgICBhdHRlbXB0czogMyxcbiAgICBzbGVlcDogMCxcbiAgfTtcblxuICBhd2FpdCBleHBlY3QoKCkgPT4gd2l0aFJldHJpZXMocmV0cnlPcHRpb25zLCBhc3luYyAoKSA9PiB7XG4gICAgaW52b2NhdGlvbnMgKz0gMTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09oIG5vJyk7XG4gIH0pKCkpLnJlamVjdHMudG9UaHJvdygvT2ggbm8vKTtcblxuICBleHBlY3QoaW52b2NhdGlvbnMpLnRvQmVHcmVhdGVyVGhhbigxKTtcbn0pOyJdfQ==