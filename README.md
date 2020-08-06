## SQS Experiment

### Prerequisites
Must have AWS CLI and AWS CDK configured properly

### How to deploy
First bootstrap your AWS environment by running `cdk bootstrap` 
Then running `cdk deploy` will deploy the following:
  - An API Gateway hooked up to a lambda function (producer)
  - A FIFO SQS That has a specific message group ID
  - Another lambda function (consumer)

### How to test
After the cdk deploy is successful, use the API gateway that is created to either do a `curl` or send in browser

The lambda producer will send messages with data passed in after the `/`. So for example
```
curl https://abcdefg.execute-api.us-west-2.amazonaws.com/prod/testing
```
will send a SQS message with the content `testing`.

The consumer will automatically pick up the message and prints out the response to Cloudwatch Logs.
