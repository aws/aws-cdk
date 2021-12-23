/**
 * The Bundle for the instance.
 */
export class Bundle {
  /**
   * nano_2_0
   */
  public static readonly NANO_2_0 = Bundle.of('nano_2_0');
  /**
   * micro_2_0
   */
  public static readonly MICRO_2_0 = Bundle.of('micro_2_0');
  /**
   * small_2_0
   */
  public static readonly SMALL_2_0 = Bundle.of('small_2_0');
  /**
   * medium_2_0
   */
  public static readonly MEDIUM_2_0 = Bundle.of('medium_2_0');
  /**
   * large_2_0
   */
  public static readonly LARGE_2_0 = Bundle.of('large_2_0');
  /**
   * xlarge_2_0
   */
  public static readonly XLARGE_2_0 = Bundle.of('xlarge_2_0');
  /**
   * 2xlarge_2_0
   */
  public static readonly TWO_XLARGE_2_0 = Bundle.of('2xlarge_2_0');
  /**
   * nano_win_2_0
   */
  public static readonly NANO_WIN_2_0 = Bundle.of('nano_win_2_0');
  /**
   * micro_win_2_0
   */
  public static readonly MICRO_WIN_2_0 = Bundle.of('micro_win_2_0');
  /**
   * small_win_2_0
   */
  public static readonly SMALL_WIN_2_0 = Bundle.of('small_win_2_0');
  /**
   * medium_win_2_0
   */
  public static readonly MEDIUM_WIN_2_0 = Bundle.of('medium_win_2_0');
  /**
   * large_win_2_0
   */
  public static readonly LARGE_WIN_2_0 = Bundle.of('large_win_2_0');
  /**
   * xlarge_win_2_0
   */
  public static readonly XLARGE_WIN_2_0 = Bundle.of('xlarge_win_2_0');
  /**
   * 2xlarge_win_2_0
   */
  public static readonly TWO_XLARGE_WIN_2_0 = Bundle.of('2xlarge_win_2_0');

  /**
   * custom bundle id
   *
   * @param id the instance id
   */
  public static of(id: string) {
    return new Bundle(id);
  }
  /**
   * @param id the bundle id
   */
  private constructor(public readonly id: string) { }
}
