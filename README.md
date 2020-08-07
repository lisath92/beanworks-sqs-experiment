## SQS Experiment

### Resources
This CDK sample creates:
* Lambda function that can be invoked using API Gateway
* The lambda function will trigger a send message to SQS
* Consumer lambda function that reads the input of the message and puts into CloudWatch Logs

### How to deploy
* Ensure [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) is installed and AWS credentials are set. 
* [Bootstrap AWS environment](https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html#serverless_example_deploy_and_test) by running `cdk bootstrap`.

### How to test
After the cdk deploy is successful, use the API URL from the output to do a `curl` or paste in browser.

The API accepts the following:
* `/` - this will send a default message of `"default test SQS msg"` with default MessageGroupId: `defaultGroupId`.
* `/send` - this will allow a customized message body and message group id by passing in query parameters like
```
/send?body=messageBody&groupId=group123
```

An example request would be
```
curl https://abcdefg.execute-api.us-west-2.amazonaws.com/prod/send?body=testingSQSMessage&groupId=cronjobs
```
If this is done in the web, a successful response would look like
```
Message with "testing" is sent with GroupID: "cronjobs". MessageID: be8ea457-54ab-46c5-b10e-cabcb60d9a59
```

The consumer will automatically pick up the message and prints out the response to CloudWatch Logs.

### Considerations
* The SQS is set up as a FIFO (First In First Out) queue, messages with the same group id will be processed in the order it was sent. Messages with different group ids will not be processed in a specific order.
* `ContentBasedDeduplication` is set to `true`, meaning messages with the same body are accepted successfully but aren't delivered during a 5-minutes interval.

### Unit tests
Run `npm run run build && npx jest`

