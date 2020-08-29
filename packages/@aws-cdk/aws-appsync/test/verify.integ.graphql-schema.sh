#!/bin/bash

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

function usage {
  echo "###############################################################################"
  echo "# run 'verify.integ.graphql-schema.sh --start' to deploy                         #"
  echo "# run 'verify.integ.graphql-schema.sh --check [APIKEY] [ENDPOINT]' to run check  #"
  echo "# run 'verify.integ.graphql-schema.sh --clean' to clean up stack                 #"
  echo "###############################################################################"
}

if [[ "$1" == "--start" ]]; then
  cdk deploy --app "node integ.graphql-schema.js"
elif [[ "$1" == "--check" ]]; then
  if [[ -z $2 || -z $3 ]]; then
    error "Error: --check flag requires [APIKEY] [ENDPOINT]"
    usage
    exit 1
  fi
  echo THIS TEST SHOULD PRODUCE AN EMPTY LIST
  curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$2" -d '{ "query": "query { getPlanets { id name } }" }" }' $3
  echo ""
  echo THIS TEST SHOULD RETURN A PLANET OBJECT
  curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$2" -d '{ "query": "mutation ($name: String!) { addPlanet(name: $name) { id name diameter } }", "variables": { "name": "smolPlanet" } }' $3
  echo ""
  echo THIS TEST SHOULD PRODUCE AN LIST WITH A SINGLE PLANET
  curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$2" -d '{ "query": "query { getPlanets { id name } }" }" }' $3
  echo ""
elif [[ "$1" == "--clean" ]];then
  cdk destroy --app "node integ.graphql-schema.js"
else
  error "Error: use flags --start, --check, --clean"
  usage
  exit 1
fi