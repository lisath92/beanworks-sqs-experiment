import boto3
import os
import json

SQS_CLIENT = boto3.client('sqs')

def handler(event, context):
  event_path = event.get("path")
  try:
    SQS_CLIENT.send_message(
      QueueUrl=os.getenv("SQS_URL"),
      MessageBody=f"sending message with the path of {event_path}",
      MessageGroupId="Testing"
    )
    print("sent message: " + json.dumps(event))
  except Exception as e:
    print("Error sending SQS Message: " + str(e))
    raise
  return {
    'statusCode': 200,
    'body': f'{event_path} is sent.'
}