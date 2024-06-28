import { Construct } from 'constructs';
import { ImportBucket } from '../../s3/import/importBucket';
import { ImportProductsFile } from './importProductsFile';
import { ApiGatewayImportService } from './ApiGatewayImportService';
import { S3 } from '../../../constants/cdk-constants';
import { ImportFileParser } from './importFileParser'; 


class ImportService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        //const importBucket = new ImportBucket(scope, S3.IMPORT_BUCKET_ID).importBucket;
        //const backetName = importBucket.bucketName; 

        const backetName = S3.IMPORT_BUCKET_NAME; 

        const importProductsFileLambda = new ImportProductsFile(scope, 'importProductsFileLambda', backetName).importProductsFileLambda
 
        const apiGatewayImportService = new ApiGatewayImportService( scope, 'apiGatewayImportService',
            importProductsFileLambda,
        ).apiGatewayProductService;

        const importFileParserLambda = new ImportFileParser( scope, 'importFileParserLambda').importFileParserLambda;

    }
}

export { ImportService }