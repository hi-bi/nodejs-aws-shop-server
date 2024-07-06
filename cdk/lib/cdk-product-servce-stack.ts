import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProductService } from '../services/serverless/product-service/ProductService';
import { appName, taskNum } from '../constants/constants';

export class ShopServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const productService = new ProductService( this, `${appName}-${taskNum}-ProductServiceAPIGateway`)

  }
}
