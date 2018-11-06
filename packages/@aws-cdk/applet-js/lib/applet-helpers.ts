/**
 * Determine whether this constructorFunction is going to create an object that inherits from Stack
 *
 * We do structural typing.
 */
export function isStackConstructor(constructorFn: any) {
  // Test for a public method that Stack has
  return constructorFn.prototype.findResource !== undefined;
}

/**
 * Extract module name from a NPM package specification
 */
export function extractModuleName(packageSpec: string) {
    const m = /^((?:@[a-zA-Z-]+\/)?[a-zA-Z-]+)/i.exec(packageSpec);
    if (!m) { throw new Error(`Could not find package name in ${packageSpec}`); }
    return m[1];
}

export function parseApplet(applet: string): AppletSpec {
  const m = /^(npm:\/\/)?([a-z0-9_@./-]+)(:[a-z_0-9]+)?$/i.exec(applet);
  if (!m) {
    throw new Error(`"applet" value is "${applet}" but it must be in the form "[npm://]<js-module>[:<applet-class>]".
      If <applet-class> is not specified, "Applet" is the default`);
  }

  if (m[1] === 'npm://') {
    return {
      npmPackage: m[2],
      moduleName: extractModuleName(m[2]),
      className: className(m[3]),
    };
  } else {
    return {
      moduleName: m[2],
      className: className(m[3]),
    };
  }

  function className(s: string | undefined) {
    if (s) {
      return s.substr(1);
    }
    return 'Applet';
  }
}

export interface AppletSpec {
  npmPackage?: string;
  moduleName: string;
  className: string;
}