import { OperatingSystemType } from "./machine-image";

/**
 * Options when constructing UserData for Linux
 */
export interface LinuxUserDataOptions {
  /**
   * Shebang for the UserData script
   *
   * @default "#!/bin/bash"
   */
  readonly shebang?: string;
}

/**
 * Instance User Data
 */
export abstract class UserData {
  /**
   * Create a userdata object for Linux hosts
   */
  public static forLinux(options: LinuxUserDataOptions = {}): UserData {
    return new LinuxUserData(options);
  }

  /**
   * Create a userdata object for Windows hosts
   */
  public static forWindows(): UserData {
    return new WindowsUserData();
  }

  /**
   * Create a userdata object with custom content
   */
  public static custom(content: string): UserData {
    const userData = new CustomUserData();
    userData.addCommands(content);
    return userData;
  }

  public static forOperatingSystem(os: OperatingSystemType): UserData {
    switch (os) {
      case OperatingSystemType.LINUX: return UserData.forLinux();
      case OperatingSystemType.WINDOWS: return UserData.forWindows();
    }
  }

  /**
   * Add one or more commands to the user data
   */
  public abstract addCommands(...commands: string[]): void;

  /**
   * Render the UserData for use in a construct
   */
  public abstract render(): string;
}

class LinuxUserData extends UserData {
  private readonly lines: string[] = [];

  constructor(private readonly props: LinuxUserDataOptions = {}) {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public render(): string {
    const shebang = this.props.shebang !== undefined ? this.props.shebang : '#!/bin/bash';
    return [shebang, ...this.lines].join('\n');
  }
}

class WindowsUserData extends UserData {
  private readonly lines: string[] = [];

  constructor() {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public render(): string {
    return `<powershell>${this.lines.join('\n')}</powershell>`;
  }
}

class CustomUserData extends UserData {
  private readonly lines: string[] = [];

  constructor() {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public render(): string {
    return this.lines.join('\n');
  }
}