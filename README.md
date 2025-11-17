# Secure Chat API

************************************
********* Install Node *************
************************************

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc    # or ~/.zshrc if using zsh

nvm install --lts   # Install latest LTS Node.js

nvm use --lts       # Use the LTS version

node -v

npm -v


************************************
********* Clone this repo **********
************************************

git clone https://github.com/Upendra12395/secure-chat-api.git

cd secure-chat-api


************************************
******** Install dependencies *******
************************************

npm install


************************************
********* Update ENV File **********
************************************

Create `.env` file:

sudo nano .env

Copy values from `.env.example` and fill in:

- Database credentials  
- Redis configuration  
- JWT secrets  
- AWS S3 keys  
- App port etc.


************************************
********** Start Server ************
************************************

For development:

npm run dev

For production:

npm start


************************************
******* Postman Collection *********
************************************

Postman collection is included in the repository inside:

`secure-chat-api.postman_collection.json`


************************************
************* Docker ***************
************************************

Install Docker Desktop:
https://www.docker.com/products/docker-desktop/

Check installation:

docker --version  
docker compose version  
# or  
docker-compose --version


************************************
**** Run using Docker Compose ******
************************************

Build containers:

docker-compose build

Start containers:

docker-compose up

Stop containers:

docker-compose down


************************************
*** Notes for Docker Configuration **
************************************

- Update `docker-compose.yml` with your MySQL + Redis environment.
- Make sure `.env` is correctly loaded.
- App server runs on port **4000** by default.
- MySQL runs inside Docker on **internal hostname `mysql`**.

