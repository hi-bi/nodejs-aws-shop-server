import { Construct } from 'constructs';
import { 
  ITopic,
  Subscription, 
  SubscriptionFilter, 
  SubscriptionProtocol, 
  Topic, 
} from 'aws-cdk-lib/aws-sns';
import { QUEUE } from '../../constants/constants';


class CreateProductTopic {
  createProductTopic: ITopic;
  createProductTopicArn: string;

  constructor(scope: Construct, id: string,
    topicName: string, 
    ) {

    const createProductTopic = new Topic( scope, id,
      {
        topicName: topicName,
      }
    )
    const createProductTopicArn = createProductTopic.topicArn;

    const subscription = new Subscription( scope, QUEUE.SUBSCRIPTION_ID,
      {
        endpoint: QUEUE.SUBSCRIPTION_EMAIL,
        protocol: SubscriptionProtocol.EMAIL,
        topic: createProductTopic,
      }
    )

    const filterSubscription = new Subscription( scope, QUEUE.FILTER_SUBSCRIPTION_ID,
      {
        endpoint: QUEUE.SUBSCRIPTION_EMAIL,
        protocol: SubscriptionProtocol.EMAIL,
        topic: createProductTopic,
        filterPolicy:{
          
          'count': SubscriptionFilter.numericFilter( { greaterThanOrEqualTo: 5})
        }
      }
    )

    this.createProductTopic = createProductTopic;
    this.createProductTopicArn = createProductTopicArn;
  }

}    

export { CreateProductTopic }