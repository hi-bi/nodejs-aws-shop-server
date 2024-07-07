import { handler } from '../services/product-service/functions/catalogBatchProcessLambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SQSEvent } from "aws-lambda";
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

const snsClientMock = mockClient(SNSClient);
const dynamoDBClientMock = mockClient(DynamoDBClient);

const PRODUCT_MOCK = {
    id: '1',
    title: 'Mock Product',
    description: 'Mock Description',
    price: 99.99,
    count: 99,
}

describe( 'catalogBatchProcess test', () => {
        
    beforeEach(() => {
        snsClientMock.reset();
        dynamoDBClientMock.reset();
    });
    
    it( 'should return a 200', async () => {
        
        const event = {
            Records: [
                {
                    body: JSON.stringify(PRODUCT_MOCK),
                }
            ],
        } as SQSEvent;

        dynamoDBClientMock.on(PutItemCommand).resolves({});
        snsClientMock.on(PublishCommand).resolves({});
         
        const response = await handler(event);
            
        expect(response.statusCode).toBe( 200);    
    });

    it( 'should return a 400 on createProduct error', async () => {
        
        const event = {
            Records: [
                {
                    body: JSON.stringify(PRODUCT_MOCK),
                }
            ],
        } as SQSEvent;

        dynamoDBClientMock.on(PutItemCommand).rejects({});
        snsClientMock.on(PublishCommand).rejects({});
         
        const response = await handler(event);
           
        expect(response.statusCode).toBe( 400);    
    });

});

