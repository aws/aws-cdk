"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnEncoding = exports.TableSortStyle = void 0;
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
/**
 * The compression encoding of a column.
 *
 * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Compression_encodings.html
 */
var ColumnEncoding;
(function (ColumnEncoding) {
    /**
     * Amazon Redshift assigns an optimal encoding based on the column data.
     * This is the default.
     */
    ColumnEncoding["AUTO"] = "AUTO";
    /**
     * The column is not compressed.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Raw_encoding.html
     */
    ColumnEncoding["RAW"] = "RAW";
    /**
     * The column is compressed using the AZ64 algorithm.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/az64-encoding.html
     */
    ColumnEncoding["AZ64"] = "AZ64";
    /**
     * The column is compressed using a separate dictionary for each block column value on disk.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Byte_dictionary_encoding.html
     */
    ColumnEncoding["BYTEDICT"] = "BYTEDICT";
    /**
     * The column is compressed based on the difference between values in the column.
     * This records differences as 1-byte values.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
     */
    ColumnEncoding["DELTA"] = "DELTA";
    /**
     * The column is compressed based on the difference between values in the column.
     * This records differences as 2-byte values.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
     */
    ColumnEncoding["DELTA32K"] = "DELTA32K";
    /**
     * The column is compressed using the LZO algorithm.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/lzo-encoding.html
     */
    ColumnEncoding["LZO"] = "LZO";
    /**
     * The column is compressed to a smaller storage size than the original data type.
     * The compressed storage size is 1 byte.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
     */
    ColumnEncoding["MOSTLY8"] = "MOSTLY8";
    /**
     * The column is compressed to a smaller storage size than the original data type.
     * The compressed storage size is 2 bytes.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
     */
    ColumnEncoding["MOSTLY16"] = "MOSTLY16";
    /**
     * The column is compressed to a smaller storage size than the original data type.
     * The compressed storage size is 4 bytes.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
     */
    ColumnEncoding["MOSTLY32"] = "MOSTLY32";
    /**
     * The column is compressed by recording the number of occurrences of each value in the column.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Runlength_encoding.html
     */
    ColumnEncoding["RUNLENGTH"] = "RUNLENGTH";
    /**
     * The column is compressed by recording the first 245 unique words and then using a 1-byte index to represent each word.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
     */
    ColumnEncoding["TEXT255"] = "TEXT255";
    /**
     * The column is compressed by recording the first 32K unique words and then using a 2-byte index to represent each word.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
     */
    ColumnEncoding["TEXT32K"] = "TEXT32K";
    /**
     * The column is compressed using the ZSTD algorithm.
     *
     * @see https://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html
     */
    ColumnEncoding["ZSTD"] = "ZSTD";
})(ColumnEncoding = exports.ColumnEncoding || (exports.ColumnEncoding = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQTs7O0dBR0c7QUFDSCxJQUFZLGNBZ0JYO0FBaEJELFdBQVksY0FBYztJQUN4Qjs7T0FFRztJQUNILCtCQUFhLENBQUE7SUFFYjs7O09BR0c7SUFDSCx1Q0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILDZDQUEyQixDQUFBO0FBQzdCLENBQUMsRUFoQlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFnQnpCO0FBRUQ7Ozs7R0FJRztBQUNILElBQVksY0FzR1g7QUF0R0QsV0FBWSxjQUFjO0lBQ3hCOzs7T0FHRztJQUNILCtCQUFhLENBQUE7SUFFYjs7OztPQUlHO0lBQ0gsNkJBQVcsQ0FBQTtJQUVYOzs7O09BSUc7SUFDSCwrQkFBYSxDQUFBO0lBRWI7Ozs7T0FJRztJQUNILHVDQUFxQixDQUFBO0lBRXJCOzs7OztPQUtHO0lBQ0gsaUNBQWUsQ0FBQTtJQUVmOzs7OztPQUtHO0lBQ0gsdUNBQXFCLENBQUE7SUFFckI7Ozs7T0FJRztJQUNILDZCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILHFDQUFtQixDQUFBO0lBRW5COzs7OztPQUtHO0lBQ0gsdUNBQXFCLENBQUE7SUFFckI7Ozs7O09BS0c7SUFDSCx1Q0FBcUIsQ0FBQTtJQUVyQjs7OztPQUlHO0lBQ0gseUNBQXVCLENBQUE7SUFFdkI7Ozs7T0FJRztJQUNILHFDQUFtQixDQUFBO0lBRW5COzs7O09BSUc7SUFDSCxxQ0FBbUIsQ0FBQTtJQUVuQjs7OztPQUlHO0lBQ0gsK0JBQWEsQ0FBQTtBQUNmLENBQUMsRUF0R1csY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFzR3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YWJhc2VRdWVyeUhhbmRsZXJQcm9wcywgVGFibGVIYW5kbGVyUHJvcHMgfSBmcm9tICcuLi9oYW5kbGVyLXByb3BzJztcblxuZXhwb3J0IHR5cGUgQ2x1c3RlclByb3BzID0gT21pdDxEYXRhYmFzZVF1ZXJ5SGFuZGxlclByb3BzLCAnaGFuZGxlcic+O1xuZXhwb3J0IHR5cGUgVGFibGVBbmRDbHVzdGVyUHJvcHMgPSBUYWJsZUhhbmRsZXJQcm9wcyAmIENsdXN0ZXJQcm9wcztcblxuLyoqXG4gKiBUaGUgc29ydCBzdHlsZSBvZiBhIHRhYmxlLlxuICogVGhpcyBoYXMgYmVlbiBkdXBsaWNhdGVkIGhlcmUgdG8gZXhwb3J0aW5nIHByaXZhdGUgdHlwZXMuXG4gKi9cbmV4cG9ydCBlbnVtIFRhYmxlU29ydFN0eWxlIHtcbiAgLyoqXG4gICAqIEFtYXpvbiBSZWRzaGlmdCBhc3NpZ25zIGFuIG9wdGltYWwgc29ydCBrZXkgYmFzZWQgb24gdGhlIHRhYmxlIGRhdGEuXG4gICAqL1xuICBBVVRPID0gJ0FVVE8nLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhhdCB0aGUgZGF0YSBpcyBzb3J0ZWQgdXNpbmcgYSBjb21wb3VuZCBrZXkgbWFkZSB1cCBvZiBhbGwgb2YgdGhlIGxpc3RlZCBjb2x1bW5zLFxuICAgKiBpbiB0aGUgb3JkZXIgdGhleSBhcmUgbGlzdGVkLlxuICAgKi9cbiAgQ09NUE9VTkQgPSAnQ09NUE9VTkQnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhhdCB0aGUgZGF0YSBpcyBzb3J0ZWQgdXNpbmcgYW4gaW50ZXJsZWF2ZWQgc29ydCBrZXkuXG4gICAqL1xuICBJTlRFUkxFQVZFRCA9ICdJTlRFUkxFQVZFRCcsXG59XG5cbi8qKlxuICogVGhlIGNvbXByZXNzaW9uIGVuY29kaW5nIG9mIGEgY29sdW1uLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3JlZHNoaWZ0L2xhdGVzdC9kZy9jX0NvbXByZXNzaW9uX2VuY29kaW5ncy5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIENvbHVtbkVuY29kaW5nIHtcbiAgLyoqXG4gICAqIEFtYXpvbiBSZWRzaGlmdCBhc3NpZ25zIGFuIG9wdGltYWwgZW5jb2RpbmcgYmFzZWQgb24gdGhlIGNvbHVtbiBkYXRhLlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0LlxuICAgKi9cbiAgQVVUTyA9ICdBVVRPJyxcblxuICAvKipcbiAgICogVGhlIGNvbHVtbiBpcyBub3QgY29tcHJlc3NlZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVkc2hpZnQvbGF0ZXN0L2RnL2NfUmF3X2VuY29kaW5nLmh0bWxcbiAgICovXG4gIFJBVyA9ICdSQVcnLFxuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1uIGlzIGNvbXByZXNzZWQgdXNpbmcgdGhlIEFaNjQgYWxnb3JpdGhtLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvYXo2NC1lbmNvZGluZy5odG1sXG4gICAqL1xuICBBWjY0ID0gJ0FaNjQnLFxuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1uIGlzIGNvbXByZXNzZWQgdXNpbmcgYSBzZXBhcmF0ZSBkaWN0aW9uYXJ5IGZvciBlYWNoIGJsb2NrIGNvbHVtbiB2YWx1ZSBvbiBkaXNrLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvY19CeXRlX2RpY3Rpb25hcnlfZW5jb2RpbmcuaHRtbFxuICAgKi9cbiAgQllURURJQ1QgPSAnQllURURJQ1QnLFxuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1uIGlzIGNvbXByZXNzZWQgYmFzZWQgb24gdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB2YWx1ZXMgaW4gdGhlIGNvbHVtbi5cbiAgICogVGhpcyByZWNvcmRzIGRpZmZlcmVuY2VzIGFzIDEtYnl0ZSB2YWx1ZXMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3JlZHNoaWZ0L2xhdGVzdC9kZy9jX0RlbHRhX2VuY29kaW5nLmh0bWxcbiAgICovXG4gIERFTFRBID0gJ0RFTFRBJyxcblxuICAvKipcbiAgICogVGhlIGNvbHVtbiBpcyBjb21wcmVzc2VkIGJhc2VkIG9uIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdmFsdWVzIGluIHRoZSBjb2x1bW4uXG4gICAqIFRoaXMgcmVjb3JkcyBkaWZmZXJlbmNlcyBhcyAyLWJ5dGUgdmFsdWVzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvY19EZWx0YV9lbmNvZGluZy5odG1sXG4gICAqL1xuICBERUxUQTMySyA9ICdERUxUQTMySycsXG5cbiAgLyoqXG4gICAqIFRoZSBjb2x1bW4gaXMgY29tcHJlc3NlZCB1c2luZyB0aGUgTFpPIGFsZ29yaXRobS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVkc2hpZnQvbGF0ZXN0L2RnL2x6by1lbmNvZGluZy5odG1sXG4gICAqL1xuICBMWk8gPSAnTFpPJyxcblxuICAvKipcbiAgICogVGhlIGNvbHVtbiBpcyBjb21wcmVzc2VkIHRvIGEgc21hbGxlciBzdG9yYWdlIHNpemUgdGhhbiB0aGUgb3JpZ2luYWwgZGF0YSB0eXBlLlxuICAgKiBUaGUgY29tcHJlc3NlZCBzdG9yYWdlIHNpemUgaXMgMSBieXRlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvY19Nb3N0bHlOX2VuY29kaW5nLmh0bWxcbiAgICovXG4gIE1PU1RMWTggPSAnTU9TVExZOCcsXG5cbiAgLyoqXG4gICAqIFRoZSBjb2x1bW4gaXMgY29tcHJlc3NlZCB0byBhIHNtYWxsZXIgc3RvcmFnZSBzaXplIHRoYW4gdGhlIG9yaWdpbmFsIGRhdGEgdHlwZS5cbiAgICogVGhlIGNvbXByZXNzZWQgc3RvcmFnZSBzaXplIGlzIDIgYnl0ZXMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3JlZHNoaWZ0L2xhdGVzdC9kZy9jX01vc3RseU5fZW5jb2RpbmcuaHRtbFxuICAgKi9cbiAgTU9TVExZMTYgPSAnTU9TVExZMTYnLFxuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1uIGlzIGNvbXByZXNzZWQgdG8gYSBzbWFsbGVyIHN0b3JhZ2Ugc2l6ZSB0aGFuIHRoZSBvcmlnaW5hbCBkYXRhIHR5cGUuXG4gICAqIFRoZSBjb21wcmVzc2VkIHN0b3JhZ2Ugc2l6ZSBpcyA0IGJ5dGVzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvY19Nb3N0bHlOX2VuY29kaW5nLmh0bWxcbiAgICovXG4gIE1PU1RMWTMyID0gJ01PU1RMWTMyJyxcblxuICAvKipcbiAgICogVGhlIGNvbHVtbiBpcyBjb21wcmVzc2VkIGJ5IHJlY29yZGluZyB0aGUgbnVtYmVyIG9mIG9jY3VycmVuY2VzIG9mIGVhY2ggdmFsdWUgaW4gdGhlIGNvbHVtbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVkc2hpZnQvbGF0ZXN0L2RnL2NfUnVubGVuZ3RoX2VuY29kaW5nLmh0bWxcbiAgICovXG4gIFJVTkxFTkdUSCA9ICdSVU5MRU5HVEgnLFxuXG4gIC8qKlxuICAgKiBUaGUgY29sdW1uIGlzIGNvbXByZXNzZWQgYnkgcmVjb3JkaW5nIHRoZSBmaXJzdCAyNDUgdW5pcXVlIHdvcmRzIGFuZCB0aGVuIHVzaW5nIGEgMS1ieXRlIGluZGV4IHRvIHJlcHJlc2VudCBlYWNoIHdvcmQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3JlZHNoaWZ0L2xhdGVzdC9kZy9jX1RleHQyNTVfZW5jb2RpbmcuaHRtbFxuICAgKi9cbiAgVEVYVDI1NSA9ICdURVhUMjU1JyxcblxuICAvKipcbiAgICogVGhlIGNvbHVtbiBpcyBjb21wcmVzc2VkIGJ5IHJlY29yZGluZyB0aGUgZmlyc3QgMzJLIHVuaXF1ZSB3b3JkcyBhbmQgdGhlbiB1c2luZyBhIDItYnl0ZSBpbmRleCB0byByZXByZXNlbnQgZWFjaCB3b3JkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvZGcvY19UZXh0MjU1X2VuY29kaW5nLmh0bWxcbiAgICovXG4gIFRFWFQzMksgPSAnVEVYVDMySycsXG5cbiAgLyoqXG4gICAqIFRoZSBjb2x1bW4gaXMgY29tcHJlc3NlZCB1c2luZyB0aGUgWlNURCBhbGdvcml0aG0uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3JlZHNoaWZ0L2xhdGVzdC9kZy96c3RkLWVuY29kaW5nLmh0bWxcbiAgICovXG4gIFpTVEQgPSAnWlNURCcsXG59XG4iXX0=