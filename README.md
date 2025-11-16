
# Secure Chat API

*********Install Node*********
---
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash # Replace v0.39.7 with the latest NVM version
source ~/.bashrc # or ~/.zshrc if you use zsh

nvm install --lts # Install the latest LTS version of Node.js
nvm use --lts # Use the latest LTS version

node -v
npm -v
---

*********Clone this repo*********

$ git clone git@github.com:sidhantpanda/docker-express-typescript-boilerplate.git your-app-name
$ cd your-app-name

*********Install dependencies*********
npm install


*********Update ENV*********
sudo nano .env

and paste the sample evn from .env.example



*********Start Server*********

npm run dev or npm run start


*********Postman Collection*********
postman collection shared in repo


*********Docker*********
install Docker and check installation status
https://www.docker.com/products/docker-desktop/

docker --version
docker compose version
or
docker-compose --version

change the docker-compose.yml accordingly for mysl and redis connection

docker-compose build
docker-compose up

to stop container
docker-compose down