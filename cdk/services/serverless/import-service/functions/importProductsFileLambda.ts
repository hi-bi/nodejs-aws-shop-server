import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Logger } from '@aws-lambda-powertools/logger';

//import { getProductsData } from '../../../dynamodb/product-storage/getProductsData';
const logger = new Logger();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    ): Promise<APIGatewayProxyResult> => {

    try {
        console.log('ImportProductsFile lambda event: ', JSON.stringify(event, null, 4));
        //logger.info('ImportProductsFile lambda event: ', { event });

        const eventParams = event.queryStringParameters;

        const fileName = eventParams?.name;

        const s3Client = new S3Client({});

        const bucketName = process.env.IMPORT_BUCKET_NAME;
        const paramKey = `uploaded/${fileName}`

        console.log('Params: ', bucketName, paramKey);
        //logger.info('bucketName: ', { bucketName });
        
        const preSignedUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({
                Bucket: bucketName,
                Key: paramKey,
            }),
            { expiresIn: 300 },
        );
        
            
        console.log('preSignedUrl: ', preSignedUrl);
        //logger.info('preSignedUrl: ', { preSignedUrl });
    
        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers": "Origin,Content-Type",
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT',
                'Access-Control-Max-Age': 2592000,
    },
            body: preSignedUrl,
        };
            
    } catch (error) {
        console.log('error: ', error);

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