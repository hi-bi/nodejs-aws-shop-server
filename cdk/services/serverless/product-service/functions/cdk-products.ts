import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { productsData } from '../../../dynamodb/product-storage/getProductsData';


export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    console.log('Products lambda event: ', JSON.stringify(event, null, 4));

    const availableProducts = productsData.getAvailableProducts();

    console.log('availableProducts result: ', JSON.stringify(availableProducts, null, 4));

/*
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
*/
    return {
        statusCode: 200,
        headers: { 
            "Content-Type":"application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        body: JSON.stringify(availableProducts),
    };
};