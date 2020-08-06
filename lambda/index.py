import boto3
import os

SQS_CLIENT = boto3.client('sqs')

def start(event, context):
  SQS_CLIENT.send_message(
    QueueUrl=os.getenv("SQS_URL"),
    MessageBody="testing!"
  )
  print("sent message")
  return ''