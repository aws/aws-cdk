"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbC1jZm4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ5YW1sLWNmbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0IseUNBQXlDO0FBRXpDOzs7OztHQUtHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLEdBQVE7SUFDaEMsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3JELElBQUk7UUFDRixVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNwRDtZQUFTO1FBQ1IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztLQUNoRDtBQUNILENBQUM7QUFSRCw4QkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHlhbWwgZnJvbSAneWFtbCc7XG5pbXBvcnQgKiBhcyB5YW1sX3R5cGVzIGZyb20gJ3lhbWwvdHlwZXMnO1xuXG4vKipcbiAqIFNlcmlhbGl6ZXMgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlIGludG8gdmFsaWQgWUFNTC5cbiAqXG4gKiBAcGFyYW0gb2JqIHRoZSBkYXRhIHN0cnVjdHVyZSB0byBzZXJpYWxpemVcbiAqIEByZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIFlBTUwgcmVwcmVzZW50YXRpb24gb2Yge0BwYXJhbSBvYmp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUob2JqOiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBvbGRGb2xkID0geWFtbF90eXBlcy5zdHJPcHRpb25zLmZvbGQubGluZVdpZHRoO1xuICB0cnkge1xuICAgIHlhbWxfdHlwZXMuc3RyT3B0aW9ucy5mb2xkLmxpbmVXaWR0aCA9IDA7XG4gICAgcmV0dXJuIHlhbWwuc3RyaW5naWZ5KG9iaiwgeyBzY2hlbWE6ICd5YW1sLTEuMScgfSk7XG4gIH0gZmluYWxseSB7XG4gICAgeWFtbF90eXBlcy5zdHJPcHRpb25zLmZvbGQubGluZVdpZHRoID0gb2xkRm9sZDtcbiAgfVxufVxuIl19