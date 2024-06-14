import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'; // The Lambda CDK Library !!!Only for 'us-east-1' region
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class ShopServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const productsFunction = new lambda.Function(this, 'productsFunction', {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      code: lambda.Code.fromAsset('functions'), // Points to the lambda directory
      handler: 'cdk-products.handler', // Points to the 'hello' file in the lambda directory
    });

    new cdk.CfnOutput(this, 'productsFunctionOutput', {
      value: productsFunction.functionName,
      description: 'JavaScript Lambda function'
    });

    // Define the API Gateway resource
    const api = new apigateway.LambdaRestApi(this, 'productApi', {
      handler: productsFunction,
      proxy: false,
    });
        
    // Define the '/products' resource with a GET method
    const productResource = api.root.addResource('products');
    productResource.addMethod('GET');

  }
}
