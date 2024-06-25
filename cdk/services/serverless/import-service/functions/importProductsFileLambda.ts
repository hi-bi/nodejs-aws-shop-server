import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';   
//import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';


export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    try {
        console.log('ImportProductsFile lambda event: ', JSON.stringify(event, null, 4));

        const eventParams = event.pathParameters

        const fileName = eventParams?.name;

        if (fileName === undefined) {
            return Promise.resolve({
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing fileName' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        const s3Client = new S3Client({});

        const bucketName = process.env.BUCKET_NAME;
        
        const preSignedUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
                Bucket: bucketName,
                Key: `uploaded/${fileName}`,
            }),
            { expiresIn: 300 },
        );
        
    
        console.log('preSignedUrl: ', preSignedUrl);
    
        return {
            statusCode: 200,
            headers: { 
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({preSignedUrl}),
        };
            
    } catch (error) {
    
        return {
            statusCode: 500,
            headers: { 
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({'message': 'Internal Error'}),
        };
            
    }    
};