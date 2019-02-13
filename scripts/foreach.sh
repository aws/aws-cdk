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
statefile="${HOME}/.foreach.state"
commandfile="${HOME}/.foreach.command"
command_arg="${@:-}"

function heading {
  printf "\e[38;5;81m$@\e[0m\n"
}

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

function success {
  printf "\e[32;5;81m$@\e[0m\n"
}

if [ -f "${statefile}" ] && [ -f "${commandfile}" ]; then
  command="$(cat ${commandfile})"
  if [ ! -z "${command_arg}" ] && [ "${command}" != "${command_arg}" ]; then
    error "error: there is still an active session for: \"${command}\". to reset:"
    error "   rm -f ~/.foreach.*"
    exit 1
  fi
fi

if [ ! -f "${statefile}" ] && [ ! -f "${commandfile}" ]; then
  if [ ! -z "${command_arg}" ]; then
    command="${command_arg}"
    success "starting new session"
    lerna ls --all --toposort -p > ${statefile}
    echo "${command}" > ${commandfile}
  else
    error "no active session, use \"$(basename $0) COMMAND\" to start a new session"
    exit 0
  fi
fi

next="$(head -n1 ${statefile})"
if [ -z "${next}" ]; then
  success "done (queue is empty). to reset:"
  success "   rm -f ~/.foreach.*"
  exit 0
fi

remaining=$(cat ${statefile} | wc -l | xargs -n1)

heading "---------------------------------------------------------------------------------"
heading "${next}: ${command} (${remaining} remaining)"

(
  cd ${next}
  ${command} || {
    error "error: last command failed. fix problem and resume by executing:"
    error "    $0"
    exit 1
  }
)

tail -n +2 "${statefile}" > "${statefile}.tmp"
cp "${statefile}.tmp" "${statefile}"
exec $0
