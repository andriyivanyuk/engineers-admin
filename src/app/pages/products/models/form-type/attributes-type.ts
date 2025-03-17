export interface AttributeValue {
  value: string;
  value_id: number;
}

export interface AttributesFormType {
  key: string;
  values: AttributeValue[];
  attribute_id: number;
}
