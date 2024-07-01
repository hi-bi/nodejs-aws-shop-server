
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';


export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    try {
        console.log('ProductById lambda event: ', JSON.stringify(event, null, 4));

        const productId = event.pathParameters?.product_id || ''
    
        const productById = await getProductsData.getProductById(productId);
    
        console.log('ProductById dynamodb result: ', JSON.stringify(productById, null, 4));
    
        if (productById) {
            return {
                statusCode: 200,
                headers: { 
                    "Access-Control-Allow-Headers": "Origin,Content-Type",
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT',
                    'Access-Control-Max-Age': 2592000,
                },
                body: JSON.stringify(productById),
            };
        
        } else {
            return {
                statusCode: 404,
                headers: { 
                    "Access-Control-Allow-Headers": "Origin,Content-Type",
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT',
                },
                body: JSON.stringify({"message": "Product not found"}),
            };
    
        }
            
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 
                "Access-Control-Allow-Headers": "Origin,Content-Type",
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT',
        },
            body: JSON.stringify({'message': 'Internal Error'}),
        };
        
    }    

};