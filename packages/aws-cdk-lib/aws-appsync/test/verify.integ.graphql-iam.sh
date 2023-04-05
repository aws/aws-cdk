#!bin/bash

function error {
  printf "\e[91m$@\e[0m\n"
}

if [[ "$1" == "--start" ]]; then
  mkdir -p ./verify/node_modules
  npm install --prefix ./verify graphql-tag isomorphic-fetch aws-appsync
  cdk deploy --app 'node integ.graphql-iam.js'
elif [[ "$1" == "--clean" ]]; then
  rm -rf ./verify/node_modules
  rm -f ./verify/package-lock.json
  cdk destroy --app 'node integ.graphql-iam.js'
else
  error "Error: run with --start or --clean flag"
  exit 1
fi