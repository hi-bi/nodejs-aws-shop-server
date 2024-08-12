import { Construct } from 'constructs';
import { IRestApi, IResource, MockIntegration, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Function, IFunction } from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AUTH } from '../../constants/constants';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

class ApiGatewayImportService {
    apiGatewayProductService: IRestApi

    constructor(scope: Construct, id: string, importProductsFileLambda: IFunction) {

        const api = new apigateway.RestApi(scope, id, {
            description: 'Import service api.',
            cloudWatchRole: true,
            defaultCorsPreflightOptions: {
              allowOrigins: apigateway.Cors.ALL_ORIGINS,
              allowHeaders: [ 'Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token' ],
              allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });

        const apiImportProductsFilePath = api.root.addResource('import'); 

        const basicAuthorizerHandler = Function.fromFunctionArn(
          scope,
          'basicAuthorizer',
          AUTH.BASIC_AUTHORIZER_HANDLER_ARN
        );
        
        const authorizerRole = new Role(scope, 'authorizerRole', {
          assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
        });

        authorizerRole.addToPolicy(
          new PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [basicAuthorizerHandler.functionArn],
          }),
        );

        const tokenAuthorizer = new TokenAuthorizer(scope, 'tokenAuthorizer', {
          handler: basicAuthorizerHandler,
          identitySource: apigateway.IdentitySource.header('Authorization'),
          assumeRole: authorizerRole,
        });
    
        apiImportProductsFilePath.addMethod(
          'GET', 
          new apigateway.LambdaIntegration(importProductsFileLambda), 
          {
            requestParameters: {
              "method.request.querystring.name": true,
            },
            requestValidatorOptions: {
              requestValidatorName: "ImportProductsFile-querystring-validator",
              validateRequestParameters: true,
              validateRequestBody: false,
            },
            authorizationType: apigateway.AuthorizationType.CUSTOM,
            authorizer: tokenAuthorizer,
            methodResponses: [
              {
                statusCode: "200",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": true,
                  "method.response.header.Access-Control-Allow-Headers": true,
                  "method.response.header.Access-Control-Allow-Methods": true,
                },
              },
              {
                statusCode: "401",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": true,
                  "method.response.header.Access-Control-Allow-Headers": true,
                  "method.response.header.Access-Control-Allow-Methods": true,
                },
              },
              {
                statusCode: "403",
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": true,
                  "method.response.header.Access-Control-Allow-Headers": true,
                  "method.response.header.Access-Control-Allow-Methods": true,
                },
              },
            ],
            
          }
        );

        api.addGatewayResponse("GatewayResponseUnauthorized", {
          type: apigateway.ResponseType.UNAUTHORIZED,
          responseHeaders: {
            "Access-Control-Allow-Origin": "'*'",
            "Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "Access-Control-Allow-Methods": "'OPTIONS,GET,PUT'",
          },
          statusCode: "401",
        });
    
        api.addGatewayResponse("GatewayResponseAccessDenied", {
          type: apigateway.ResponseType.ACCESS_DENIED,
          responseHeaders: {
            "Access-Control-Allow-Origin": "'*'",
            "Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "Access-Control-Allow-Methods": "'OPTIONS,GET,PUT'",
          },
          statusCode: "403",
        });

    }
}

export { ApiGatewayImportService }