"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeRoundingBehavior = exports.Size = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const token_1 = require("./token");
/**
 * Represents the amount of digital storage.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
class Size {
    /**
     * Create a Storage representing an amount bytes.
     *
     * @param amount the amount of bytes to be represented
     *
     * @returns a new `Size` instance
     */
    static bytes(amount) {
        return new Size(amount, StorageUnit.Bytes);
    }
    /**
     * Create a Storage representing an amount kibibytes.
     * 1 KiB = 1024 bytes
     *
     * @param amount the amount of kibibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static kibibytes(amount) {
        return new Size(amount, StorageUnit.Kibibytes);
    }
    /**
     * Create a Storage representing an amount mebibytes.
     * 1 MiB = 1024 KiB
     *
     * @param amount the amount of mebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static mebibytes(amount) {
        return new Size(amount, StorageUnit.Mebibytes);
    }
    /**
     * Create a Storage representing an amount gibibytes.
     * 1 GiB = 1024 MiB
     *
     * @param amount the amount of gibibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static gibibytes(amount) {
        return new Size(amount, StorageUnit.Gibibytes);
    }
    /**
     * Create a Storage representing an amount tebibytes.
     * 1 TiB = 1024 GiB
     *
     * @param amount the amount of tebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static tebibytes(amount) {
        return new Size(amount, StorageUnit.Tebibytes);
    }
    /**
     * Create a Storage representing an amount pebibytes.
     * 1 PiB = 1024 TiB
     *
     * @deprecated use `pebibytes` instead
     */
    static pebibyte(amount) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.Size#pebibyte", "use `pebibytes` instead");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.pebibyte);
            }
            throw error;
        }
        return Size.pebibytes(amount);
    }
    /**
     * Create a Storage representing an amount pebibytes.
     * 1 PiB = 1024 TiB
     *
     * @param amount the amount of pebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static pebibytes(amount) {
        return new Size(amount, StorageUnit.Pebibytes);
    }
    constructor(amount, unit) {
        if (!token_1.Token.isUnresolved(amount) && amount < 0) {
            throw new Error(`Storage amounts cannot be negative. Received: ${amount}`);
        }
        this.amount = amount;
        this.unit = unit;
    }
    /**
     * Return this storage as a total number of bytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity expressed in bytes
     */
    toBytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toBytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Bytes, opts);
    }
    /**
     * Return this storage as a total number of kibibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in kibibytes
     */
    toKibibytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toKibibytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Kibibytes, opts);
    }
    /**
     * Return this storage as a total number of mebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in mebibytes
     */
    toMebibytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toMebibytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Mebibytes, opts);
    }
    /**
     * Return this storage as a total number of gibibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in gibibytes
     */
    toGibibytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toGibibytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Gibibytes, opts);
    }
    /**
     * Return this storage as a total number of tebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in tebibytes
     */
    toTebibytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toTebibytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Tebibytes, opts);
    }
    /**
     * Return this storage as a total number of pebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in pebibytes
     */
    toPebibytes(opts = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_SizeConversionOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toPebibytes);
            }
            throw error;
        }
        return convert(this.amount, this.unit, StorageUnit.Pebibytes, opts);
    }
    /**
     * Checks if size is a token or a resolvable object
     */
    isUnresolved() {
        return token_1.Token.isUnresolved(this.amount);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Size[_a] = { fqn: "@aws-cdk/core.Size", version: "0.0.0" };
exports.Size = Size;
/**
 * Rounding behaviour when converting between units of `Size`.
 */
var SizeRoundingBehavior;
(function (SizeRoundingBehavior) {
    /** Fail the conversion if the result is not an integer. */
    SizeRoundingBehavior[SizeRoundingBehavior["FAIL"] = 0] = "FAIL";
    /** If the result is not an integer, round it to the closest integer less than the result */
    SizeRoundingBehavior[SizeRoundingBehavior["FLOOR"] = 1] = "FLOOR";
    /** Don't round. Return even if the result is a fraction. */
    SizeRoundingBehavior[SizeRoundingBehavior["NONE"] = 2] = "NONE";
})(SizeRoundingBehavior = exports.SizeRoundingBehavior || (exports.SizeRoundingBehavior = {}));
class StorageUnit {
    constructor(label, inBytes) {
        this.label = label;
        this.inBytes = inBytes;
    }
    toString() {
        return this.label;
    }
}
StorageUnit.Bytes = new StorageUnit('bytes', 1);
StorageUnit.Kibibytes = new StorageUnit('kibibytes', 1024);
StorageUnit.Mebibytes = new StorageUnit('mebibytes', 1024 * 1024);
StorageUnit.Gibibytes = new StorageUnit('gibibytes', 1024 * 1024 * 1024);
StorageUnit.Tebibytes = new StorageUnit('tebibytes', 1024 * 1024 * 1024 * 1024);
StorageUnit.Pebibytes = new StorageUnit('pebibytes', 1024 * 1024 * 1024 * 1024 * 1024);
function convert(amount, fromUnit, toUnit, options = {}) {
    const rounding = options.rounding ?? SizeRoundingBehavior.FAIL;
    if (fromUnit.inBytes === toUnit.inBytes) {
        return amount;
    }
    if (token_1.Token.isUnresolved(amount)) {
        throw new Error(`Size must be specified as 'Size.${toUnit}()' here since its value comes from a token and cannot be converted (got Size.${fromUnit})`);
    }
    const multiplier = fromUnit.inBytes / toUnit.inBytes;
    const value = amount * multiplier;
    switch (rounding) {
        case SizeRoundingBehavior.NONE:
            return value;
        case SizeRoundingBehavior.FLOOR:
            return Math.floor(value);
        default:
        case SizeRoundingBehavior.FAIL:
            if (!Number.isInteger(value)) {
                throw new Error(`'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`);
            }
            return value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUNBQWdDO0FBRWhDOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLElBQUk7SUFDZjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDaEMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzVDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztRQUNwQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNoRDtJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7UUFDcEMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztRQUNwQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYzs7Ozs7Ozs7OztRQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0I7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNoRDtJQUtELFlBQW9CLE1BQWMsRUFBRSxJQUFpQjtRQUNuRCxJQUFJLENBQUMsYUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDNUU7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjtJQUVEOzs7Ozs7T0FNRztJQUNJLE9BQU8sQ0FBQyxPQUE4QixFQUFFOzs7Ozs7Ozs7O1FBQzdDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksV0FBVyxDQUFDLE9BQThCLEVBQUU7Ozs7Ozs7Ozs7UUFDakQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDckU7SUFFRDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsT0FBOEIsRUFBRTs7Ozs7Ozs7OztRQUNqRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNyRTtJQUVEOzs7Ozs7T0FNRztJQUNJLFdBQVcsQ0FBQyxPQUE4QixFQUFFOzs7Ozs7Ozs7O1FBQ2pELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3JFO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksV0FBVyxDQUFDLE9BQThCLEVBQUU7Ozs7Ozs7Ozs7UUFDakQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDckU7SUFFRDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsT0FBOEIsRUFBRTs7Ozs7Ozs7OztRQUNqRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNyRTtJQUVEOztPQUVHO0lBQ0ksWUFBWTtRQUNqQixPQUFPLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hDOzs7O0FBcEtVLG9CQUFJO0FBdUtqQjs7R0FFRztBQUNILElBQVksb0JBT1g7QUFQRCxXQUFZLG9CQUFvQjtJQUM5QiwyREFBMkQ7SUFDM0QsK0RBQUksQ0FBQTtJQUNKLDRGQUE0RjtJQUM1RixpRUFBSyxDQUFBO0lBQ0wsNERBQTREO0lBQzVELCtEQUFJLENBQUE7QUFDTixDQUFDLEVBUFcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFPL0I7QUFhRCxNQUFNLFdBQVc7SUFRZixZQUFvQyxLQUFhLEVBQWtCLE9BQWU7UUFBOUMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFrQixZQUFPLEdBQVAsT0FBTyxDQUFRO0tBR2pGO0lBRU0sUUFBUTtRQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7QUFkc0IsaUJBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEMscUJBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0MscUJBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3RELHFCQUFTLEdBQUcsSUFBSSxXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDN0QscUJBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDcEUscUJBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBWXBHLFNBQVMsT0FBTyxDQUFDLE1BQWMsRUFBRSxRQUFxQixFQUFFLE1BQW1CLEVBQUUsVUFBaUMsRUFBRTtJQUM5RyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQztJQUMvRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLE9BQU8sRUFBRTtRQUFFLE9BQU8sTUFBTSxDQUFDO0tBQUU7SUFDM0QsSUFBSSxhQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLE1BQU0saUZBQWlGLFFBQVEsR0FBRyxDQUFDLENBQUM7S0FDeEo7SUFFRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDckQsTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLFVBQVUsQ0FBQztJQUNsQyxRQUFRLFFBQVEsRUFBRTtRQUNoQixLQUFLLG9CQUFvQixDQUFDLElBQUk7WUFDNUIsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLG9CQUFvQixDQUFDLEtBQUs7WUFDN0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLFFBQVE7UUFDUixLQUFLLG9CQUFvQixDQUFDLElBQUk7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxNQUFNLElBQUksUUFBUSxnREFBZ0QsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNsRztZQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIGRpZ2l0YWwgc3RvcmFnZS5cbiAqXG4gKiBUaGUgYW1vdW50IGNhbiBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzIGEgbGl0ZXJhbCB2YWx1ZSAoZS5nOiBgMTBgKSB3aGljaFxuICogY2Fubm90IGJlIG5lZ2F0aXZlLCBvciBhcyBhbiB1bnJlc29sdmVkIG51bWJlciB0b2tlbi5cbiAqXG4gKiBXaGVuIHRoZSBhbW91bnQgaXMgcGFzc2VkIGFzIGEgdG9rZW4sIHVuaXQgY29udmVyc2lvbiBpcyBub3QgcG9zc2libGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTaXplIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIFN0b3JhZ2UgcmVwcmVzZW50aW5nIGFuIGFtb3VudCBieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIGJ5dGVzIHRvIGJlIHJlcHJlc2VudGVkXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IGBTaXplYCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBieXRlcyhhbW91bnQ6IG51bWJlcik6IFNpemUge1xuICAgIHJldHVybiBuZXcgU2l6ZShhbW91bnQsIFN0b3JhZ2VVbml0LkJ5dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTdG9yYWdlIHJlcHJlc2VudGluZyBhbiBhbW91bnQga2liaWJ5dGVzLlxuICAgKiAxIEtpQiA9IDEwMjQgYnl0ZXNcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIGtpYmlieXRlcyB0byBiZSByZXByZXNlbnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBgU2l6ZWAgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMga2liaWJ5dGVzKGFtb3VudDogbnVtYmVyKTogU2l6ZSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKGFtb3VudCwgU3RvcmFnZVVuaXQuS2liaWJ5dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTdG9yYWdlIHJlcHJlc2VudGluZyBhbiBhbW91bnQgbWViaWJ5dGVzLlxuICAgKiAxIE1pQiA9IDEwMjQgS2lCXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBtZWJpYnl0ZXMgdG8gYmUgcmVwcmVzZW50ZWRcbiAgICpcbiAgICogQHJldHVybnMgYSBuZXcgYFNpemVgIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1lYmlieXRlcyhhbW91bnQ6IG51bWJlcik6IFNpemUge1xuICAgIHJldHVybiBuZXcgU2l6ZShhbW91bnQsIFN0b3JhZ2VVbml0Lk1lYmlieXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RvcmFnZSByZXByZXNlbnRpbmcgYW4gYW1vdW50IGdpYmlieXRlcy5cbiAgICogMSBHaUIgPSAxMDI0IE1pQlxuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgZ2liaWJ5dGVzIHRvIGJlIHJlcHJlc2VudGVkXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IGBTaXplYCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnaWJpYnl0ZXMoYW1vdW50OiBudW1iZXIpOiBTaXplIHtcbiAgICByZXR1cm4gbmV3IFNpemUoYW1vdW50LCBTdG9yYWdlVW5pdC5HaWJpYnl0ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFN0b3JhZ2UgcmVwcmVzZW50aW5nIGFuIGFtb3VudCB0ZWJpYnl0ZXMuXG4gICAqIDEgVGlCID0gMTAyNCBHaUJcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIHRlYmlieXRlcyB0byBiZSByZXByZXNlbnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBgU2l6ZWAgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdGViaWJ5dGVzKGFtb3VudDogbnVtYmVyKTogU2l6ZSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKGFtb3VudCwgU3RvcmFnZVVuaXQuVGViaWJ5dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTdG9yYWdlIHJlcHJlc2VudGluZyBhbiBhbW91bnQgcGViaWJ5dGVzLlxuICAgKiAxIFBpQiA9IDEwMjQgVGlCXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgcGViaWJ5dGVzYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBlYmlieXRlKGFtb3VudDogbnVtYmVyKTogU2l6ZSB7XG4gICAgcmV0dXJuIFNpemUucGViaWJ5dGVzKGFtb3VudCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RvcmFnZSByZXByZXNlbnRpbmcgYW4gYW1vdW50IHBlYmlieXRlcy5cbiAgICogMSBQaUIgPSAxMDI0IFRpQlxuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgcGViaWJ5dGVzIHRvIGJlIHJlcHJlc2VudGVkXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IGBTaXplYCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwZWJpYnl0ZXMoYW1vdW50OiBudW1iZXIpOiBTaXplIHtcbiAgICByZXR1cm4gbmV3IFNpemUoYW1vdW50LCBTdG9yYWdlVW5pdC5QZWJpYnl0ZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhbW91bnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSB1bml0OiBTdG9yYWdlVW5pdDtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGFtb3VudDogbnVtYmVyLCB1bml0OiBTdG9yYWdlVW5pdCkge1xuICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGFtb3VudCkgJiYgYW1vdW50IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTdG9yYWdlIGFtb3VudHMgY2Fubm90IGJlIG5lZ2F0aXZlLiBSZWNlaXZlZDogJHthbW91bnR9YCk7XG4gICAgfVxuICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMudW5pdCA9IHVuaXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoaXMgc3RvcmFnZSBhcyBhIHRvdGFsIG51bWJlciBvZiBieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgdGhlIGNvbnZlcnNpb24gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgcXVhbnRpdHkgZXhwcmVzc2VkIGluIGJ5dGVzXG4gICAqL1xuICBwdWJsaWMgdG9CeXRlcyhvcHRzOiBTaXplQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgU3RvcmFnZVVuaXQuQnl0ZXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGlzIHN0b3JhZ2UgYXMgYSB0b3RhbCBudW1iZXIgb2Yga2liaWJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyB0aGUgY29udmVyc2lvbiBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBxdWFudGl0eSBvZiBieXRlcyBleHByZXNzZWQgaW4ga2liaWJ5dGVzXG4gICAqL1xuICBwdWJsaWMgdG9LaWJpYnl0ZXMob3B0czogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFN0b3JhZ2VVbml0LktpYmlieXRlcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoaXMgc3RvcmFnZSBhcyBhIHRvdGFsIG51bWJlciBvZiBtZWJpYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIHRoZSBjb252ZXJzaW9uIG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMgdGhlIHF1YW50aXR5IG9mIGJ5dGVzIGV4cHJlc3NlZCBpbiBtZWJpYnl0ZXNcbiAgICovXG4gIHB1YmxpYyB0b01lYmlieXRlcyhvcHRzOiBTaXplQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgU3RvcmFnZVVuaXQuTWViaWJ5dGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhpcyBzdG9yYWdlIGFzIGEgdG90YWwgbnVtYmVyIG9mIGdpYmlieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgdGhlIGNvbnZlcnNpb24gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgcXVhbnRpdHkgb2YgYnl0ZXMgZXhwcmVzc2VkIGluIGdpYmlieXRlc1xuICAgKi9cbiAgcHVibGljIHRvR2liaWJ5dGVzKG9wdHM6IFNpemVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBTdG9yYWdlVW5pdC5HaWJpYnl0ZXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGlzIHN0b3JhZ2UgYXMgYSB0b3RhbCBudW1iZXIgb2YgdGViaWJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyB0aGUgY29udmVyc2lvbiBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBxdWFudGl0eSBvZiBieXRlcyBleHByZXNzZWQgaW4gdGViaWJ5dGVzXG4gICAqL1xuICBwdWJsaWMgdG9UZWJpYnl0ZXMob3B0czogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFN0b3JhZ2VVbml0LlRlYmlieXRlcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoaXMgc3RvcmFnZSBhcyBhIHRvdGFsIG51bWJlciBvZiBwZWJpYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIHRoZSBjb252ZXJzaW9uIG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMgdGhlIHF1YW50aXR5IG9mIGJ5dGVzIGV4cHJlc3NlZCBpbiBwZWJpYnl0ZXNcbiAgICovXG4gIHB1YmxpYyB0b1BlYmlieXRlcyhvcHRzOiBTaXplQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgU3RvcmFnZVVuaXQuUGViaWJ5dGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgc2l6ZSBpcyBhIHRva2VuIG9yIGEgcmVzb2x2YWJsZSBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBpc1VucmVzb2x2ZWQoKSB7XG4gICAgcmV0dXJuIFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmFtb3VudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSb3VuZGluZyBiZWhhdmlvdXIgd2hlbiBjb252ZXJ0aW5nIGJldHdlZW4gdW5pdHMgb2YgYFNpemVgLlxuICovXG5leHBvcnQgZW51bSBTaXplUm91bmRpbmdCZWhhdmlvciB7XG4gIC8qKiBGYWlsIHRoZSBjb252ZXJzaW9uIGlmIHRoZSByZXN1bHQgaXMgbm90IGFuIGludGVnZXIuICovXG4gIEZBSUwsXG4gIC8qKiBJZiB0aGUgcmVzdWx0IGlzIG5vdCBhbiBpbnRlZ2VyLCByb3VuZCBpdCB0byB0aGUgY2xvc2VzdCBpbnRlZ2VyIGxlc3MgdGhhbiB0aGUgcmVzdWx0ICovXG4gIEZMT09SLFxuICAvKiogRG9uJ3Qgcm91bmQuIFJldHVybiBldmVuIGlmIHRoZSByZXN1bHQgaXMgYSBmcmFjdGlvbi4gKi9cbiAgTk9ORSxcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBob3cgdG8gY29udmVydCB0aW1lIHRvIGEgZGlmZmVyZW50IHVuaXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2l6ZUNvbnZlcnNpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIEhvdyBjb252ZXJzaW9ucyBzaG91bGQgYmVoYXZlIHdoZW4gaXQgZW5jb3VudGVycyBhIG5vbi1pbnRlZ2VyIHJlc3VsdFxuICAgKiBAZGVmYXVsdCBTaXplUm91bmRpbmdCZWhhdmlvci5GQUlMXG4gICAqL1xuICByZWFkb25seSByb3VuZGluZz86IFNpemVSb3VuZGluZ0JlaGF2aW9yO1xufVxuXG5jbGFzcyBTdG9yYWdlVW5pdCB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQnl0ZXMgPSBuZXcgU3RvcmFnZVVuaXQoJ2J5dGVzJywgMSk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS2liaWJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCdraWJpYnl0ZXMnLCAxMDI0KTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNZWJpYnl0ZXMgPSBuZXcgU3RvcmFnZVVuaXQoJ21lYmlieXRlcycsIDEwMjQgKiAxMDI0KTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBHaWJpYnl0ZXMgPSBuZXcgU3RvcmFnZVVuaXQoJ2dpYmlieXRlcycsIDEwMjQgKiAxMDI0ICogMTAyNCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVGViaWJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCd0ZWJpYnl0ZXMnLCAxMDI0ICogMTAyNCAqIDEwMjQgKiAxMDI0KTtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQZWJpYnl0ZXMgPSBuZXcgU3RvcmFnZVVuaXQoJ3BlYmlieXRlcycsIDEwMjQgKiAxMDI0ICogMTAyNCAqIDEwMjQgKiAxMDI0KTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsYWJlbDogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgaW5CeXRlczogbnVtYmVyKSB7XG4gICAgLy8gTUFYX1NBRkVfSU5URUdFUiBpcyAyXjUzLCBzbyBieSByZXByZXNlbnRpbmcgc3RvcmFnZSBpbiBraWJpYnl0ZXMsXG4gICAgLy8gdGhlIGhpZ2hlc3Qgc3RvcmFnZSB3ZSBjYW4gcmVwcmVzZW50IGlzIDggZXhiaWJ5dGVzLlxuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmxhYmVsO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnQoYW1vdW50OiBudW1iZXIsIGZyb21Vbml0OiBTdG9yYWdlVW5pdCwgdG9Vbml0OiBTdG9yYWdlVW5pdCwgb3B0aW9uczogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pIHtcbiAgY29uc3Qgcm91bmRpbmcgPSBvcHRpb25zLnJvdW5kaW5nID8/IFNpemVSb3VuZGluZ0JlaGF2aW9yLkZBSUw7XG4gIGlmIChmcm9tVW5pdC5pbkJ5dGVzID09PSB0b1VuaXQuaW5CeXRlcykgeyByZXR1cm4gYW1vdW50OyB9XG4gIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoYW1vdW50KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgU2l6ZSBtdXN0IGJlIHNwZWNpZmllZCBhcyAnU2l6ZS4ke3RvVW5pdH0oKScgaGVyZSBzaW5jZSBpdHMgdmFsdWUgY29tZXMgZnJvbSBhIHRva2VuIGFuZCBjYW5ub3QgYmUgY29udmVydGVkIChnb3QgU2l6ZS4ke2Zyb21Vbml0fSlgKTtcbiAgfVxuXG4gIGNvbnN0IG11bHRpcGxpZXIgPSBmcm9tVW5pdC5pbkJ5dGVzIC8gdG9Vbml0LmluQnl0ZXM7XG4gIGNvbnN0IHZhbHVlID0gYW1vdW50ICogbXVsdGlwbGllcjtcbiAgc3dpdGNoIChyb3VuZGluZykge1xuICAgIGNhc2UgU2l6ZVJvdW5kaW5nQmVoYXZpb3IuTk9ORTpcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBjYXNlIFNpemVSb3VuZGluZ0JlaGF2aW9yLkZMT09SOlxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsdWUpO1xuICAgIGRlZmF1bHQ6XG4gICAgY2FzZSBTaXplUm91bmRpbmdCZWhhdmlvci5GQUlMOlxuICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2Ftb3VudH0gJHtmcm9tVW5pdH0nIGNhbm5vdCBiZSBjb252ZXJ0ZWQgaW50byBhIHdob2xlIG51bWJlciBvZiAke3RvVW5pdH0uYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cbiJdfQ==