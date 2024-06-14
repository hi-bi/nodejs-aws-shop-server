import { IBucket } from "aws-cdk-lib/aws-s3";                       // S3 Bucket Class
import { Construct } from "constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";              // Class needed to create new Policy Statements
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";  // Class needed to create new OAI
import * as s3 from 'aws-cdk-lib/aws-s3';                           // The S3 CDK Library
import { appName, taskNum} from "./constants/cdk-constants";

export class S3AccessPolicy {
    accessIdentity: OriginAccessIdentity;  // Create an accessIdentity parameter
  
    constructor(scope: Construct, props: IBucket) {
      // 1) Create the Origin Access Identity
      const originAccessIdentity = new OriginAccessIdentity(scope, `${appName}-${taskNum}-OAI`);
      
      // 2) Create a policy statement to access the S3 Origin Bucket from our CloudFront
      const policyStatement = new PolicyStatement();
      policyStatement.addActions('s3:GetObject*');
      policyStatement.addResources(props.bucketArn);
      policyStatement.addResources(`${props.bucketArn}/*`);
      policyStatement.addCanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId);
  
      // 3) Create a bucket policy with the policy statement and add it to our Origin Bucket
      new s3.BucketPolicy(scope, `${appName}-${taskNum}-S3-Policy`, { bucket: props }).document.addStatements(policyStatement);
  
      this.accessIdentity = originAccessIdentity;
    }
  }