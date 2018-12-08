#!bin/bash
cd frontend

sudo docker rm -f front
sudo git pull
sudo docker build -t front .
sudo docker run -d --name front front