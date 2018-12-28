## REST API for Google Contacts

This projects implements API for your contacts and provide an
ability to sync your Google Contacts via 3rd party API.

SignIn with your Google Account and discover following endpoints:

Home page with GoogleOauth prompt
```$xslt
GET / 
```

#### REST API

Get all users in the system
```$xslt
GET /users 
```

Get all contacts for specific user
```$xslt
GET /users/:userId/contacts
```

Create user contact
```$xslt
POST /users/:userId/contacts 
```
```
{
    "name": "My New Contact",
    "phone": ["+1099999999999", "+1022222222222"],
    "email": ["contact@gmail.com"],
}
```

Update existing contact (Payload is the same as for create)
```$xslt
PUT /users/:userId/contacts/:contactId
```

Remove user contact
```$xslt
DELETE /users/:userId/contacts/:contactId
```

Import all contacts from GoogleAPI
```$xslt
POST /users/:userId/sync-contacts
```


### TO RUN THE APP

+ Fill the `.env` file with config of your application, registered in Google Cloud Platform
+ Run the MongoDB instance, use docker-compose.yml to simplify this action
+ Run the app: `npm run start`
+ Discover the app it on `localhost:3000` port