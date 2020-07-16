#!/bin/bash

############
#    WiP   #
############

aws appsync list-graphql-apis

printf "\nInput the apiId for desired graphql-api: "
IFS=
userinput=""
while read -n1 key
do
# if input == enter key
if [[ "$key" == "" ]];
then
break;
fi
# Add the key to the variable which is pressed by the user.
userinput+=$key
done

aws appsync get-graphql-api --api-id "$userinput"
aws appsync list-api-keys --api-id "$userinput"