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

### Bash Script Testing
Included for ease of testing is a `send_sqs_messages_test.sh`. Call on the script by passing in the endpoint given by `cdk deploy` like 
```
bash send_sqs_messages_test.sh https://bcdefg.execute-api.us-west-2.amazonaws.com/prod/
```
The script will go through the following 5 scenarios:
1. Sending a default message without passing in any query params
2. Sending a happy path test that has a body and a specific `MessageGroupId`
3. Sending another message with different content, but same `MessageGroupId`
4. Sending a message with the exact same content as #3
5. Sending a batch 10 messages with different message body and message group IDs.


### Considerations
* The SQS is set up as a FIFO (First In First Out) queue, messages with the same group id will be processed in the order it was sent. Messages with different group ids will not be processed in a specific order.
* `ContentBasedDeduplication` is set to `true`, meaning messages with the same body are accepted successfully but aren't delivered during a 5-minutes interval.
* The experiment is set up to consume a message between 3 to 15 seconds. This means that some messages will exceed the SQS `Visibility Timeout` of 10 seconds. The message that is not processed during those 10 seconds will return to the queue and have its `ApproximateReceiveCount` increment, then will be picked up by the next available lambda agent to be processed again.

### Unit tests
Run `npm run build && npx jest`

