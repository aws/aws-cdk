#!/bin/sh
# The author wrote: --marker <deploy-time value> --flag -q "<deploy-time value>"
# Each deploy-time value is passed as one argument, on its own or inside the
# author's quotes. Nothing in them runs, so the file receives plain text.
[ "$#" -eq 5 ] || { echo "expected 5 arguments, got $#: $*"; exit 1; }
[ "$1" = "--marker" ] && [ "$3" = "--flag" ] && [ "$4" = "-q" ] || { echo "unexpected arguments: $*"; exit 1; }
[ "$2" = "/tmp/cdk data '; touch /tmp/cdk-injected; '" ] || { echo "unexpected value: [$2]"; exit 1; }
[ "$5" = "a b" ] || { echo "unexpected quoted value: [$5]"; exit 1; }
[ ! -e /tmp/cdk-injected ] || { echo "a deploy-time value ran as a command"; exit 1; }
echo "deploy-time values arrived as plain text"
