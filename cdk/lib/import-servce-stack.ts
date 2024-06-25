import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ImportService } from '../services/serverless/import-service/ImportService';

class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const importService = new ImportService( scope, id + '-importService' );

  }
}

export { ImportServiceStack }