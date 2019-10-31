#!/bin/bash
set -euo pipefail

PACMAK_VERSION=$(node -p 'JSON.stringify(require("jsii-pacmak/package.json").version)')

cat > ./lib/jsii-pacmak.generated.ts <<EOF
/**
 * A utility class to find out which version of jsii-pacmak was used to build
 * language bindings for this release. The jsii runtime library used must match
 * this version.
 */
export class JsiiPacmak {
  /**
   * The version of `jsii-pacmak` that was used to build language bindings for
   * this release. The jsii runtime library used must match this in order to
   * guarantee correct behavior.
   */
  public static readonly VERSION = ${PACMAK_VERSION};

  private constructor() {}
}
EOF
