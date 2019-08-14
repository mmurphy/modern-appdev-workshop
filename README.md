# Enterprise Mobile AppDev Workshop
 
Workshop for enterprise enabled modern application development

## General information

This repository is designed to be working as template for graphback command line client.
`./template` folder will contain graphback server template used to initialize project.
`./template/client` contains react application that can be used to contact server

Please reffer to each individual `stepX` branch for individual steps for this tutorial

## Steps

**Work in progress**

## Introduction

TODO

### Prerequisites

- Node.js LTS 10 
- Docker and docker-compose
- Visual Studio Code (or other IDE)

### Bulding your first GraphQL server using AeroGear GraphBack

GraphBack command line tool (https://graphback.dev) allows developers 
to generate fully functional Node.js based server that will be offering 
GraphQL API out of the box based on developer provided business model.
In this chapter we going to build sample Task application that will
be based on custom server template we have provided.

Example server contains following technologies:

- AeroGear Voyager Server (including audit log, etrics and keycloak integration)
- Postgres database
- Apollo GraphQL server (Express.js based)

#### Steps

1. Install graphback client

```
 npm install -g graphback-cli
```

2. Create new project based on template

```
graphback init node-workshop ---templateUrl=https://github.com/aerogear/modern-appdev-workshop
```

In cmd please answer questions as follows:
```
? Do you want to include a example model? No
? Choose your database PostgreSQL
```

3. Change directory into project folder

```
cd node-workshop
```

2. Review the `Task.graphql` file inside `model` with your GraphQL types.
This file was added as part of the template. GraphBack allows you to 
provide your own business logic, but for this example we going use predefined 
one.

3. Run `graphback generate` to generate schema and resolvers

4. Run `docker-compose up -d` to run your database
   and graphback db to create database resources in postgres

5. Run `graphback watch` to start the server and watch for changes
   in model.

6. Server will be ready at http://localhost:4000/graphql

7. Server offers playground as way to interact with it's API
It is loaded with example queries that can be used to access data.
To to playground and execute GraphQL queries - createTask, updateTask etc.

### Bulding Your first GraphQL Client with React, GraphQL and AeroGear DataSync

Server side template comes with client folder that will contain React.js 
project boilerplate. We have initialized project using create-react-app
and applied following projects

- React.js TypeScript template
- *AeroGear Voyager Client* that will offer *Data Synchronization* and 
*Conflict resolution*.
- *Uniforms* - Library for building GraphQL forms based on GraphQL schema.

#### Steps

1. Install required dependencies for the project

```
npm install 
```