import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { productsMockData } from '../mock/products-data';
import { stocksMockData } from '../mock/stocks-data';
import { DYNAMODB } from "../constants/constants"; 

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

(async () => {

  const products = productsMockData;

  for (const item of products) {
    const command = new PutCommand({
      TableName: DYNAMODB.PRODUCTS_TABLE,
      Item: item,
    });
      
    const response = await docClient.send(command);
    console.log(response);
  }

  console.log('productsMockData loaded');


  const stocks = stocksMockData;

  for (const item of stocks) {
    const command = new PutCommand({
      TableName: DYNAMODB.STOCKS_TABLE,
      Item: item,
    });
      
    const response = await docClient.send(command);
    console.log(response);
  }

  console.log('stocksMockData loaded');

})()
