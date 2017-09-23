fcc project nighlife coordination app [demo](https://fcc-nightlife-knik.c9users.io/)

# User Stories
1. As an unauthenticated user, I can view all bars in my area.
2. As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
3. As an authenticated user, I can remove myself from a bar if I no longer want to go there.
4. As an unauthenticated user, when I login I should not have to search again

## Acknowledgements
### Libs
MIT License  Copyright (c) 2016 Kristen Kehlenbeck  [yelp-api-v3](https://www.npmjs.com/package/yelp-api-v3)

### Loader
Loader gif from [loadergenerator.com](http://loadergenerator.com/)

### Boilerplate
Based on nikrb/auth-react-base

* node.js
* react.js
* react-router-dom (react-router v4)
* mongodb & mongoose
* passport.js (passport-local)

Following vlad's authentication [blog](https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt)

# setup

### install mongo
unixy:
```sudo apt-get install mongodb-org```

## development
1. clone repo
2. create .env file, e.g.
```
dbUri=mongodb://localhost:27017/testdb
jwtSecret=somesecretphrase
```
2. npm install (top level and client dirs)
3. startup mongo
4. npm start

## production (cloud9)
1. clone repo
2. create .env file, e.g.
```
dbUri=mongodb://localhost:27017/testdb
jwtSecret=somesecretphrase
NODE_ENV=production
```
3. npm install (top level and client dirs)
4. cd client && npm run build
5. cd ..
6. start mongo
7. node server
