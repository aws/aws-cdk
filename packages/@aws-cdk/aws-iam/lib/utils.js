"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.principalIsOwnedResource = void 0;
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * Determines whether the given Principal is a newly created resource managed by the CDK,
 * or if it's a referenced existing resource.
 *
 * @param principal the Principal to check
 * @returns true if the Principal is a newly created resource, false otherwise.
 *   Additionally, the type of the principal will now also be IConstruct
 *   (because a newly created resource must be a construct)
 */
function principalIsOwnedResource(principal) {
    // a newly created resource will for sure be a construct
    if (!isConstruct(principal)) {
        return false;
    }
    return core_1.Resource.isOwnedResource(principal);
}
exports.principalIsOwnedResource = principalIsOwnedResource;
/**
 * Whether the given object is a Construct
 *
 * Normally we'd do `x instanceof Construct`, but that is not robust against
 * multiple copies of the `constructs` library on disk. This can happen
 * when upgrading and downgrading between v2 and v1, and in the use of CDK
 * Pipelines is going to an error that says "Can't use Pipeline/Pipeline/Role in
 * a cross-environment fashion", which is very confusing.
 */
function isConstruct(x) {
    const sym = Symbol.for('constructs.Construct.node');
    return (typeof x === 'object' && x &&
        (x instanceof constructs_1.Construct // happy fast case
            || !!x.node // constructs v10
            || !!x[sym])); // constructs v3
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBeUM7QUFDekMsMkNBQW1EO0FBR25EOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0Isd0JBQXdCLENBQUMsU0FBcUI7SUFDNUQsd0RBQXdEO0lBQ3hELElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELE9BQU8sZUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBUEQsNERBT0M7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILFNBQVMsV0FBVyxDQUFDLENBQU07SUFDekIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBQ3BELE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQztRQUNoQyxDQUFDLENBQUMsWUFBWSxzQkFBUyxDQUFDLGtCQUFrQjtlQUNyQyxDQUFDLENBQUUsQ0FBUyxDQUFDLElBQUksQ0FBQyxpQkFBaUI7ZUFDbkMsQ0FBQyxDQUFFLENBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElQcmluY2lwYWwgfSBmcm9tICcuL3ByaW5jaXBhbHMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgZ2l2ZW4gUHJpbmNpcGFsIGlzIGEgbmV3bHkgY3JlYXRlZCByZXNvdXJjZSBtYW5hZ2VkIGJ5IHRoZSBDREssXG4gKiBvciBpZiBpdCdzIGEgcmVmZXJlbmNlZCBleGlzdGluZyByZXNvdXJjZS5cbiAqXG4gKiBAcGFyYW0gcHJpbmNpcGFsIHRoZSBQcmluY2lwYWwgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIFByaW5jaXBhbCBpcyBhIG5ld2x5IGNyZWF0ZWQgcmVzb3VyY2UsIGZhbHNlIG90aGVyd2lzZS5cbiAqICAgQWRkaXRpb25hbGx5LCB0aGUgdHlwZSBvZiB0aGUgcHJpbmNpcGFsIHdpbGwgbm93IGFsc28gYmUgSUNvbnN0cnVjdFxuICogICAoYmVjYXVzZSBhIG5ld2x5IGNyZWF0ZWQgcmVzb3VyY2UgbXVzdCBiZSBhIGNvbnN0cnVjdClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByaW5jaXBhbElzT3duZWRSZXNvdXJjZShwcmluY2lwYWw6IElQcmluY2lwYWwpOiBwcmluY2lwYWwgaXMgSVByaW5jaXBhbCAmIElDb25zdHJ1Y3Qge1xuICAvLyBhIG5ld2x5IGNyZWF0ZWQgcmVzb3VyY2Ugd2lsbCBmb3Igc3VyZSBiZSBhIGNvbnN0cnVjdFxuICBpZiAoIWlzQ29uc3RydWN0KHByaW5jaXBhbCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gUmVzb3VyY2UuaXNPd25lZFJlc291cmNlKHByaW5jaXBhbCk7XG59XG5cbi8qKlxuICogV2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgQ29uc3RydWN0XG4gKlxuICogTm9ybWFsbHkgd2UnZCBkbyBgeCBpbnN0YW5jZW9mIENvbnN0cnVjdGAsIGJ1dCB0aGF0IGlzIG5vdCByb2J1c3QgYWdhaW5zdFxuICogbXVsdGlwbGUgY29waWVzIG9mIHRoZSBgY29uc3RydWN0c2AgbGlicmFyeSBvbiBkaXNrLiBUaGlzIGNhbiBoYXBwZW5cbiAqIHdoZW4gdXBncmFkaW5nIGFuZCBkb3duZ3JhZGluZyBiZXR3ZWVuIHYyIGFuZCB2MSwgYW5kIGluIHRoZSB1c2Ugb2YgQ0RLXG4gKiBQaXBlbGluZXMgaXMgZ29pbmcgdG8gYW4gZXJyb3IgdGhhdCBzYXlzIFwiQ2FuJ3QgdXNlIFBpcGVsaW5lL1BpcGVsaW5lL1JvbGUgaW5cbiAqIGEgY3Jvc3MtZW52aXJvbm1lbnQgZmFzaGlvblwiLCB3aGljaCBpcyB2ZXJ5IGNvbmZ1c2luZy5cbiAqL1xuZnVuY3Rpb24gaXNDb25zdHJ1Y3QoeDogYW55KTogeCBpcyBJQ29uc3RydWN0IHtcbiAgY29uc3Qgc3ltID0gU3ltYm9sLmZvcignY29uc3RydWN0cy5Db25zdHJ1Y3Qubm9kZScpO1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICYmXG4gICAgKHggaW5zdGFuY2VvZiBDb25zdHJ1Y3QgLy8gaGFwcHkgZmFzdCBjYXNlXG4gICAgICB8fCAhISh4IGFzIGFueSkubm9kZSAvLyBjb25zdHJ1Y3RzIHYxMFxuICAgICAgfHwgISEoeCBhcyBhbnkpW3N5bV0pKTsgLy8gY29uc3RydWN0cyB2M1xufVxuIl19