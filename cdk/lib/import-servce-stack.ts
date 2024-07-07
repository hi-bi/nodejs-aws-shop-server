import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ImportService } from '../services/import-service/ImportService';

class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const importService = new ImportService( this, id + '-importService' );

  }
}

export { ImportServiceStack }