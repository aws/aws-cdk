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
})(TableSortStyle = exports.TableSortStyle || (exports.TableSortStyle = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQTs7O0dBR0c7QUFDSCxJQUFZLGNBZ0JYO0FBaEJELFdBQVksY0FBYztJQUN4Qjs7T0FFRztJQUNILCtCQUFhLENBQUE7SUFFYjs7O09BR0c7SUFDSCx1Q0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILDZDQUEyQixDQUFBO0FBQzdCLENBQUMsRUFoQlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFnQnpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YWJhc2VRdWVyeUhhbmRsZXJQcm9wcywgVGFibGVIYW5kbGVyUHJvcHMgfSBmcm9tICcuLi9oYW5kbGVyLXByb3BzJztcblxuZXhwb3J0IHR5cGUgQ2x1c3RlclByb3BzID0gT21pdDxEYXRhYmFzZVF1ZXJ5SGFuZGxlclByb3BzLCAnaGFuZGxlcic+O1xuZXhwb3J0IHR5cGUgVGFibGVBbmRDbHVzdGVyUHJvcHMgPSBUYWJsZUhhbmRsZXJQcm9wcyAmIENsdXN0ZXJQcm9wcztcblxuLyoqXG4gKiBUaGUgc29ydCBzdHlsZSBvZiBhIHRhYmxlLlxuICogVGhpcyBoYXMgYmVlbiBkdXBsaWNhdGVkIGhlcmUgdG8gZXhwb3J0aW5nIHByaXZhdGUgdHlwZXMuXG4gKi9cbmV4cG9ydCBlbnVtIFRhYmxlU29ydFN0eWxlIHtcbiAgLyoqXG4gICAqIEFtYXpvbiBSZWRzaGlmdCBhc3NpZ25zIGFuIG9wdGltYWwgc29ydCBrZXkgYmFzZWQgb24gdGhlIHRhYmxlIGRhdGEuXG4gICAqL1xuICBBVVRPID0gJ0FVVE8nLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhhdCB0aGUgZGF0YSBpcyBzb3J0ZWQgdXNpbmcgYSBjb21wb3VuZCBrZXkgbWFkZSB1cCBvZiBhbGwgb2YgdGhlIGxpc3RlZCBjb2x1bW5zLFxuICAgKiBpbiB0aGUgb3JkZXIgdGhleSBhcmUgbGlzdGVkLlxuICAgKi9cbiAgQ09NUE9VTkQgPSAnQ09NUE9VTkQnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhhdCB0aGUgZGF0YSBpcyBzb3J0ZWQgdXNpbmcgYW4gaW50ZXJsZWF2ZWQgc29ydCBrZXkuXG4gICAqL1xuICBJTlRFUkxFQVZFRCA9ICdJTlRFUkxFQVZFRCcsXG59XG4iXX0=