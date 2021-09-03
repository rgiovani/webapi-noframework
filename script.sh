echo 'requesting all'
curl localhost:3000/heroes/

echo ' '

echo 'requesting by hero id'
curl localhost:3000/heroes/1

echo ' '

echo 'requesting with wrong body'
curl --silent -X POST \ --data-binary '{"invalid": "data"}' \ localhost:3000/heroes

echo 'creating new hero'
curl --silent -X POST \ --data-binary '{"name":"Boss2","damage":30,"power":"Master"}' \ localhost:3000/heroes

echo $CREATE

ID=$(echo $CREATE | jq.id)
echo $ID
#to execute this use -> bash script.sh OR sh script.sh