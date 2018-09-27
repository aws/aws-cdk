#!/usr/bin/env node
import 'source-map-support/register';

import cdk = require('@aws-cdk/cdk');
import path = require('path');

// tslint:disable-next-line:no-var-requires
const YAML = require('yamljs');

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});

async function main() {
  const progname = path.basename(process.argv[1]);

  const appletFile = process.argv[2];
  if (!appletFile) {
    throw new Error(`Usage: ${progname}| <applet.yaml>`);
  }

  // read applet properties from the provided file
  const props = YAML.load(appletFile);

  // the cx request is expected to be passed as the second parameter for this applet program.
  // that's how cdk toolkit will use it.
  const request = process.argv[3] || JSON.stringify({});

  // the 'applet' attribute tells us how to load the applet. in the javascript case
  // it will be in the format <module>:<class> where <module> is technically passed to "require"
  // and <class> is expected to be exported from the module.
  const applet: string = props.applet;
  if (!applet) {
    throw new Error('Applet file missing "applet" attribute');
  }

  const { moduleName, className } = parseApplet(applet);

  // remove the 'applet' attribute as we pass it along to the applet class.
  delete props.applet;

  // we need to resolve the module name relatively to where the applet file is
  // and not relative to this module or cwd.
  const resolve = require.resolve as any; // escapse type-checking since { paths } is not defined
  const modulePath = resolve(moduleName, { paths: [ path.dirname(appletFile) ] });

  // load the module
  const pkg = require(modulePath);

  // find the applet class within the package
  // tslint:disable-next-line:variable-name
  const AppletStack = pkg[className];
  if (!AppletStack) {
    throw new Error(`Cannot find applet class "${className}" in module "${moduleName}"`);
  }

  // create the CDK app
  const app = new cdk.App([ progname, request ]);

  const constructName = props.name || className;

  // add the applet stack into the app.
  new AppletStack(app, constructName, props);

  // transfer control to the app
  process.stdout.write(app.run());
}

function parseApplet(applet: string) {
  const components = applet.split(':');
  // tslint:disable-next-line:prefer-const
  let [ moduleName, className ] = components;

  if (components.length > 2 || !moduleName) {
    throw new Error(`"applet" value is "${applet}" but it must be in the form "<js-module>[:<applet-class>]".
      If <applet-class> is not specified, "Applet" is the default`);
  }

  if (!className) {
    className = 'Applet';
  }

  return { moduleName, className };
}
