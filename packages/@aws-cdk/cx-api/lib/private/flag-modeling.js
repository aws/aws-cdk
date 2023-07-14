"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersions = exports.MAGIC_V2NEXT = exports.FlagType = void 0;
var FlagType;
(function (FlagType) {
    /**
     * Change the default behavior of the API
     *
     * The old behavior is not disrecommended, and possible to achieve with source
     * code changes. Also valid for changes that don't affect CloudFormation, but
     * the CXAPI contract.
     */
    FlagType[FlagType["ApiDefault"] = 0] = "ApiDefault";
    /**
     * Address a bug/introduce a recommended change
     *
     * The old behavior is no longer recommended. The only way to achieve it is by
     * keeping the flag at the legacy value.
     */
    FlagType[FlagType["BugFix"] = 1] = "BugFix";
    /**
     * Advertise the presence of this context option in `cdk.json`
     */
    FlagType[FlagType["VisibleContext"] = 2] = "VisibleContext";
})(FlagType = exports.FlagType || (exports.FlagType = {}));
;
;
/**
 * The magic value that will be substituted at version bump time with the actual
 * new V2 version.
 *
 * Do not import this constant in the `features.ts` file, or the substitution
 * process won't work.
 */
exports.MAGIC_V2NEXT = 'V2NEXT';
/**
 * Compare two versions, returning -1, 0, or 1.
 */
