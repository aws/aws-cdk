#!/bin/bash
echo "---"
echo "Before mutation (query for customers)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$1" -d '{ "query": "query { getCustomers { id name } }" }' $2
echo ""
echo "---"
echo "Sending mutation (add customer)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$1" -d '{ "query": "mutation { addCustomer( customer:{ name: \"test\" }) { id name } }" }' $2
echo ""
echo "---"
echo "After mutation (query for customer)"
curl -XPOST -H "Content-Type:application/graphql" -H "x-api-key:$1" -d '{ "query": "query { getCustomers { id name } }" }' $2
echo ""