import { expect as expectCDK, haveResource, haveResourceLike, arrayWith, objectLike, countResources, anything } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as BeanworksSqsExperiment from '../lib/beanworks-sqs-experiment-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    const stack = new BeanworksSqsExperiment.BeanworksSqsExperimentStack(app, 'TestStack');

    expectCDK(stack).to(haveResource("AWS::SQS::Queue",{
      VisibilityTimeout: 10,
      FifoQueue: true,
      ContentBasedDeduplication: true
    }));
});

test('Both Lambda Functions Created', () => {
    const app = new cdk.App();
    const stack = new BeanworksSqsExperiment.BeanworksSqsExperimentStack(app, 'TestStack');

    expectCDK(stack).to(countResources("AWS::Lambda::Function", 2));
})

test('Both Lambda Functions Created with Properties', () => {
  const app = new cdk.App();
  const stack = new BeanworksSqsExperiment.BeanworksSqsExperimentStack(app, 'TestStack');

  expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
    Timeout: 10
  }))
  expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
    Environment:{
      Variables: {
        SQS_URL: anything()
      }
    }
  }))
})

test('Lambda Function with SQS Policy Created', () => {
  const app = new cdk.App();
  const stack = new BeanworksSqsExperiment.BeanworksSqsExperimentStack(app, 'TestStack');

  expectCDK(stack).to(haveResourceLike('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: arrayWith(objectLike({
        Action: 'sqs:SendMessage',
        Resource: anything()
      }))
    }
  }))
})