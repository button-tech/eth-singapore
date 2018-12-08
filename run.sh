#!bin/bash
docker rm -f $(docker ps -a)
docker pull neojt/mredis

docker run -d -p 6379:6379 neojt/mredis

cd telegram
docker build -t --name bot .
docker run -d -p 8545:8545 bot

cd ../api
docker build -t api .
docker run -d -p 3000:3000 api

cd ../frontend
docker build -t front .
docker run -d -p 80:80 front