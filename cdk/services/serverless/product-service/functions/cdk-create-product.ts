
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';


export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    try {

        console.log('createProduct lambda event: ', JSON.stringify(event, null, 4));

        const newAvailableProduct = event.body ? JSON.parse(event.body) : event;

        const createdAvailableProduct = await getProductsData.createProduct( newAvailableProduct);
    
        console.log('createProduct dynamodb result: ', JSON.stringify(createdAvailableProduct, null, 4));
    
        if (createdAvailableProduct) {
            return {
                statusCode: 201,
                headers: { 
                    "Content-Type":"application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
                },
                body: JSON.stringify(createdAvailableProduct),
            };
        
        } else {
            return {
                statusCode: 400,
                headers: { 
                    "Content-Type":"application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
                },
                body: JSON.stringify({"message": "Error"}),
            };
    
        }
            
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 
                "Content-Type":"application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
            },
            body: JSON.stringify({'message': 'Internal Error'}),
        };
        
    }    

};