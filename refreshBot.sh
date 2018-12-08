#!bin/bash
cd telegram

sudo docker rm -f bot
sudo git pull
sudo docker build -t bot .
sudo docker run -d --name bot bot