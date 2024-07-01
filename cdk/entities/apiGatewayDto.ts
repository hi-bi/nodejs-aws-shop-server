import { JsonSchema, JsonSchemaType } from "aws-cdk-lib/aws-apigateway";

const availableProductDto: JsonSchema = {
    type: JsonSchemaType.OBJECT,
    properties: {
      id: { 
        type: JsonSchemaType.STRING,
        maxLength: 36,
        minLength: 36,
      },
      title: { 
        type: JsonSchemaType.STRING,
      },
      description: { 
        type: JsonSchemaType.STRING
      },
      price: {
        type: JsonSchemaType.NUMBER,
        minimum: 0,
        multipleOf: 0.01
      },
      count: {
        type: JsonSchemaType.NUMBER,
        minimum: 0,
        multipleOf: 1
      },
    },
    additionalProperties: false,
    required: ["title", "price", "count"],
  };

export { availableProductDto }  