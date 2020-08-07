import boto3
import random
import time

SQS_CLIENT = boto3.client('sqs')


def handler(event, context):
  random_sleep_duration = random.randint(3, 15)
  print(f"Processing message in {random_sleep_duration} seconds...")
  time.sleep(random_sleep_duration)
  message = event["Records"][0]

  response = f"{message['messageId']}: {message['body']}"
  print(response)
  return {
    'statusCode': 200,
    'body': response
  }