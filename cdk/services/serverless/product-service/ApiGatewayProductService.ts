import { Construct } from 'constructs';
import { IRestApi, IResource, MockIntegration, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { availableProductDto } from '../../../entities/apiGatewayDto';


export class ApiGatewayProductService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, getProductsList: IFunction, getProductById: IFunction, createProduct: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Product service api.',
        });

        const getProductsListPath = api.root.addResource('products'); 
        // path name https://{createdId}.execute-api.us-east.amazonaws.com/prod/products

        getProductsListPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductsList)
        );


        const getProductPath = getProductsListPath.addResource('{product_id}');
        // path name https://{createdId}.execute-api.us-east.amazonaws.com/prod/{product-id}

        getProductPath.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductById)
        );


        const createProductModel = new apigateway.Model( scope, 'createProductModel', 
            {
                restApi: api,
                schema: availableProductDto,
                contentType: 'application/json',
            }
        );

        const createProductRequestValidator = new apigateway.RequestValidator( scope, 'createProductRequestValidator',
            {
                restApi: api,
                validateRequestBody: true
            }
        )
        getProductsListPath.addMethod(
            'PUT',
            new apigateway.LambdaIntegration(createProduct),
            {
                requestModels: {
                    'application/json': createProductModel
                },
                requestValidator: createProductRequestValidator
            }
        );

        addCorsOptions(getProductPath);
        addCorsOptions(getProductsListPath);

    }
    
}

function addCorsOptions(apiResource: IResource) {
    apiResource.addMethod('OPTIONS', new MockIntegration({
      // In case you want to use binary media types, uncomment the following line
      // contentHandling: ContentHandling.CONVERT_TO_TEXT,
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Oigin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
        },
      }],
      // In case you want to use binary media types, comment out the following line
      //passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      },
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Credentials': false,
          'method.response.header.Access-Control-Allow-Origin': true,
        },
      }]
    })
  }