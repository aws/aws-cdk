import { GraphqlType } from '../lib';

// STRING
export const string = GraphqlType.string();
export const list_string = GraphqlType.string({
  isList: true,
});

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

// INT
export const int = GraphqlType.int();

//FLOAT
export const float = GraphqlType.float();
