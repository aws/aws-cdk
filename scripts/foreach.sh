#!/bin/bash
# --------------------------------------------------------------------------------------------------
#
# this wonderful tool allows you to execute a command for all modules in this repo
# in topological order, but has the incredible property of being stateful.
# this means that if a command fails, you can fix the issue and resume from where
# you left off.
#
# to start a session, run:
#     foreach.sh COMMAND
#
# this will execute "COMMAND" for each module in the repo (cwd will be the directory of the module).
# if a task fails, it will stop, and then to resume, simply run `foreach.sh` again (with or without the same command).
#
# to reset the session (either when all tasks finished or if you wish to run a different session), run:
#     foreach.sh [-r | --reset]
#
# to force a reset and run a session with the current, run:
#     foreach.sh [-r | --reset] [-u | --up || -d | --down] COMMAND
#
# to run the command only against the current module and its dependencies:
#     foreach.sh [-u | --up] COMMAND
#
# to run the command only against the current module and its consumers:
#     foreach.sh [-d | --down] COMMAND
#
# --------------------------------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
statedir="${scriptdir}"
statefile="${statedir}/.foreach.state"
commandfile="${statedir}/.foreach.command"
base=$PWD

function heading {
  printf "\e[38;5;81m$@\e[0m\n"
}

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

function success {
  printf "\e[32;5;81m$@\e[0m\n"
}

function reset {
  rm -f "${statedir}/.foreach."*
  success "state cleared. you are free to start a new command."
}

DIRECTION=""
RESET=0
SKIP=0
command_arg=""

for arg in "$@"
do
  case "$arg" in
    -r | --reset) RESET=1               ;;
    -s | --skip)  SKIP=1                ;;
    -u | --up)    DIRECTION="UP"        ;;
    -d | --down)  DIRECTION="DOWN"      ;;
    *)  command_arg="$command_arg$arg " ;;
  esac
  shift
done

if [[ "$RESET" -eq 1 ]]; then
  reset
fi

if [[ "$RESET" -eq 1 && "$DIRECTION" == "" ]]; then
  exit 0
fi

if [[ "$SKIP" -eq 1 ]]; then
  if [ ! -f ${statefile} ]; then
    error "skip failed. no active sessions found."
    exit 1
  fi
  next=$(head -1 ${statefile})
  if [ -z "${next}" ]; then
    error "skip failed. queue is empty. to reset:"
    error "   $0 --reset"
    exit 1
  fi
  tail -n +2 "${statefile}" > "${statefile}.tmp"
  cp "${statefile}.tmp" "${statefile}"
  success "directory '$next' skipped. re-run the original foreach command (without --reset) to resume."
  exit 0
fi

direction=""
direction_desc=""
if [[ "$DIRECTION" == "UP" || "$DIRECTION" == "DOWN" ]]; then
  if [ ! -f package.json ]; then
    error "--up or --down can only be executed from within a module directory (looking for package.json)"
    exit 1
  fi

  scope=$(node -p "require('./package.json').name")

  if [[ "$DIRECTION" == "UP" ]]; then
    direction=" --scope ${scope} --include-dependencies"
    direction_desc="('${scope}' and its dependencies)"
  else # --down
    direction=" --scope ${scope} --include-dependents"
    direction_desc="('${scope}' and its consumers)"
  fi
fi

if [ -f "${statefile}" ] && [ -f "${commandfile}" ]; then
  command="$(cat ${commandfile})"
  if [ ! -z "${command_arg}" ] && [ "${command}" != "${command_arg}" ]; then
    error "error: there is still an active session for: \"${command}\". to reset:"
    error "   $0 --reset"
    exit 1
  fi
fi

if [ ! -f "${statefile}" ] && [ ! -f "${commandfile}" ]; then
  if [ ! -z "${command_arg}" ]; then
    command="${command_arg}"
    success "starting new session ${direction_desc}"
    ${scriptdir}/../node_modules/.bin/lerna ls --all ${direction} --toposort -p > ${statefile}
    echo "${command}" > ${commandfile}
  else
    error "no active session, use \"$(basename $0) COMMAND\" to start a new session"
    exit 0
  fi
fi

next="$(head -n1 ${statefile})"
if [ -z "${next}" ]; then
  success "done (queue is empty). reseting queue:"
  reset
  exit 0
fi

remaining=$(cat ${statefile} | wc -l | xargs -n1)

heading "---------------------------------------------------------------------------------"
heading "${next}: ${command} (${remaining} remaining)"

(
  cd ${next}

  # special-case "npm run" or "yarn run" - skip any modules that simply don't have
  # that script (similar to how "lerna run" behaves)
  if [[ "${command}" == "npm run "* ]] || [[ "${command}" == "yarn run "* ]]; then
    script="$(echo ${command} | cut -d" " -f3)"
    exists=$(node -pe "(require('./package.json').scripts && require('./package.json').scripts['${script}']) || ''")
    if [ -z "${exists}" ]; then
      echo "skipping (no "${script}" script in package.json)"
      exit 0
    fi
  fi

  sh -c "${command}" &> /tmp/foreach.stdio || {
    cd ${base}
    cat /tmp/foreach.stdio | ${scriptdir}/path-prefix ${next}
    error "error: last command failed. fix problem and resume by executing: $0"
    error "directory:    ${next}"
    exit 1
  }
)

tail -n +2 "${statefile}" > "${statefile}.tmp"
cp "${statefile}.tmp" "${statefile}"
exec $0
