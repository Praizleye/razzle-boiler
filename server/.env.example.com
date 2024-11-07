PORT = 8475
LOG_LEVEL = info
MONGO_URI = mongodb://localhost:27017
RESEND_API_KEY = #add resend api key here
ACCESS_TOKEN_SECRET = #can generate in terminal using node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
REFRESH_TOKEN_SECRET = #can generate in terminal using node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
MAGIC_LINK_SECRET = #can generate in terminal using node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"