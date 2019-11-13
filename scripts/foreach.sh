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
#     rm -f ~/.foreach.*
#
# this will effectively delete the state files.
#
# --------------------------------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)
statedir="${scriptdir}"
statefile="${statedir}/.foreach.state"
commandfile="${statedir}/.foreach.command"
command_arg="${@:-}"
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

if [[ "${1:-}" == "--reset" ]]; then
    rm -f "${statedir}/.foreach."*
    success "state cleared. you are free to start a new command."
    exit 0
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
    success "starting new session"
    node_modules/.bin/lerna ls --all --toposort -p > ${statefile}
    echo "${command}" > ${commandfile}
  else
    error "no active session, use \"$(basename $0) COMMAND\" to start a new session"
    exit 0
  fi
fi

next="$(head -n1 ${statefile})"
if [ -z "${next}" ]; then
  success "done (queue is empty). to reset:"
  success "   $0 --reset"
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
    exists=$(node -pe "require('./package.json').scripts['${script}'] || ''")
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
