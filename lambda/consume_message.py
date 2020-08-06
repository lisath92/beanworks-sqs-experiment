import boto3
import random
import time

SQS_CLIENT = boto3.client('sqs')

def handler(event, context):
  random_sleep_duration = random.randint(3, 11)
  print(f"Processing message in {random_sleep_duration} seconds...")
  time.sleep(random_sleep_duration)
  
  response = "Received Message Body from API GW: " + event['Records'][0]['body']
  print(response)
  return {
    'statusCode': 200,
    'body': response
  }