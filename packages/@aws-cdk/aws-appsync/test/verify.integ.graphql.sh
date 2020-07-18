#!/bin/bash
echo "---"
echo "Before mutation (query for customers)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:da2-kegodibyrzfbhiubdnjfmvy52u" -d '{ "query": "query { getCustomers { id name } }" }' https://ws3az3nucjcjjbm4o6ykdqltge.appsync-api.us-east-1.amazonaws.com/graphql
echo ""
echo "---"
echo "Sending mutation (add customer)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$1" -d '{ "query": "mutation { addCustomer( customer:{ name: \"test\" }) { id name } }" }' $2
echo ""
echo "---"
echo "After mutation (query for customer)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:da2-kegodibyrzfbhiubdnjfmvy52u" -d '{ "query": "query { getCustomers { id name } }" }' https://ws3az3nucjcjjbm4o6ykdqltge.appsync-api.us-east-1.amazonaws.com/graphql
echo ""