import type { Lut } from './file-location';

/**
 * A color space supported for 3D-LUT color conversion in a color-correction rule.
 */
export enum ColorSpace {
  /** HDR10. */
  HDR10 = 'HDR10',
  /** HLG (Rec. 2020). */
  HLG_2020 = 'HLG_2020',
  /** Rec. 601 (SD). */
  REC_601 = 'REC_601',
  /** Rec. 709 (HD). */
  REC_709 = 'REC_709',
}

/**
 * A color space correction rule.
 */
export interface ColorCorrection {
  /**
   * The input color space to match.
   */
  readonly inputColorSpace: ColorSpace;
  /**
   * The output color space to convert to.
   */
  readonly outputColorSpace: ColorSpace;
  /**
   * The 3D LUT file for the color correction. MediaLive reads the LUT from S3 at runtime, so it
   * must be an S3 location — provide it via `Lut.fromBucket()` (which uses the secure `s3ssl://`
   * form and auto-grants the channel role read access) or `Lut.url()` with an `s3://`/`s3ssl://` URL.
   * @default - no LUT file
   */
  readonly lut?: Lut;
}
