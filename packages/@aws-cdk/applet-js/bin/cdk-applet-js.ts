#!/usr/bin/env node
import 'source-map-support/register';

import cdk = require('@aws-cdk/cdk');
import child_process = require('child_process');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import YAML = require('yaml');

import { isStackConstructor, parseApplet } from '../lib/applet-helpers';

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});

async function main() {
  const progname = path.basename(process.argv[1]);

  const appletFile = process.argv[2];
  if (!appletFile) {
    throw new Error(`Usage: ${progname} <applet.yaml>`);
  }

  // read applet(s) properties from the provided file
  const fileContents = YAML.parse(await fs.readFile(appletFile, { encoding: 'utf-8' }));
  if (typeof fileContents !== 'object') {
    throw new Error(`${appletFile}: should contain a YAML object`);
  }
  const appletMap = fileContents.applets;
  if (!appletMap) {
    throw new Error(`${appletFile}: must have an 'applets' key`);
  }

  const searchDir = path.dirname(appletFile);
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cdkapplet'));
  try {
    const app = new cdk.App();

    for (const [name, definition] of Object.entries(appletMap)) {
      await constructStack(app, searchDir, tempDir, name, definition);
    }
    app.run();
  } finally {
    await fs.remove(tempDir);
  }
}

/**
 * Construct a stack from the given props
 * @param props Const
 */
async function constructStack(app: cdk.App, searchDir: string, tempDir: string, stackName: string, spec: any) {
  // the 'applet' attribute tells us how to load the applet. in the javascript case
  // it will be in the format <module>:<class> where <module> is technically passed to "require"
  // and <class> is expected to be exported from the module.
  const appletSpec: string | undefined = spec.type;
  if (!appletSpec) {
    throw new Error(`Applet ${stackName} missing "type" attribute`);
  }

  const applet = parseApplet(appletSpec);

  const props = spec.properties || {};

  if (applet.npmPackage) {
    // tslint:disable-next-line:no-console
    console.error(`Installing NPM package ${applet.npmPackage}`);
    // Magic marker to download this package directly off of NPM
    // We're going to run NPM as a shell (since programmatic usage is not stable
    // by their own admission) and we're installing into a temporary directory.
    // (Installing into a permanent directory is useless since NPM doesn't do
    // any real caching anyway).
    child_process.execFileSync('npm', ['install', '--prefix', tempDir, '--global', applet.npmPackage], {
      stdio: 'inherit'
    });
    searchDir = path.join(tempDir, 'lib');
  }

  // we need to resolve the module name relatively to where the applet file is
  // and not relative to this module or cwd.
  const modulePath = require.resolve(applet.moduleName, { paths: [ searchDir ] });

  // load the module
  const pkg = require(modulePath);

  // find the applet class within the package
  // tslint:disable-next-line:variable-name
  const appletConstructor = pkg[applet.className];
  if (!appletConstructor) {
    throw new Error(`Cannot find applet class "${applet.className}" in module "${applet.moduleName}"`);
  }

  if (isStackConstructor(appletConstructor)) {
    // add the applet stack into the app.
    new appletConstructor(app, stackName, props);
  } else {
    // Make a stack THEN add it in
    const stack = new cdk.Stack(app, stackName, props);
    new appletConstructor(stack, 'Default', props);
  }
}
