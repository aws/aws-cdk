import { GraphqlType } from '../lib';

// ID
export const id = GraphqlType.id();
export const list_id = GraphqlType.id({
  isList: true,
});
export const required_id = GraphqlType.id({
  isRequired: true,
});
export const required_list_id = GraphqlType.id({
  isRequiredList: true,
});
export const required_list_required_id = GraphqlType.id({
  isRequired: true,
  isRequiredList: true,
});
export const dup_id = GraphqlType.id({
  isList: true,
  isRequired: true,
  isRequiredList: true,
});

// STRING
export const string = GraphqlType.string();
export const required_string = GraphqlType.string({ isRequired: true });
export const list_string = GraphqlType.string({ isList: true });

// INT
export const int = GraphqlType.int();

// FLOAT
export const float = GraphqlType.float();

// BOOLEAN
export const boolean = GraphqlType.boolean();

// AWSDate
export const awsDate = GraphqlType.awsDate();

// AWSTime
export const awsTime = GraphqlType.awsTime();

// AWSDateTime
export const awsDateTime = GraphqlType.awsDateTime();

// AWSTimestamp
export const awsTimestamp = GraphqlType.awsTimestamp();

// AWSEmail
export const awsEmail = GraphqlType.awsEmail();

// AWSJSON
export const awsJson = GraphqlType.awsJson();

// AWSUrl
export const awsUrl = GraphqlType.awsUrl();

// AWSPhone
export const awsPhone = GraphqlType.awsPhone();

// AWSIPAddress
export const awsIpAddress = GraphqlType.awsIpAddress();
