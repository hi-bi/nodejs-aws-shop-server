import { Construct } from 'constructs';
import { ImportBucket } from '../../s3/import/importBucket';
import { ImportProductsFile } from './importProductsFile';
import { ApiGatewayImportService } from './ApiGatewayImportService';
import { DYNAMODB } from '../../../constants/cdk-constants';


class ImportService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const importBucket = new ImportBucket(scope, DYNAMODB.IMPORT_BUCKET_NAME).importBucket;

        const importProductsFileLambda = new ImportProductsFile(scope, 'importProductsFileLambda', importBucket.bucketName).importProductsFileLambda
 
        const apiGatewayImportService = new ApiGatewayImportService( scope, 'apiGatewayImportService',
            importProductsFileLambda,
        ).apiGatewayProductService;

    }
}

export { ImportService }