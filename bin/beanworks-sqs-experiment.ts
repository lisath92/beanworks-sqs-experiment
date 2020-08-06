#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { BeanworksSqsExperimentStack } from '../lib/beanworks-sqs-experiment-stack';

const app = new cdk.App();
new BeanworksSqsExperimentStack(app, 'BeanworksSqsExperimentStack');
