"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeRoundingBehavior = exports.Size = void 0;
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
        return convert(this.amount, this.unit, StorageUnit.Pebibytes, opts);
    }
    /**
     * Checks if size is a token or a resolvable object
     */
    isUnresolved() {
        return token_1.Token.isUnresolved(this.amount);
    }
}
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
        // MAX_SAFE_INTEGER is 2^53, so by representing storage in kibibytes,
        // the highest storage we can represent is 8 exbibytes.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWdDO0FBRWhDOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLElBQUk7SUFDZjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDaEMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztRQUNwQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7UUFDcEMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWM7UUFDbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO1FBQ3BDLE9BQU8sSUFBSSxJQUFJLENBQUMs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QUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLElBQUksTUFBTSxJQUFJLFFBQVEsZ0RBQWdELE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDbEc7WUFDRCxPQUFPLEtBQUssQ0FBQztLQUNoQjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGFtb3VudCBvZiBkaWdpdGFsIHN0b3JhZ2UuXG4gKlxuICogVGhlIGFtb3VudCBjYW4gYmUgc3BlY2lmaWVkIGVpdGhlciBhcyBhIGxpdGVyYWwgdmFsdWUgKGUuZzogYDEwYCkgd2hpY2hcbiAqIGNhbm5vdCBiZSBuZWdhdGl2ZSwgb3IgYXMgYW4gdW5yZXNvbHZlZCBudW1iZXIgdG9rZW4uXG4gKlxuICogV2hlbiB0aGUgYW1vdW50IGlzIHBhc3NlZCBhcyBhIHRva2VuLCB1bml0IGNvbnZlcnNpb24gaXMgbm90IHBvc3NpYmxlLlxuICovXG5leHBvcnQgY2xhc3MgU2l6ZSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTdG9yYWdlIHJlcHJlc2VudGluZyBhbiBhbW91bnQgYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBieXRlcyB0byBiZSByZXByZXNlbnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBgU2l6ZWAgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYnl0ZXMoYW1vdW50OiBudW1iZXIpOiBTaXplIHtcbiAgICByZXR1cm4gbmV3IFNpemUoYW1vdW50LCBTdG9yYWdlVW5pdC5CeXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RvcmFnZSByZXByZXNlbnRpbmcgYW4gYW1vdW50IGtpYmlieXRlcy5cbiAgICogMSBLaUIgPSAxMDI0IGJ5dGVzXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiBraWJpYnl0ZXMgdG8gYmUgcmVwcmVzZW50ZWRcbiAgICpcbiAgICogQHJldHVybnMgYSBuZXcgYFNpemVgIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGtpYmlieXRlcyhhbW91bnQ6IG51bWJlcik6IFNpemUge1xuICAgIHJldHVybiBuZXcgU2l6ZShhbW91bnQsIFN0b3JhZ2VVbml0LktpYmlieXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RvcmFnZSByZXByZXNlbnRpbmcgYW4gYW1vdW50IG1lYmlieXRlcy5cbiAgICogMSBNaUIgPSAxMDI0IEtpQlxuICAgKlxuICAgKiBAcGFyYW0gYW1vdW50IHRoZSBhbW91bnQgb2YgbWViaWJ5dGVzIHRvIGJlIHJlcHJlc2VudGVkXG4gICAqXG4gICAqIEByZXR1cm5zIGEgbmV3IGBTaXplYCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBtZWJpYnl0ZXMoYW1vdW50OiBudW1iZXIpOiBTaXplIHtcbiAgICByZXR1cm4gbmV3IFNpemUoYW1vdW50LCBTdG9yYWdlVW5pdC5NZWJpYnl0ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFN0b3JhZ2UgcmVwcmVzZW50aW5nIGFuIGFtb3VudCBnaWJpYnl0ZXMuXG4gICAqIDEgR2lCID0gMTAyNCBNaUJcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIGdpYmlieXRlcyB0byBiZSByZXByZXNlbnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBgU2l6ZWAgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2liaWJ5dGVzKGFtb3VudDogbnVtYmVyKTogU2l6ZSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKGFtb3VudCwgU3RvcmFnZVVuaXQuR2liaWJ5dGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTdG9yYWdlIHJlcHJlc2VudGluZyBhbiBhbW91bnQgdGViaWJ5dGVzLlxuICAgKiAxIFRpQiA9IDEwMjQgR2lCXG4gICAqXG4gICAqIEBwYXJhbSBhbW91bnQgdGhlIGFtb3VudCBvZiB0ZWJpYnl0ZXMgdG8gYmUgcmVwcmVzZW50ZWRcbiAgICpcbiAgICogQHJldHVybnMgYSBuZXcgYFNpemVgIGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRlYmlieXRlcyhhbW91bnQ6IG51bWJlcik6IFNpemUge1xuICAgIHJldHVybiBuZXcgU2l6ZShhbW91bnQsIFN0b3JhZ2VVbml0LlRlYmlieXRlcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU3RvcmFnZSByZXByZXNlbnRpbmcgYW4gYW1vdW50IHBlYmlieXRlcy5cbiAgICogMSBQaUIgPSAxMDI0IFRpQlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHBlYmlieXRlc2AgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwZWJpYnl0ZShhbW91bnQ6IG51bWJlcik6IFNpemUge1xuICAgIHJldHVybiBTaXplLnBlYmlieXRlcyhhbW91bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFN0b3JhZ2UgcmVwcmVzZW50aW5nIGFuIGFtb3VudCBwZWJpYnl0ZXMuXG4gICAqIDEgUGlCID0gMTAyNCBUaUJcbiAgICpcbiAgICogQHBhcmFtIGFtb3VudCB0aGUgYW1vdW50IG9mIHBlYmlieXRlcyB0byBiZSByZXByZXNlbnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyBhIG5ldyBgU2l6ZWAgaW5zdGFuY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcGViaWJ5dGVzKGFtb3VudDogbnVtYmVyKTogU2l6ZSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKGFtb3VudCwgU3RvcmFnZVVuaXQuUGViaWJ5dGVzKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgYW1vdW50OiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgdW5pdDogU3RvcmFnZVVuaXQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihhbW91bnQ6IG51bWJlciwgdW5pdDogU3RvcmFnZVVuaXQpIHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChhbW91bnQpICYmIGFtb3VudCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RvcmFnZSBhbW91bnRzIGNhbm5vdCBiZSBuZWdhdGl2ZS4gUmVjZWl2ZWQ6ICR7YW1vdW50fWApO1xuICAgIH1cbiAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICB0aGlzLnVuaXQgPSB1bml0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGlzIHN0b3JhZ2UgYXMgYSB0b3RhbCBudW1iZXIgb2YgYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIHRoZSBjb252ZXJzaW9uIG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMgdGhlIHF1YW50aXR5IGV4cHJlc3NlZCBpbiBieXRlc1xuICAgKi9cbiAgcHVibGljIHRvQnl0ZXMob3B0czogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFN0b3JhZ2VVbml0LkJ5dGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhpcyBzdG9yYWdlIGFzIGEgdG90YWwgbnVtYmVyIG9mIGtpYmlieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgdGhlIGNvbnZlcnNpb24gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgcXVhbnRpdHkgb2YgYnl0ZXMgZXhwcmVzc2VkIGluIGtpYmlieXRlc1xuICAgKi9cbiAgcHVibGljIHRvS2liaWJ5dGVzKG9wdHM6IFNpemVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBTdG9yYWdlVW5pdC5LaWJpYnl0ZXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGlzIHN0b3JhZ2UgYXMgYSB0b3RhbCBudW1iZXIgb2YgbWViaWJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyB0aGUgY29udmVyc2lvbiBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBxdWFudGl0eSBvZiBieXRlcyBleHByZXNzZWQgaW4gbWViaWJ5dGVzXG4gICAqL1xuICBwdWJsaWMgdG9NZWJpYnl0ZXMob3B0czogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFN0b3JhZ2VVbml0Lk1lYmlieXRlcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoaXMgc3RvcmFnZSBhcyBhIHRvdGFsIG51bWJlciBvZiBnaWJpYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIHRoZSBjb252ZXJzaW9uIG9wdGlvbnNcbiAgICpcbiAgICogQHJldHVybnMgdGhlIHF1YW50aXR5IG9mIGJ5dGVzIGV4cHJlc3NlZCBpbiBnaWJpYnl0ZXNcbiAgICovXG4gIHB1YmxpYyB0b0dpYmlieXRlcyhvcHRzOiBTaXplQ29udmVyc2lvbk9wdGlvbnMgPSB7fSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbnZlcnQodGhpcy5hbW91bnQsIHRoaXMudW5pdCwgU3RvcmFnZVVuaXQuR2liaWJ5dGVzLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhpcyBzdG9yYWdlIGFzIGEgdG90YWwgbnVtYmVyIG9mIHRlYmlieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgdGhlIGNvbnZlcnNpb24gb3B0aW9uc1xuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgcXVhbnRpdHkgb2YgYnl0ZXMgZXhwcmVzc2VkIGluIHRlYmlieXRlc1xuICAgKi9cbiAgcHVibGljIHRvVGViaWJ5dGVzKG9wdHM6IFNpemVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KTogbnVtYmVyIHtcbiAgICByZXR1cm4gY29udmVydCh0aGlzLmFtb3VudCwgdGhpcy51bml0LCBTdG9yYWdlVW5pdC5UZWJpYnl0ZXMsIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGlzIHN0b3JhZ2UgYXMgYSB0b3RhbCBudW1iZXIgb2YgcGViaWJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyB0aGUgY29udmVyc2lvbiBvcHRpb25zXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBxdWFudGl0eSBvZiBieXRlcyBleHByZXNzZWQgaW4gcGViaWJ5dGVzXG4gICAqL1xuICBwdWJsaWMgdG9QZWJpYnl0ZXMob3B0czogU2l6ZUNvbnZlcnNpb25PcHRpb25zID0ge30pOiBudW1iZXIge1xuICAgIHJldHVybiBjb252ZXJ0KHRoaXMuYW1vdW50LCB0aGlzLnVuaXQsIFN0b3JhZ2VVbml0LlBlYmlieXRlcywgb3B0cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHNpemUgaXMgYSB0b2tlbiBvciBhIHJlc29sdmFibGUgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgaXNVbnJlc29sdmVkKCkge1xuICAgIHJldHVybiBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5hbW91bnQpO1xuICB9XG59XG5cbi8qKlxuICogUm91bmRpbmcgYmVoYXZpb3VyIHdoZW4gY29udmVydGluZyBiZXR3ZWVuIHVuaXRzIG9mIGBTaXplYC5cbiAqL1xuZXhwb3J0IGVudW0gU2l6ZVJvdW5kaW5nQmVoYXZpb3Ige1xuICAvKiogRmFpbCB0aGUgY29udmVyc2lvbiBpZiB0aGUgcmVzdWx0IGlzIG5vdCBhbiBpbnRlZ2VyLiAqL1xuICBGQUlMLFxuICAvKiogSWYgdGhlIHJlc3VsdCBpcyBub3QgYW4gaW50ZWdlciwgcm91bmQgaXQgdG8gdGhlIGNsb3Nlc3QgaW50ZWdlciBsZXNzIHRoYW4gdGhlIHJlc3VsdCAqL1xuICBGTE9PUixcbiAgLyoqIERvbid0IHJvdW5kLiBSZXR1cm4gZXZlbiBpZiB0aGUgcmVzdWx0IGlzIGEgZnJhY3Rpb24uICovXG4gIE5PTkUsXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgaG93IHRvIGNvbnZlcnQgdGltZSB0byBhIGRpZmZlcmVudCB1bml0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpemVDb252ZXJzaW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBIb3cgY29udmVyc2lvbnMgc2hvdWxkIGJlaGF2ZSB3aGVuIGl0IGVuY291bnRlcnMgYSBub24taW50ZWdlciByZXN1bHRcbiAgICogQGRlZmF1bHQgU2l6ZVJvdW5kaW5nQmVoYXZpb3IuRkFJTFxuICAgKi9cbiAgcmVhZG9ubHkgcm91bmRpbmc/OiBTaXplUm91bmRpbmdCZWhhdmlvcjtcbn1cblxuY2xhc3MgU3RvcmFnZVVuaXQge1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCdieXRlcycsIDEpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtpYmlieXRlcyA9IG5ldyBTdG9yYWdlVW5pdCgna2liaWJ5dGVzJywgMTAyNCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTWViaWJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCdtZWJpYnl0ZXMnLCAxMDI0ICogMTAyNCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR2liaWJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCdnaWJpYnl0ZXMnLCAxMDI0ICogMTAyNCAqIDEwMjQpO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRlYmlieXRlcyA9IG5ldyBTdG9yYWdlVW5pdCgndGViaWJ5dGVzJywgMTAyNCAqIDEwMjQgKiAxMDI0ICogMTAyNCk7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUGViaWJ5dGVzID0gbmV3IFN0b3JhZ2VVbml0KCdwZWJpYnl0ZXMnLCAxMDI0ICogMTAyNCAqIDEwMjQgKiAxMDI0ICogMTAyNCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbGFiZWw6IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGluQnl0ZXM6IG51bWJlcikge1xuICAgIC8vIE1BWF9TQUZFX0lOVEVHRVIgaXMgMl41Mywgc28gYnkgcmVwcmVzZW50aW5nIHN0b3JhZ2UgaW4ga2liaWJ5dGVzLFxuICAgIC8vIHRoZSBoaWdoZXN0IHN0b3JhZ2Ugd2UgY2FuIHJlcHJlc2VudCBpcyA4IGV4YmlieXRlcy5cbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0KGFtb3VudDogbnVtYmVyLCBmcm9tVW5pdDogU3RvcmFnZVVuaXQsIHRvVW5pdDogU3RvcmFnZVVuaXQsIG9wdGlvbnM6IFNpemVDb252ZXJzaW9uT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHJvdW5kaW5nID0gb3B0aW9ucy5yb3VuZGluZyA/PyBTaXplUm91bmRpbmdCZWhhdmlvci5GQUlMO1xuICBpZiAoZnJvbVVuaXQuaW5CeXRlcyA9PT0gdG9Vbml0LmluQnl0ZXMpIHsgcmV0dXJuIGFtb3VudDsgfVxuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGFtb3VudCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNpemUgbXVzdCBiZSBzcGVjaWZpZWQgYXMgJ1NpemUuJHt0b1VuaXR9KCknIGhlcmUgc2luY2UgaXRzIHZhbHVlIGNvbWVzIGZyb20gYSB0b2tlbiBhbmQgY2Fubm90IGJlIGNvbnZlcnRlZCAoZ290IFNpemUuJHtmcm9tVW5pdH0pYCk7XG4gIH1cblxuICBjb25zdCBtdWx0aXBsaWVyID0gZnJvbVVuaXQuaW5CeXRlcyAvIHRvVW5pdC5pbkJ5dGVzO1xuICBjb25zdCB2YWx1ZSA9IGFtb3VudCAqIG11bHRpcGxpZXI7XG4gIHN3aXRjaCAocm91bmRpbmcpIHtcbiAgICBjYXNlIFNpemVSb3VuZGluZ0JlaGF2aW9yLk5PTkU6XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgY2FzZSBTaXplUm91bmRpbmdCZWhhdmlvci5GTE9PUjpcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICBkZWZhdWx0OlxuICAgIGNhc2UgU2l6ZVJvdW5kaW5nQmVoYXZpb3IuRkFJTDpcbiAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAnJHthbW91bnR9ICR7ZnJvbVVuaXR9JyBjYW5ub3QgYmUgY29udmVydGVkIGludG8gYSB3aG9sZSBudW1iZXIgb2YgJHt0b1VuaXR9LmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG4iXX0=