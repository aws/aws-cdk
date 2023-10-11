"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableSortStyle = void 0;
/**
 * The sort style of a table.
 * This has been duplicated here to exporting private types.
 */
var TableSortStyle;
(function (TableSortStyle) {
    /**
     * Amazon Redshift assigns an optimal sort key based on the table data.
     */
    TableSortStyle["AUTO"] = "AUTO";
    /**
     * Specifies that the data is sorted using a compound key made up of all of the listed columns,
     * in the order they are listed.
     */
    TableSortStyle["COMPOUND"] = "COMPOUND";
    /**
     * Specifies that the data is sorted using an interleaved sort key.
     */
    TableSortStyle["INTERLEAVED"] = "INTERLEAVED";
})(TableSortStyle || (exports.TableSortStyle = TableSortStyle = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQTs7O0dBR0c7QUFDSCxJQUFZLGNBZ0JYO0FBaEJELFdBQVksY0FBYztJQUN4Qjs7T0FFRztJQUNILCtCQUFhLENBQUE7SUFFYjs7O09BR0c7SUFDSCx1Q0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILDZDQUEyQixDQUFBO0FBQzdCLENBQUMsRUFoQlcsY0FBYyw4QkFBZCxjQUFjLFFBZ0J6QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGFiYXNlUXVlcnlIYW5kbGVyUHJvcHMsIFRhYmxlSGFuZGxlclByb3BzIH0gZnJvbSAnLi4vaGFuZGxlci1wcm9wcyc7XG5cbmV4cG9ydCB0eXBlIENsdXN0ZXJQcm9wcyA9IE9taXQ8RGF0YWJhc2VRdWVyeUhhbmRsZXJQcm9wcywgJ2hhbmRsZXInPjtcbmV4cG9ydCB0eXBlIFRhYmxlQW5kQ2x1c3RlclByb3BzID0gVGFibGVIYW5kbGVyUHJvcHMgJiBDbHVzdGVyUHJvcHM7XG5cbi8qKlxuICogVGhlIHNvcnQgc3R5bGUgb2YgYSB0YWJsZS5cbiAqIFRoaXMgaGFzIGJlZW4gZHVwbGljYXRlZCBoZXJlIHRvIGV4cG9ydGluZyBwcml2YXRlIHR5cGVzLlxuICovXG5leHBvcnQgZW51bSBUYWJsZVNvcnRTdHlsZSB7XG4gIC8qKlxuICAgKiBBbWF6b24gUmVkc2hpZnQgYXNzaWducyBhbiBvcHRpbWFsIHNvcnQga2V5IGJhc2VkIG9uIHRoZSB0YWJsZSBkYXRhLlxuICAgKi9cbiAgQVVUTyA9ICdBVVRPJyxcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoYXQgdGhlIGRhdGEgaXMgc29ydGVkIHVzaW5nIGEgY29tcG91bmQga2V5IG1hZGUgdXAgb2YgYWxsIG9mIHRoZSBsaXN0ZWQgY29sdW1ucyxcbiAgICogaW4gdGhlIG9yZGVyIHRoZXkgYXJlIGxpc3RlZC5cbiAgICovXG4gIENPTVBPVU5EID0gJ0NPTVBPVU5EJyxcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoYXQgdGhlIGRhdGEgaXMgc29ydGVkIHVzaW5nIGFuIGludGVybGVhdmVkIHNvcnQga2V5LlxuICAgKi9cbiAgSU5URVJMRUFWRUQgPSAnSU5URVJMRUFWRUQnLFxufVxuIl19