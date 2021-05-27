export abstract class CommandImage {
  public static readonly GENERIC_LINUX: CommandImage = new class extends CommandImage {} ();
  public static readonly GENERIC_WINDOWS: CommandImage = new class extends CommandImage {} ();
}

