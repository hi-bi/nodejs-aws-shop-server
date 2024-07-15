import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationService } from '../services/authorization-service/AuthorizationService';

class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const authorizationService = new AuthorizationService( this, id + '-authorizationService' );

  }
}

export { AuthorizationServiceStack }