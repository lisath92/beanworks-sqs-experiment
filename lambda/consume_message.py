import boto3
import random
import time

SQS_CLIENT = boto3.client('sqs')


def handler(event, context):
  random_sleep_duration = random.randint(3, 15)
  message = event["Records"][0]

  print(f"Processing message {message['messageId']} in {random_sleep_duration} seconds. Number of tries: {message['attributes']['ApproximateReceiveCount']}")
  for i in range(random_sleep_duration):
    print(f"processing: {i}s")
    time.sleep(1)

  response = f"\nMessageID: {message['messageId']}"
  response += f"\nMessageBody: {message['body']}"
  response += f"\nMessage retried without leaving queue: {message['attributes']['ApproximateReceiveCount']}"

  print(response)
  return {
    'statusCode': 200,
    'body': f"Message {message['messageId']} processed successfully."
  }
