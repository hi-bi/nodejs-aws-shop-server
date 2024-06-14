import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from "constructs";
import { Duration } from 'aws-cdk-lib';  // Class that allows you define how duration
import { 
    ICachePolicy, 
    CacheCookieBehavior,
    CacheHeaderBehavior,
    CacheQueryStringBehavior,
} from 'aws-cdk-lib/aws-cloudfront'      
import {appName, taskNum } from './constants/cdk-constants'

// 1) An interface, where we can define the structure 
// of the behaviors that created in config/cdk-ws-cache.ts
interface CacheProps {
    origin: string,                         // Our origin
    paths: string[],                        // The paths that the behaviors are applied to
    cachePolicyName?: string,               // Optional, Name of Cache Policy
    comment?: string,                       // Optional, Comment to be added
    cookieBehavior?: CacheCookieBehavior,
    defaultTtl?: Duration,                  // Default Time To Live
    minTtl?: Duration,                      // Minimum Time To Live
    maxTtl?: Duration,                      // Maximum Time To Live
    gzip?: boolean,                         // Should it be gzip compressed
    brotli?: boolean,                       // Should it be brotli compressed
    headerBehavior?: CacheHeaderBehavior,
    queryStringBehavior?: CacheQueryStringBehavior,
}

// 2) A class named *CreateCachePolicy* that takes in a **CacheProps** defined, 
// and creates a new cache policy based on defined paramters.
export class CreateCachePolicy {
  policy: ICachePolicy;

  constructor(scope: Construct, props: CacheProps) {
      // Check if minTtl defined: else set to 0 seconds
      let minTtl = (props.minTtl ?? Duration.seconds(0)).toSeconds();

      // Check if defaultTtl defined: else set to max between 1 day and minTtl
      let defaultTtl = (props.defaultTtl ?? Duration.days(1)).toSeconds();
      defaultTtl = Math.max(defaultTtl, minTtl);

      // Check if maxTtl defined: else set to max between 365 days and defaultTtl
      let maxTtl = (props.maxTtl ?? Duration.days(365)).toSeconds();
      maxTtl = Math.max(defaultTtl, maxTtl);
	
      // Create our Cache Policy:
      const newCachePolicy = new cloudfront.CachePolicy(scope, `${appName}-${taskNum}-` + "CachePolicyFor-" + props.paths.join("-").replace(/[^a-z0-9/-]/gi, ''), {
          
          // Check if name is defined: else set name to "CloudFront-Cache-<count>"
          cachePolicyName: `${appName}-${taskNum}-` + "CachePolicyFor-" + props.paths.join("-").replace(/[^a-z0-9]/gi, ''),

	       // Check if comment is defined: else set to "Custom Cache Policy"
          comment: "Custom Cache Policy",

          // Check if cookieBehavior is defined: else set to none
          cookieBehavior: props.cookieBehavior ?? CacheCookieBehavior.none(),

  	       // Set Ttl to values defined before:
          defaultTtl: Duration.seconds(defaultTtl),
          maxTtl: Duration.seconds(maxTtl),
          minTtl: Duration.seconds(minTtl),
		
	       // Check if brotli, gzip compression defined: else set to false
          enableAcceptEncodingBrotli: props.brotli ?? false,
          enableAcceptEncodingGzip:props.gzip ?? false,

          // Check if headerBehavior is defined: else set to none
          headerBehavior: props.headerBehavior ?? CacheHeaderBehavior.none(),

          // Check if queryStringBehavior is defined: else set to none
          queryStringBehavior: props.queryStringBehavior ?? CacheQueryStringBehavior.none(),
      });
      this.policy = newCachePolicy;
  }
}

// 3) A type named **Policies**, which will contain a 
// **CacheProps** and the cache policy that is created from it.
export type Policies = {
    policy: ICachePolicy,
    cacheProps: CacheProps,
}

// 4) A function called **compare**, which takes in two 
// **CacheProps** and checks if they are the same.
function compare(parameter: string, policy1: CacheProps, policy2: CacheProps) {
    if (policy1[parameter as keyof CacheProps]) {
        if (policy2[parameter as keyof CacheProps]) {
            if (JSON.stringify(policy1[parameter as keyof CacheProps]) == JSON.stringify(policy2[parameter as keyof CacheProps])) {
                return true;
            } 
        } else {
            return false;
        }
    } else if (policy2[parameter as keyof CacheProps]) {
        return false;
    } 
    return true;
}


// 5) A class named **ComparePolices**, which takes in a 
// list of **Policies** and a **CacheProp**. It checks if any of the 
// **Policies** in the list are equivalent to the new **CacheProp** 
// using the **compare** function. If they is a **Policies** in the 
// list that is equivalent we just use its cache policy. 
// However, if there is no similar **Policies** we create a new policy using **CreateCachePolicy**. 
export class ComparePolicies {
    noMatch: boolean;
    finalPolicy: ICachePolicy;
    
    constructor(scope: Construct, newPolicy: CacheProps, policies: Policies[]) {
        this.noMatch = true;
        for (const policy of policies) {
            this.noMatch = false;
            if (policy.cacheProps.origin != newPolicy.origin) {
                continue;
            }
            for (const parameter of ["cookieBehavior", "defaultTtl", "minTtl", "maxTtl", "gzip", "brotli", "headerBehavior", "queryStringBehavior"]) {
                if (compare(parameter, policy.cacheProps, newPolicy)) {
                    continue;
                } else {
                    this.noMatch = true;
                    break;
                }
            }
            if (this.noMatch == false) {
                this.finalPolicy = policy.policy;
                break;
            }
        }
        
        if (this.noMatch) {
            this.finalPolicy = new CreateCachePolicy(scope, newPolicy).policy;
        }
    }
}