function compareVersions(a, b) {
    if (a === b) {
        return 0;
    }
    if (a === undefined) {
        return -1;
    }
    if (b === undefined) {
        return 1;
    }
    const as = a.split('.').map(x => parseInt(x, 10));
    const bs = b.split('.').map(x => parseInt(x, 10));
    if (a === exports.MAGIC_V2NEXT) {
        return bs[0] <= 2 ? 1 : -1;
    }
    if (b === exports.MAGIC_V2NEXT) {
        return as[0] <= 2 ? -1 : 1;
    }
    for (let i = 0; i < Math.min(as.length, bs.length); i++) {
        if (as[i] < bs[i]) {
            return -1;
        }
        if (as[i] > bs[i]) {
            return 1;
        }
    }
    return as.length - bs.length;
}
exports.compareVersions = compareVersions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZy1tb2RlbGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZsYWctbW9kZWxpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBWSxRQXNCWDtBQXRCRCxXQUFZLFFBQVE7SUFDbEI7Ozs7OztPQU1HO0lBQ0gsbURBQVUsQ0FBQTtJQUVWOzs7OztPQUtHO0lBQ0gsMkNBQU0sQ0FBQTtJQUVOOztPQUVHO0lBQ0gsMkRBQWMsQ0FBQTtBQUNoQixDQUFDLEVBdEJXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBc0JuQjtBQUFBLENBQUM7QUFhRCxDQUFDO0FBY0Y7Ozs7OztHQU1HO0FBQ1UsUUFBQSxZQUFZLEdBQUcsUUFBUSxDQUFDO0FBRXJDOztHQUVHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLENBQXFCLEVBQUUsQ0FBcUI7SUFDMUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQUUsT0FBTyxDQUFDLENBQUM7S0FBRTtJQUMxQixJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQUU7SUFDbkMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQUUsT0FBTyxDQUFDLENBQUM7S0FBRTtJQUVsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRCxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsRCxJQUFJLENBQUMsS0FBSyxvQkFBWSxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQUU7SUFDdkQsSUFBSSxDQUFDLEtBQUssb0JBQVksRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUFFO0lBRXZELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZELElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FBRTtRQUNqQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsQ0FBQztTQUFFO0tBQ2pDO0lBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDL0IsQ0FBQztBQWhCRCwwQ0FnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBGbGFnVHlwZSB7XG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIEFQSVxuICAgKlxuICAgKiBUaGUgb2xkIGJlaGF2aW9yIGlzIG5vdCBkaXNyZWNvbW1lbmRlZCwgYW5kIHBvc3NpYmxlIHRvIGFjaGlldmUgd2l0aCBzb3VyY2VcbiAgICogY29kZSBjaGFuZ2VzLiBBbHNvIHZhbGlkIGZvciBjaGFuZ2VzIHRoYXQgZG9uJ3QgYWZmZWN0IENsb3VkRm9ybWF0aW9uLCBidXRcbiAgICogdGhlIENYQVBJIGNvbnRyYWN0LlxuICAgKi9cbiAgQXBpRGVmYXVsdCxcblxuICAvKipcbiAgICogQWRkcmVzcyBhIGJ1Zy9pbnRyb2R1Y2UgYSByZWNvbW1lbmRlZCBjaGFuZ2VcbiAgICpcbiAgICogVGhlIG9sZCBiZWhhdmlvciBpcyBubyBsb25nZXIgcmVjb21tZW5kZWQuIFRoZSBvbmx5IHdheSB0byBhY2hpZXZlIGl0IGlzIGJ5XG4gICAqIGtlZXBpbmcgdGhlIGZsYWcgYXQgdGhlIGxlZ2FjeSB2YWx1ZS5cbiAgICovXG4gIEJ1Z0ZpeCxcblxuICAvKipcbiAgICogQWR2ZXJ0aXNlIHRoZSBwcmVzZW5jZSBvZiB0aGlzIGNvbnRleHQgb3B0aW9uIGluIGBjZGsuanNvbmBcbiAgICovXG4gIFZpc2libGVDb250ZXh0LFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBGbGFnSW5mb0Jhc2Uge1xuICAvKiogU2luZ2xlLWxpbmUgZGVzY3JpcHRpb24gZm9yIHRoZSBmbGFnICovXG4gIHJlYWRvbmx5IHN1bW1hcnk6IHN0cmluZztcbiAgLyoqIERldGFpbGVkIGRlc2NyaXB0aW9uIGZvciB0aGUgZmxhZyAoTWFya2Rvd24pICovXG4gIHJlYWRvbmx5IGRldGFpbHNNZDogc3RyaW5nO1xuICAvKiogVmVyc2lvbiBudW1iZXIgdGhlIGZsYWcgd2FzIGludHJvZHVjZWQgaW4gZWFjaCB2ZXJzaW9uIGxpbmUuIGB1bmRlZmluZWRgIG1lYW5zIGZsYWcgZG9lcyBub3QgZXhpc3QgaW4gdGhhdCBsaW5lLiAqL1xuICByZWFkb25seSBpbnRyb2R1Y2VkSW46IHsgdjE/OiBzdHJpbmc7IHYyPzogc3RyaW5nIH07XG4gIC8qKiBEZWZhdWx0IHZhbHVlLCBpZiBmbGFnIGlzIHVuc2V0IGJ5IHVzZXIuIEFkZGluZyBhIGZsYWcgd2l0aCBhIGRlZmF1bHQgbWF5IG5vdCBjaGFuZ2UgYmVoYXZpb3IgYWZ0ZXIgR0EhICovXG4gIHJlYWRvbmx5IGRlZmF1bHRzPzogeyB2Mj86IGFueSB9O1xuICAvKiogRGVmYXVsdCBpbiBuZXcgcHJvamVjdHMgKi9cbiAgcmVhZG9ubHkgcmVjb21tZW5kZWRWYWx1ZTogYW55O1xufTtcblxuLyoqIEZsYWcgaW5mb3JtYXRpb24sIGFkZGluZyByZXF1aXJlZCBmaWVsZHMgaWYgcHJlc2VudCAqL1xuZXhwb3J0IHR5cGUgRmxhZ0luZm8gPSBGbGFnSW5mb0Jhc2UgJiAoXG4gIHwgeyByZWFkb25seSB0eXBlOiBGbGFnVHlwZS5BcGlEZWZhdWx0O1xuXG4gICAgLyoqIERlc2NyaWJlIHJlc3RvcmluZyBvbGQgYmVoYXZpb3Igb3IgZGVhbGluZyB3aXRoIHRoZSBjaGFuZ2UgKE1hcmtkb3duKSAqL1xuICAgIHJlYWRvbmx5IGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogc3RyaW5nIH1cbiAgfCB7IHJlYWRvbmx5IHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeDtcbiAgICAvKiogRGVzY3JpYmUgcmVzdG9yaW5nIG9sZCBiZWhhdmlvciBvciBkZWFsaW5nIHdpdGggdGhlIGNoYW5nZSAoTWFya2Rvd24pICovXG4gICAgcmVhZG9ubHkgY29tcGF0aWJpbGl0eVdpdGhPbGRCZWhhdmlvck1kPzogc3RyaW5nIH1cbiAgfCB7IHJlYWRvbmx5IHR5cGU6IEZsYWdUeXBlLlZpc2libGVDb250ZXh0IH1cbik7XG5cbi8qKlxuICogVGhlIG1hZ2ljIHZhbHVlIHRoYXQgd2lsbCBiZSBzdWJzdGl0dXRlZCBhdCB2ZXJzaW9uIGJ1bXAgdGltZSB3aXRoIHRoZSBhY3R1YWxcbiAqIG5ldyBWMiB2ZXJzaW9uLlxuICpcbiAqIERvIG5vdCBpbXBvcnQgdGhpcyBjb25zdGFudCBpbiB0aGUgYGZlYXR1cmVzLnRzYCBmaWxlLCBvciB0aGUgc3Vic3RpdHV0aW9uXG4gKiBwcm9jZXNzIHdvbid0IHdvcmsuXG4gKi9cbmV4cG9ydCBjb25zdCBNQUdJQ19WMk5FWFQgPSAnVjJORVhUJztcblxuLyoqXG4gKiBDb21wYXJlIHR3byB2ZXJzaW9ucywgcmV0dXJuaW5nIC0xLCAwLCBvciAxLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGFyZVZlcnNpb25zKGE6IHN0cmluZyB8IHVuZGVmaW5lZCwgYjogc3RyaW5nIHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgaWYgKGEgPT09IGIpIHsgcmV0dXJuIDA7IH1cbiAgaWYgKGEgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gLTE7IH1cbiAgaWYgKGIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gMTsgfVxuXG4gIGNvbnN0IGFzID0gYS5zcGxpdCgnLicpLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XG4gIGNvbnN0IGJzID0gYi5zcGxpdCgnLicpLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XG5cbiAgaWYgKGEgPT09IE1BR0lDX1YyTkVYVCkgeyByZXR1cm4gYnNbMF0gPD0gMiA/IDEgOiAtMTsgfVxuICBpZiAoYiA9PT0gTUFHSUNfVjJORVhUKSB7IHJldHVybiBhc1swXSA8PSAyID8gLTEgOiAxOyB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihhcy5sZW5ndGgsIGJzLmxlbmd0aCk7IGkrKykge1xuICAgIGlmIChhc1tpXSA8IGJzW2ldKSB7IHJldHVybiAtMTsgfVxuICAgIGlmIChhc1tpXSA+IGJzW2ldKSB7IHJldHVybiAxOyB9XG4gIH1cbiAgcmV0dXJuIGFzLmxlbmd0aCAtIGJzLmxlbmd0aDtcbn1cbiJdfQ==