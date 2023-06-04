import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({});

export const handler = async () => client.listTables({});