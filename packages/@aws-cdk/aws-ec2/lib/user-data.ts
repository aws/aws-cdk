import { OperatingSystemType } from "./machine-image";

/**
 * Instance User Data
 */
export abstract class UserData {
  /**
   * Create a userdata object for Linux hosts
   */
  public static forLinux(): UserData {
    return new LinuxUserData();
  }

  /**
   * Create a userdata object for Windows hosts
   */
  public static forWindows(): UserData {
    return new WindowsUserData();
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

  constructor() {
    super();
  }

  public addCommands(...commands: string[]) {
    this.lines.push(...commands);
  }

  public render(): string {
    return '#!/bin/bash\n' + this.lines.join('\n');
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