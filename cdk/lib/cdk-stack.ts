import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'; // The CloudFront Origins CDK Library
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { API_PATHS, appName, taskNum } from './constants/cdk-constants';
import { S3AccessPolicy } from './cdk-s3-policy';
import { BEHAVIORS } from './config/cdk-ws-cache';
import { ComparePolicies, Policies } from './cdk-cache-policy';
import { IOrigin } from 'aws-cdk-lib/aws-cloudfront';
import { REDIRECTS } from './config/cdk-ws-redirect';
import { createRedirectFunction } from './functions/cdk-redirect';
import * as lambda from 'aws-cdk-lib/aws-lambda'; // The Lambda CDK Library !!!Only for 'us-east-1' region


export class ShopSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const siteBucket = new s3.Bucket( this, `${appName}-${taskNum}-S3`, {
      bucketName: `bv-eu-north-1-rss-${taskNum}`,
      //websiteIndexDocument: "index.html",     //commented, S3 is not httpOrigin and moved to the Distribution.defaultRootObject
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    } )

    const s3Origin = new origins.S3Origin(siteBucket, {
      originAccessIdentity: new S3AccessPolicy(this, siteBucket).accessIdentity,
    });

    const apiOrigin = new origins.HttpOrigin(API_PATHS.s3);

    const originsCreated: { [id: string]: IOrigin; } = {
      "s3": s3Origin,
      "api": apiOrigin,
    }

    const onlyDesktop = new lambda.Function(this, 'onlyDesktop', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'cdk-onlydesktop.handler',                    // File name that contains our function
      code: lambda.Code.fromAsset('./lib/functions'),    // Location of File
    });
    
    const customOriginRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'customOriginRequestPolicy', {
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList('CloudFront-Is-Desktop-Viewer'),
    }); 

    
    const distribution = new cloudfront.Distribution( this, `${appName}-${taskNum}-Distribution`, {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: "index.html",
      
      additionalBehaviors: {
        'api/*': {
          origin: apiOrigin,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,

           // Add cache policy:
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,

          // Add the origin request policy as such:
          originRequestPolicy: customOriginRequestPolicy,

          // Add the Lambda@Edge function as such:
          edgeLambdas: [{
            functionVersion: onlyDesktop.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,  // Origin Response
          }],    
        }
      }
 
    }
    )

    // Create a Policies list that will eventually contain all created Policies objects
    const policies: Policies[] = [];

    // Loop through each behavior defined in BEHAVIORS:
    for (const behavior of BEHAVIORS) {
      // Compare the behavior with previous policies
      const checkPolicy = new ComparePolicies(this, behavior, policies);
      
      // Take the newly created policy
      const policy = checkPolicy.finalPolicy;

      // If behavior did not match any Policies in policies, push the new policy into policies.
      if (checkPolicy.noMatch) {
        policies.push({
          policy: policy,
          cacheProps: behavior,
        })
      }

      // For each path in the behaviors.paths list create a new behavior in our distribution:
      for (let path of behavior.paths) {
        distribution.addBehavior(path,
          originsCreated[behavior.origin],
          {
            cachePolicy: policy,
          });
      };

    };

    // Loop through the function parameters defined in REDIRECTS
    for (const redirect of REDIRECTS) {

      // For each Function Parameter, create a new CloudFront Function
      const redirectFunction = new cloudfront.Function(this, "redirect-from-" + redirect.from + "-to-" + redirect.to, {
        code: cloudfront.FunctionCode.fromInline(createRedirectFunction(redirect)),
      });
      
      // Create a new behavior using the s3Origin and the from path defined in redirect.ts
      distribution.addBehavior(redirect.from,
        s3Origin,
        {
          functionAssociations: [{
            function: redirectFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          }],
        });
    }

    new s3deployment.BucketDeployment(this, `${appName}-${taskNum}-S3-Deployment`, {
      sources: [s3deployment.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution: distribution,
      distributionPaths: ["/*"]
    })


    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
