#! bin/bash
api_endpoint=$1
if [ "${api_endpoint: -1}" != "/" ]
then
  base_api_endpoint="${api_endpoint}/send?"
else
  base_api_endpoint="$1send?"
fi

echo "==========================="
echo "Sending default message..."
curl -X GET "${1}"

echo "==========================="
echo "Running happy path test..."
curl -X GET "${base_api_endpoint}body=SQS-Message-1--HappyPathTesting&groupId=HappyPath"

echo "==========================="
echo "Sending another message with the same group ID."
echo "This should be processed after the first message"
curl -X GET "${base_api_endpoint}body=SQS-Message-2--SameGroupId&groupId=HappyPath"

echo "==========================="
echo "Sending message with the same content. The SQS will"
echo "accept the message as valid, however will not be placed"
echo "in the queue and it will not be processed."
curl -X GET "${base_api_endpoint}body=SQS-Message-2--SameGroupId&groupId=HappyPath"

echo "==========================="
echo "Sending 10 messages with different group IDs in a loop."
echo "These are processed at any order."

for i in {1..10}
do
  curl -X GET "${base_api_endpoint}body=SQS-Message-Group-${i}&groupId=MessageGroup${i}"
done
