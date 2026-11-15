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
