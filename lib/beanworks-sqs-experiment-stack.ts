import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

export class BeanworksSqsExperimentStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const queue = new sqs.Queue(this, 'MessageQueue', {
      visibilityTimeout: cdk.Duration.seconds(10),
      contentBasedDeduplication: true,
      fifo: true
    });

    const msgProducer = new lambda.Function(this, 'MessageProducer', {
      runtime: lambda.Runtime.PYTHON_3_6,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'produce_message.handler',
      initialPolicy: [new iam.PolicyStatement({
        resources: [queue.queueArn],
        actions: ["sqs:SendMessage"]
      })],
      environment: {
        SQS_URL: queue.queueUrl
      }
    });

    new apigateway.LambdaRestApi(this, 'MessageProducerAPI', {
      handler: msgProducer
    });

    const msgConsumer = new lambda.Function(this, 'MessageConsumer', {
      runtime: lambda.Runtime.PYTHON_3_6,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'consume_message.handler'
    })
    msgConsumer.addEventSource(new SqsEventSource(queue));
  }
}
