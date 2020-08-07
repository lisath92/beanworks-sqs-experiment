import boto3
import json
import os

SQS_CLIENT = boto3.client('sqs')


def handler(event, context):
  print(event)
  query_params = event["queryStringParameters"]

  if "/send" == event["path"]:
    message_body = query_params.get("body", "test sending SQS msg")
    message_group_id = query_params.get("groupId", "TestingGroupId")
  else:
    message_body = "default test SQS msg"
    message_group_id = "defaultGroupId"
    
  try:
    message_sent = SQS_CLIENT.send_message(
      QueueUrl=os.getenv("SQS_URL"),
      MessageBody=message_body,
      MessageGroupId=message_group_id
    )
    print("sent message: " + json.dumps(message_body))
  except Exception as e:
    print("Error sending SQS Message: " + str(e))
    raise
  return {
    'statusCode': 200,
    'body': f'Message with \"{message_body}\" is sent with GroupID: \"{message_group_id}\". MessageID: {message_sent["MessageId"]}'
  }
