/**
 * Represents the amount of digital storage.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
export declare class Size {
    /**
     * Create a Storage representing an amount bytes.
     *
     * @param amount the amount of bytes to be represented
     *
     * @returns a new `Size` instance
     */
    static bytes(amount: number): Size;
    /**
     * Create a Storage representing an amount kibibytes.
     * 1 KiB = 1024 bytes
     *
     * @param amount the amount of kibibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static kibibytes(amount: number): Size;
    /**
     * Create a Storage representing an amount mebibytes.
     * 1 MiB = 1024 KiB
     *
     * @param amount the amount of mebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static mebibytes(amount: number): Size;
    /**
     * Create a Storage representing an amount gibibytes.
     * 1 GiB = 1024 MiB
     *
     * @param amount the amount of gibibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static gibibytes(amount: number): Size;
    /**
     * Create a Storage representing an amount tebibytes.
     * 1 TiB = 1024 GiB
     *
     * @param amount the amount of tebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static tebibytes(amount: number): Size;
    /**
     * Create a Storage representing an amount pebibytes.
     * 1 PiB = 1024 TiB
     *
     * @deprecated use `pebibytes` instead
     */
    static pebibyte(amount: number): Size;
    /**
     * Create a Storage representing an amount pebibytes.
     * 1 PiB = 1024 TiB
     *
     * @param amount the amount of pebibytes to be represented
     *
     * @returns a new `Size` instance
     */
    static pebibytes(amount: number): Size;
    private readonly amount;
    private readonly unit;
    private constructor();
    /**
     * Return this storage as a total number of bytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity expressed in bytes
     */
    toBytes(opts?: SizeConversionOptions): number;
    /**
     * Return this storage as a total number of kibibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in kibibytes
     */
    toKibibytes(opts?: SizeConversionOptions): number;
    /**
     * Return this storage as a total number of mebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in mebibytes
     */
    toMebibytes(opts?: SizeConversionOptions): number;
    /**
     * Return this storage as a total number of gibibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in gibibytes
     */
    toGibibytes(opts?: SizeConversionOptions): number;
    /**
     * Return this storage as a total number of tebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in tebibytes
     */
    toTebibytes(opts?: SizeConversionOptions): number;
    /**
     * Return this storage as a total number of pebibytes.
     *
     * @param opts the conversion options
     *
     * @returns the quantity of bytes expressed in pebibytes
     */
    toPebibytes(opts?: SizeConversionOptions): number;
    /**
     * Checks if size is a token or a resolvable object
     */
    isUnresolved(): boolean;
}
/**
 * Rounding behaviour when converting between units of `Size`.
 */
export declare enum SizeRoundingBehavior {
    /** Fail the conversion if the result is not an integer. */
    FAIL = 0,
    /** If the result is not an integer, round it to the closest integer less than the result */
    FLOOR = 1,
    /** Don't round. Return even if the result is a fraction. */
    NONE = 2
}
/**
 * Options for how to convert time to a different unit.
 */
export interface SizeConversionOptions {
    /**
     * How conversions should behave when it encounters a non-integer result
     * @default SizeRoundingBehavior.FAIL
     */
    readonly rounding?: SizeRoundingBehavior;
}
