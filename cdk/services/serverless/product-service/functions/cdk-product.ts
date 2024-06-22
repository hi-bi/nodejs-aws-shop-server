
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DYNAMODB } from '../../../../constants/cdk-constants'

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    
    console.log('Product lambda event: ', JSON.stringify(event, null, 4));
    const dynamodb = new DynamoDB({});

    const result = await dynamodb.send(
        new ScanCommand({
          TableName: DYNAMODB.PRODUCTS_TABLE,
        })
    );


    console.log('Products dynamodb result: ', JSON.stringify(result, null, 4));

    const products = [
        {
            description: "Short Product Description1",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            price: 24,
            title: "ProductOne",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
            price: 15,
            title: "ProductTitle",
        },
        {
            description: "Short Product Description2",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
            price: 23,
            title: "Product",
        },
        {
            description: "Short Product Description4",
            id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
            price: 15,
            title: "ProductTest",
        },
        {
            description: "Short Product Descriptio1",
            id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
            price: 23,
            title: "Product2",
        },
        {
            description: "Short Product Description7",
            id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
            price: 15,
            title: "ProductName",
        },
    ];

    const productId = event.pathParameters?.product_id
    const product = products.find((el) => el.id == productId)
    
    if (product) {
        return {
            statusCode: 200,
            headers: { 
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            body: JSON.stringify(product),
        };
    
    } else {
        return {
            statusCode: 404,
            headers: { 
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
            },
            body: JSON.stringify({"message": "Product not found"}),
        };

    }

};