import { AttributeType } from '../lib';

// STRING
export const string = AttributeType.string();
export const list_string = AttributeType.string({
  isList: true,
});

// ID
export const id = AttributeType.id();
export const list_id = AttributeType.id({
  isList: true,
});
export const required_id = AttributeType.id({
  isRequired: true,
});
export const required_list_id = AttributeType.id({
  isRequiredList: true,
});
export const required_list_required_id = AttributeType.id({
  isRequired: true,
  isRequiredList: true,
});
export const dup_id = AttributeType.id({
  isList: true,
  isRequired: true,
  isRequiredList: true,
});

// INT
export const int = AttributeType.int();

//FLOAT
export const float = AttributeType.float();
