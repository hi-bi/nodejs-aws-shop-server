import { Construct } from 'constructs';
//import { ImportBucket } from '../../s3/import/importBucket';
import { ImportProductsFile } from './importProductsFile';
import { ApiGatewayImportService } from './ApiGatewayImportService';
import { QUEUE, S3 } from '../../../constants/constants';
import { ImportFileParser } from './importFileParser'; 
import { taskNum } from '../../../constants/constants';
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
//import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';


class ImportService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        //const importBucket = new ImportBucket(scope, S3.IMPORT_BUCKET_ID).importBucket;
        //const backetName = importBucket.bucketName;

        const importBucket = Bucket.fromBucketName(
            scope,
            S3.IMPORT_BUCKET_ID,
            S3.IMPORT_BUCKET_NAME,
        );

        const backetName = S3.IMPORT_BUCKET_NAME; 

        const importProductsFileLambda = new ImportProductsFile(scope, `importProductsFileLambda-${taskNum}`, backetName).importProductsFileLambda;

        importBucket.grantReadWrite(importProductsFileLambda);
        importBucket.grantPut(importProductsFileLambda);
 
        const apiGatewayImportService = new ApiGatewayImportService( scope, `apiGatewayImportService-${taskNum}`,
            importProductsFileLambda,
        ).apiGatewayProductService;

        const importFileParserLambda = new ImportFileParser( scope, `importFileParserLambda-${taskNum}`, backetName).importFileParserLambda;

        importBucket.grantReadWrite(importFileParserLambda);
        importBucket.grantPut(importFileParserLambda);
        importBucket.grantDelete(importFileParserLambda);

        importBucket.addEventNotification(
            EventType.OBJECT_CREATED,
            new LambdaDestination(importFileParserLambda),
            {
                prefix: S3.IMPORT_UPLOADED_PREFIX,
                suffix: S3.IMPORT_UPLOADED_SUFFIX,
            }
        )
/*
        importFileParserLambda.addEventSource(
            new S3EventSource(importBucket as Bucket, {
              events: [EventType.OBJECT_CREATED],
              filters: [
                { prefix: S3.IMPORT_UPLOADED_PREFIX }, 
                { suffix: S3.IMPORT_UPLOADED_SUFFIX},
            ],
            })
        );
*/

    }
}

export { ImportService }