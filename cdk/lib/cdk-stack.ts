import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'; // The Lambda CDK Library !!!Only for 'us-east-1' region
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class ShopServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //Products
    const getProductsList = new lambda.Function(this, 'getProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      code: lambda.Code.fromAsset('functions'), // Points to the lambda directory
      handler: 'cdk-products.handler', // Points to the 'products' file in the lambda directory
    });

    new cdk.CfnOutput(this, 'getProductsListFunctionOutput', {
      value: getProductsList.functionName,
      description: 'getProductsList JavaScript Lambda function'
    });

    // Define the API Gateway resource
    const apiProducts = new apigateway.LambdaRestApi(this, 'productsApi', {
      handler: getProductsList,
      proxy: false,
    });
        
    // Define the '/products' resource with a GET method
    const productsResource = apiProducts.root.addResource('products');
    productsResource.addMethod('GET');

    //Product
    const getProductsById = new lambda.Function(this, 'getProductsByIdFunction', {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      code: lambda.Code.fromAsset('functions'), // Points to the lambda directory
      handler: 'cdk-product.handler', // Points to the 'product' file in the lambda directory
    });

    new cdk.CfnOutput(this, 'getProductsByIdFunctionOutput', {
      value: getProductsById.functionName,
      description: 'getProductsById JavaScript Lambda function'
    });

    // Define the API Gateway resource
    const apiProduct = new apigateway.LambdaRestApi(this, 'productApi', {
      handler: getProductsById,
      proxy: false,
    });
        
    // Define the '/products' resource with a GET method
    const productResource = apiProduct.root.addResource('products/{productId}');
    productResource.addMethod('GET');

  }
}
