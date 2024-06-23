import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';


export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    try {
        console.log('Products lambda event: ', JSON.stringify(event, null, 4));

        const availableProducts = await getProductsData.getAvailableProducts();
    
        console.log('availableProducts result: ', JSON.stringify(availableProducts, null, 4));
    
        return {
            statusCode: 200,
            headers: { 
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET'
            },
            body: JSON.stringify(availableProducts),
        };
            
    } catch (error) {
    
        return {
            statusCode: 500,
            headers: { 
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET'
            },
            body: JSON.stringify({'message': 'Internal Error'}),
        };
            
    }    
};