"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
const yaml = require("yaml");
const yaml_types = require("yaml/types");
/**
 * Serializes the given data structure into valid YAML.
 *
 * @param obj the data structure to serialize
 * @returns a string containing the YAML representation of {@param obj}
 */
function serialize(obj) {
    const oldFold = yaml_types.strOptions.fold.lineWidth;
    try {
        yaml_types.strOptions.fold.lineWidth = 0;
        return yaml.stringify(obj, { schema: 'yaml-1.1' });
    }
    finally {
        yaml_types.strOptions.fold.lineWidth = oldFold;
    }
}
exports.serialize = serialize;
/**
 * Deserialize the YAML into the appropriate data structure.
 *
 * @param str the string containing YAML
 * @returns the data structure the YAML represents
 *   (most often in case of CloudFormation, an object)
 */
function deserialize(str) {
    return parseYamlStrWithCfnTags(str);
}
exports.deserialize = deserialize;
function makeTagForCfnIntrinsic(intrinsicName, addFnPrefix) {
    return {
        identify(value) { return typeof value === 'string'; },
        tag: `!${intrinsicName}`,
        resolve: (_doc, cstNode) => {
            const ret = {};
            ret[addFnPrefix ? `Fn::${intrinsicName}` : intrinsicName] =
                // the +1 is to account for the ! the short form begins with
                parseYamlStrWithCfnTags(cstNode.toString().substring(intrinsicName.length + 1));
            return ret;
        },
    };
}
const shortForms = [
    'Base64', 'Cidr', 'FindInMap', 'GetAZs', 'ImportValue', 'Join', 'Sub',
    'Select', 'Split', 'Transform', 'And', 'Equals', 'If', 'Not', 'Or', 'GetAtt',
].map(name => makeTagForCfnIntrinsic(name, true)).concat(makeTagForCfnIntrinsic('Ref', false), makeTagForCfnIntrinsic('Condition', false));
function parseYamlStrWithCfnTags(text) {
    return yaml.parse(text, {
        customTags: shortForms,
        schema: 'core',
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInlhbWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBRTdCLHlDQUF5QztBQUV6Qzs7Ozs7R0FLRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxHQUFRO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUNyRCxJQUFJO1FBQ0YsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDcEQ7WUFBUztRQUNSLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7S0FDaEQ7QUFDSCxDQUFDO0FBUkQsOEJBUUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixXQUFXLENBQUMsR0FBVztJQUNyQyxPQUFPLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQVMsc0JBQXNCLENBQUMsYUFBcUIsRUFBRSxXQUFvQjtJQUN6RSxPQUFPO1FBQ0wsUUFBUSxDQUFDLEtBQVUsSUFBSSxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1FBQzFELEdBQUcsRUFBRSxJQUFJLGFBQWEsRUFBRTtRQUN4QixPQUFPLEVBQUUsQ0FBQyxJQUFtQixFQUFFLE9BQTBCLEVBQUUsRUFBRTtZQUMzRCxNQUFNLEdBQUcsR0FBUSxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUN2RCw0REFBNEQ7Z0JBQzVELHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQWtDO0lBQ2hELFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEtBQUs7SUFDckUsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRO0NBQzdFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUN0RCxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQ3BDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FDM0MsQ0FBQztBQUVGLFNBQVMsdUJBQXVCLENBQUMsSUFBWTtJQUMzQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ3RCLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhbWwgZnJvbSAneWFtbCc7XG5pbXBvcnQgKiBhcyB5YW1sX2NzdCBmcm9tICd5YW1sL3BhcnNlLWNzdCc7XG5pbXBvcnQgKiBhcyB5YW1sX3R5cGVzIGZyb20gJ3lhbWwvdHlwZXMnO1xuXG4vKipcbiAqIFNlcmlhbGl6ZXMgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlIGludG8gdmFsaWQgWUFNTC5cbiAqXG4gKiBAcGFyYW0gb2JqIHRoZSBkYXRhIHN0cnVjdHVyZSB0byBzZXJpYWxpemVcbiAqIEByZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIFlBTUwgcmVwcmVzZW50YXRpb24gb2Yge0BwYXJhbSBvYmp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUob2JqOiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBvbGRGb2xkID0geWFtbF90eXBlcy5zdHJPcHRpb25zLmZvbGQubGluZVdpZHRoO1xuICB0cnkge1xuICAgIHlhbWxfdHlwZXMuc3RyT3B0aW9ucy5mb2xkLmxpbmVXaWR0aCA9IDA7XG4gICAgcmV0dXJuIHlhbWwuc3RyaW5naWZ5KG9iaiwgeyBzY2hlbWE6ICd5YW1sLTEuMScgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgeWFtbF90eXBlcy5zdHJPcHRpb25zLmZvbGQubGluZVdpZHRoID0gb2xkRm9sZDtcbiAgfVxufVxuXG4vKipcbiAqIERlc2VyaWFsaXplIHRoZSBZQU1MIGludG8gdGhlIGFwcHJvcHJpYXRlIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqIEBwYXJhbSBzdHIgdGhlIHN0cmluZyBjb250YWluaW5nIFlBTUxcbiAqIEByZXR1cm5zIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgWUFNTCByZXByZXNlbnRzXG4gKiAgIChtb3N0IG9mdGVuIGluIGNhc2Ugb2YgQ2xvdWRGb3JtYXRpb24sIGFuIG9iamVjdClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplKHN0cjogc3RyaW5nKTogYW55IHtcbiAgcmV0dXJuIHBhcnNlWWFtbFN0cldpdGhDZm5UYWdzKHN0cik7XG59XG5cbmZ1bmN0aW9uIG1ha2VUYWdGb3JDZm5JbnRyaW5zaWMoaW50cmluc2ljTmFtZTogc3RyaW5nLCBhZGRGblByZWZpeDogYm9vbGVhbik6IHlhbWxfdHlwZXMuU2NoZW1hLkN1c3RvbVRhZyB7XG4gIHJldHVybiB7XG4gICAgaWRlbnRpZnkodmFsdWU6IGFueSkgeyByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJzsgfSxcbiAgICB0YWc6IGAhJHtpbnRyaW5zaWNOYW1lfWAsXG4gICAgcmVzb2x2ZTogKF9kb2M6IHlhbWwuRG9jdW1lbnQsIGNzdE5vZGU6IHlhbWxfY3N0LkNTVC5Ob2RlKSA9PiB7XG4gICAgICBjb25zdCByZXQ6IGFueSA9IHt9O1xuICAgICAgcmV0W2FkZEZuUHJlZml4ID8gYEZuOjoke2ludHJpbnNpY05hbWV9YCA6IGludHJpbnNpY05hbWVdID1cbiAgICAgICAgLy8gdGhlICsxIGlzIHRvIGFjY291bnQgZm9yIHRoZSAhIHRoZSBzaG9ydCBmb3JtIGJlZ2lucyB3aXRoXG4gICAgICAgIHBhcnNlWWFtbFN0cldpdGhDZm5UYWdzKGNzdE5vZGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoaW50cmluc2ljTmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gIH07XG59XG5cbmNvbnN0IHNob3J0Rm9ybXM6IHlhbWxfdHlwZXMuU2NoZW1hLkN1c3RvbVRhZ1tdID0gW1xuICAnQmFzZTY0JywgJ0NpZHInLCAnRmluZEluTWFwJywgJ0dldEFacycsICdJbXBvcnRWYWx1ZScsICdKb2luJywgJ1N1YicsXG4gICdTZWxlY3QnLCAnU3BsaXQnLCAnVHJhbnNmb3JtJywgJ0FuZCcsICdFcXVhbHMnLCAnSWYnLCAnTm90JywgJ09yJywgJ0dldEF0dCcsXG5dLm1hcChuYW1lID0+IG1ha2VUYWdGb3JDZm5JbnRyaW5zaWMobmFtZSwgdHJ1ZSkpLmNvbmNhdChcbiAgbWFrZVRhZ0ZvckNmbkludHJpbnNpYygnUmVmJywgZmFsc2UpLFxuICBtYWtlVGFnRm9yQ2ZuSW50cmluc2ljKCdDb25kaXRpb24nLCBmYWxzZSksXG4pO1xuXG5mdW5jdGlvbiBwYXJzZVlhbWxTdHJXaXRoQ2ZuVGFncyh0ZXh0OiBzdHJpbmcpOiBhbnkge1xuICByZXR1cm4geWFtbC5wYXJzZSh0ZXh0LCB7XG4gICAgY3VzdG9tVGFnczogc2hvcnRGb3JtcyxcbiAgICBzY2hlbWE6ICdjb3JlJyxcbiAgfSk7XG59XG4iXX0=