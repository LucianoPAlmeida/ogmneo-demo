# OGMNeo Simple Demo
An Rest API demo on how to use [OGMNeo](https://github.com/LucianoPAlmeida/OGMNeo) using [Docker](https://www.docker.com/)

You can run this application 
## On Docker 

  If you running this application on [docker](https://www.docker.com/), you can use docker compose 
  
  ````sh
    docker-compose build
    docker-compose up
    
  ````
## On local machine
  
  Assuming you have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
  
  Just run 
  ````sh
    npm install 
    npm start 
    
  ````
  
  or 
  
  ````sh
    yarn install
    yarn start
    
  ````
## Testing 
 After running the application, a [Swagger](https://swagger.io/) docs is available at http://localhost:3000 
 
 Also a graphql endpoint is available on http://localhost:3000/v1/users-query
