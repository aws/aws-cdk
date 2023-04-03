"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderData = void 0;
const core_1 = require("@aws-cdk/core");
/**
 * Renders the given string data as deployable content with markers substituted
 * for all "Ref" and "Fn::GetAtt" objects.
 *
 * @param scope Construct scope
 * @param data The input data
 * @returns The markered text (`text`) and a map that maps marker names to their
 * values (`markers`).
 */
function renderData(scope, data) {
    const obj = core_1.Stack.of(scope).resolve(data);
    if (typeof (obj) === 'string') {
        return { text: obj, markers: {} };
    }
    if (typeof (obj) !== 'object') {
        throw new Error(`Unexpected: after resolve() data must either be a string or a CloudFormation intrinsic. Got: ${JSON.stringify(obj)}`);
    }
    let markerIndex = 0;
    const markers = {};
    const result = new Array();
    const fnJoin = obj['Fn::Join'];
    if (fnJoin) {
        const sep = fnJoin[0];
        const parts = fnJoin[1];
        if (sep !== '') {
            throw new Error(`Unexpected "Fn::Join", expecting separator to be an empty string but got "${sep}"`);
        }
        for (const part of parts) {
            if (typeof (part) === 'string') {
                result.push(part);
                continue;
            }
            if (typeof (part) === 'object') {
                addMarker(part);
                continue;
            }
            throw new Error(`Unexpected "Fn::Join" part, expecting string or object but got ${typeof (part)}`);
        }
    }
    else if (obj.Ref || obj['Fn::GetAtt']) {
        addMarker(obj);
    }
    else {
        throw new Error('Unexpected: Expecting `resolve()` to return "Fn::Join", "Ref" or "Fn::GetAtt"');
    }
    function addMarker(part) {
        const keys = Object.keys(part);
        if (keys.length !== 1 || (keys[0] != 'Ref' && keys[0] != 'Fn::GetAtt')) {
            throw new Error(`Invalid CloudFormation reference. "Ref" or "Fn::GetAtt". Got ${JSON.stringify(part)}`);
        }
        const marker = `<<marker:0xbaba:${markerIndex++}>>`;
        result.push(marker);
        markers[marker] = part;
    }
    return { text: result.join(''), markers };
}
exports.renderData = renderData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXItZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBc0M7QUFRdEM7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixVQUFVLENBQUMsS0FBZ0IsRUFBRSxJQUFZO0lBQ3ZELE1BQU0sR0FBRyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLElBQUksT0FBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUM1QixPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7S0FDbkM7SUFFRCxJQUFJLE9BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnR0FBZ0csSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDeEk7SUFFRCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDcEIsTUFBTSxPQUFPLEdBQStCLEVBQUUsQ0FBQztJQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO0lBQ25DLE1BQU0sTUFBTSxHQUF1QixHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFbkQsSUFBSSxNQUFNLEVBQUU7UUFDVixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhCLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsNkVBQTZFLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDdEc7UUFFRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN4QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xCLFNBQVM7YUFDVjtZQUVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDOUIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQixTQUFTO2FBQ1Y7WUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BHO0tBRUY7U0FBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO1FBQ3ZDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNoQjtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO0tBQ2xHO0lBRUQsU0FBUyxTQUFTLENBQUMsSUFBa0I7UUFDbkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLEVBQUU7WUFDdEUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekc7UUFFRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsV0FBVyxFQUFFLElBQUksQ0FBQztRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBdkRELGdDQXVEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb250ZW50IHtcbiAgcmVhZG9ubHkgdGV4dDogc3RyaW5nO1xuICByZWFkb25seSBtYXJrZXJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIGdpdmVuIHN0cmluZyBkYXRhIGFzIGRlcGxveWFibGUgY29udGVudCB3aXRoIG1hcmtlcnMgc3Vic3RpdHV0ZWRcbiAqIGZvciBhbGwgXCJSZWZcIiBhbmQgXCJGbjo6R2V0QXR0XCIgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gc2NvcGUgQ29uc3RydWN0IHNjb3BlXG4gKiBAcGFyYW0gZGF0YSBUaGUgaW5wdXQgZGF0YVxuICogQHJldHVybnMgVGhlIG1hcmtlcmVkIHRleHQgKGB0ZXh0YCkgYW5kIGEgbWFwIHRoYXQgbWFwcyBtYXJrZXIgbmFtZXMgdG8gdGhlaXJcbiAqIHZhbHVlcyAoYG1hcmtlcnNgKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckRhdGEoc2NvcGU6IENvbnN0cnVjdCwgZGF0YTogc3RyaW5nKTogQ29udGVudCB7XG4gIGNvbnN0IG9iaiA9IFN0YWNrLm9mKHNjb3BlKS5yZXNvbHZlKGRhdGEpO1xuICBpZiAodHlwZW9mKG9iaikgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHsgdGV4dDogb2JqLCBtYXJrZXJzOiB7fSB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZihvYmopICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZDogYWZ0ZXIgcmVzb2x2ZSgpIGRhdGEgbXVzdCBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgYSBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWMuIEdvdDogJHtKU09OLnN0cmluZ2lmeShvYmopfWApO1xuICB9XG5cbiAgbGV0IG1hcmtlckluZGV4ID0gMDtcbiAgY29uc3QgbWFya2VyczogUmVjb3JkPHN0cmluZywgRm5Kb2luUGFydD4gPSB7fTtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgY29uc3QgZm5Kb2luOiBGbkpvaW4gfCB1bmRlZmluZWQgPSBvYmpbJ0ZuOjpKb2luJ107XG5cbiAgaWYgKGZuSm9pbikge1xuICAgIGNvbnN0IHNlcCA9IGZuSm9pblswXTtcbiAgICBjb25zdCBwYXJ0cyA9IGZuSm9pblsxXTtcblxuICAgIGlmIChzZXAgIT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgXCJGbjo6Sm9pblwiLCBleHBlY3Rpbmcgc2VwYXJhdG9yIHRvIGJlIGFuIGVtcHR5IHN0cmluZyBidXQgZ290IFwiJHtzZXB9XCJgKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICAgIGlmICh0eXBlb2YgKHBhcnQpID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXN1bHQucHVzaChwYXJ0KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgKHBhcnQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICBhZGRNYXJrZXIocGFydCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgXCJGbjo6Sm9pblwiIHBhcnQsIGV4cGVjdGluZyBzdHJpbmcgb3Igb2JqZWN0IGJ1dCBnb3QgJHt0eXBlb2YgKHBhcnQpfWApO1xuICAgIH1cblxuICB9IGVsc2UgaWYgKG9iai5SZWYgfHwgb2JqWydGbjo6R2V0QXR0J10pIHtcbiAgICBhZGRNYXJrZXIob2JqKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQ6IEV4cGVjdGluZyBgcmVzb2x2ZSgpYCB0byByZXR1cm4gXCJGbjo6Sm9pblwiLCBcIlJlZlwiIG9yIFwiRm46OkdldEF0dFwiJyk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRNYXJrZXIocGFydDogUmVmIHwgR2V0QXR0KSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHBhcnQpO1xuICAgIGlmIChrZXlzLmxlbmd0aCAhPT0gMSB8fCAoa2V5c1swXSAhPSAnUmVmJyAmJiBrZXlzWzBdICE9ICdGbjo6R2V0QXR0JykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDbG91ZEZvcm1hdGlvbiByZWZlcmVuY2UuIFwiUmVmXCIgb3IgXCJGbjo6R2V0QXR0XCIuIEdvdCAke0pTT04uc3RyaW5naWZ5KHBhcnQpfWApO1xuICAgIH1cblxuICAgIGNvbnN0IG1hcmtlciA9IGA8PG1hcmtlcjoweGJhYmE6JHttYXJrZXJJbmRleCsrfT4+YDtcbiAgICByZXN1bHQucHVzaChtYXJrZXIpO1xuICAgIG1hcmtlcnNbbWFya2VyXSA9IHBhcnQ7XG4gIH1cblxuICByZXR1cm4geyB0ZXh0OiByZXN1bHQuam9pbignJyksIG1hcmtlcnMgfTtcbn1cblxudHlwZSBGbkpvaW4gPSBbc3RyaW5nLCBGbkpvaW5QYXJ0W11dO1xudHlwZSBGbkpvaW5QYXJ0ID0gc3RyaW5nIHwgUmVmIHwgR2V0QXR0O1xudHlwZSBSZWYgPSB7IFJlZjogc3RyaW5nIH07XG50eXBlIEdldEF0dCA9IHsgJ0ZuOjpHZXRBdHQnOiBbc3RyaW5nLCBzdHJpbmddIH07Il19