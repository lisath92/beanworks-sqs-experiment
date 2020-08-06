import * as sns from '@aws-cdk/aws-sns';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

export class BeanworksSqsExperimentStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const queue = new sqs.Queue(this, 'MessageQueue', {
      visibilityTimeout: cdk.Duration.seconds(10)
    });

    const msgProducer = new lambda.Function(this, 'MessageProducer', {
      runtime: lambda.Runtime.PYTHON_3_6,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.start',
      environment: {
        SQS_URL: queue.queueUrl
      }
    });

    msgProducer.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess"));
  }
}
