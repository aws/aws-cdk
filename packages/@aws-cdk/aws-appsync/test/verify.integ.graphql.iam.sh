#!bin/bash

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

if [[ "$1" == "--start" ]]; then
  mkdir -p ./lambda/node_modules
  npm install --prefix ./lambda graphql-tag isomorphic-fetch aws-appsync
elif [[ "$1" == "--clean" ]]; then
  rm -rf ./lambda/node_modules
  rm -f ./lambda/package-lock.json
else
  error "Error: run with --start or --clean flag"
  exit 1
fi