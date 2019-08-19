# Enterprise Mobile AppDev Workshop

Workshop for enterprise enabled modern application development using 
AeroGear and Mobile Developer service technologies

## General information

This tutorial is backed by https://github.com/aerogear/modern-appdev-workshop github repository.

This repository is designed to be working as template for `graphback` command line client.

`./template` folder will contain graphback server template used to initialize project.
`./template/client` contains react application that can be used to contact server

When using `graphback` template will be instantiated as your own project with:

- `/` will contain server side code
- `./client` will contain client side code we created using `create-react-app` 

Please refer to `completed` branch for finished version of this tutorial.

## Introduction

This workshop is focused on deploying a fully functional web application server using

- Node.js Server exposing GraphQL and REST API
- React.js Client PWA application

The workshop is divided into the following sections:

- A) Creating Server side using Graphback client
- B) Reviewing React Based client implementation
- C) Implementing offline support and conflict handling for client and server
- D) Building your first container and provisioning application to OpenShift
- E) Configuring Authentication using MDC

## Prerequisites

- Node.js LTS 10 
- Docker and docker-compose
- Visual Studio Code (or other IDE)

## Workshop Steps

### A) Bulding your first GraphQL server using AeroGear GraphBack

Graphback command line tool (https://graphback.dev) allows developers 
to generate fully functional Node.js based server that will be offering 
GraphQL and RESTfull API out of the box based on developer provided business model.
Graphback generates general data access methods like find, create, delete etc. along with 
live updates called subscriptions.

In this chapter we are going to build a sample Task application that will
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
4. Review the `Task.graphql` file inside `model` with your GraphQL types.
This file was added as part of the template. GraphBack allows you to 
provide your own business logic, but for this example we going use one that
was provided as part of the template. 
We can extend it later as part of the hackaton.

5. Subscriptions are used in GraphQL to enable live updates of information. Graphback can help with subscriptions.
Open `config.json` in the root of the directory and enable the `subCreate` flag.
```
 "subCreate": true,
```
This flag is used to tell graphback that we would like to generate the Subscriptions, particularly when a schema type is created.

6. Run `graphback generate` to generate schema and resolvers

7. Run `docker-compose up -d` to run your database and `graphback db` to create database resources in postgres database.

8. Run `npm run start` to start the server

9. Server will be ready at http://localhost:4000/graphql

10. Server offers the playground as way to interact with its API.
It is loaded with example queries that can be used to access data
through the playground and execute GraphQL queries - createTask, updateTask etc.
Please try to execute some operations directly in the server. 

Playground will also offer documentation for all available operations that we can replicate back to server

### B) Bulding Your first GraphQL Client with React, GraphQL and AeroGear DataSync

Server side template comes with client folder that will contain React.js 
project boilerplate. We have initialized project using create-react-app
and applied following projects

- React.js TypeScript template
- *AeroGear Voyager Client* that will offer *Data Synchronization* and 
*Conflict resolution*.
- *Uniforms* - Library for building GraphQL forms based on GraphQL schema.

#### Steps

1. Navigate to `./client`
2. Install required dependencies for the project
```
npm install 
```
3. Run project
```
npm run start 
```
At this point we should see web application connecting with server and 
using autogenerated api. Create Task operation is still not implemented.
We going to focus on that in the next chapter of the tutorial

### C) [Optional] Implementing Offline support and Conflict resolution in your applications

In this step we can use power of Graphback custom method generator together with the Conflict detection and resolution 
capaibilities of the Voyager framework. We going to create custom GraphQL implementation for server that will ensure data consistency
and then connect it with the client application.

Voyager-server allows out of the box conflict resolution based on implementations - like `version` field marker in model, but for this use case 
we decided to show you how this works under the hood.

1. Navigate to `./model/Task.graphql` and copy the following code: 

```graphql
type Mutation {
  assign(id: ID!, status: String!, version: Int!):Task
}
```

2. Regenerate backend using `graphback generate` 
This will create empty function we can implement in the next step.

3. Go to `src/resolvers/custom/assign.ts`. This file will contain custom 
implementation that we can use to implement task assignment.

4. Copy code from `./tutorial/assign.ts-template` to `assign.ts` file

5. Restart server

6. At this point, we can make requests to the server that will be checked for integrity. 
When we pass an outdated version server will return an error.

7. We can now connect our app with the server.
Go to `client/src/components/AssignTask.tsx`, delete line 6, 7, 8 and uncomment
the code responsible for sending mutation back to the server

8. Now open the application and you should see version changing when 
toggle is pressed.

### D. Deployment to OpenShift

#### Prerequisites

* Create an account on [Dockerhub](https://hub.docker.com/)

An OpenShift template is provided to deploy the backend server on OpenShift.

#### Steps

1. Log in to the Dockerhub Registry

```bash
docker login
```

2. Build the application into a docker image.

```bash
docker build -t <dockerhubusername>/<imagename>:latest . # ex: docker build -t aerogear/graphback-demo:latest .
```

3. Push the image to Dockerhub

```bash
docker push <dockerhubusername>/<imagename>:latest
```

4. Create the OpenShift template in a namespace of your choice

```bash
oc process -f openshift-template.yml --param APPLICATION_IMAGE=<dockerhubusername>/<imagename>:latest | oc create -f -
```

## 4) Creating an Application in The Mobile Developer Console

The Mobile Developer Console (MDC) simplifies and bootstraps mobile application development on OpenShift by making it simple to provision and bind Mobile Services to your Application. Let's create a representation of our Application in the MDC.

1. Go to the MDC URL.
2. Create a new Application in The MDC if you haven't already.

![Create App in MDC](./doc/img/mdc-create-app.png)

Once the application is created, you can click on it to bring you to a new overview page. On the left side, there is some information about how you can get started on using the `aerogear-js-sdk`. On the right side, the `mobile-services.json` is visible. The `mobile-services.json` is a config file generated by the MDC that we drop into our application, enabling integrations with various mobile services such as Identity Management (Keycloak), Metrics, Push, Metrics and Sync.

![Mobile App Overview in MDC](./doc/img/mdc-config-tab.png)

## 4) Binding the Server to Your App Using the Mobile Developer Console

Let's use the MDC to bind to the server deployed in the previous step. This will provide our application with the configuration needed to talk to the server provisioned in OpenShift instead of one running locally.

1. Select your Mobile App from the MDC
2. Click the `Mobile Services` tab. This shows you a list of available services that can be bound to your app.
3. Click the `Bind to App` button on the `Data Sync` service from the list.
4. In the form, provide the public URL for your backend server.

![Binding a Sync Server to Mobile App in MDC](./doc/img/sync-bind-form.png)

5. Once, the sync service is bound, navigate back to the `Configuration` tab in the MDC.
6. You should see that the `mobile-services.json` has been updated.

![mobile-services.json with Sync Config](./doc/img/mobile-services-with-sync.png)

7. Copy the `mobile-services.json` into `client/src/mobile-services.json` in your local project.
8. Restart your client application locally with `npm run start`

You should notice this time when the application restarts that any Task items previously created are gone. This is because our app is now working against the server running in OpenShift. You can double check this by opening the network tab in Chrome Dev Tools (or the dev tools equivalent in other browsers), refreshing the page and inspecting the `graphql` requests being sent.

![Requests in Chrome Dev Tools](./doc/img/dev-tools-server-openshift.png)

## 4) Enabling Auth Service (Keycloak) in the Application.

Let's add a keycloak integration to our react application. We can do this by binding the Identity Management Service from the MDC. When we create a binding for the Identity Management Service, a new Keycloak realm is created specifically for our application and a starter public client is created with some default values that allow logins from web / cordova applications.

1. Go to the `Mobile Services` tab in the MDC.
2. Click the `Bind to App` button on the Identity Management Service.
3. For the form, leave any default values as they are and for the admin username and password, use any values you wish but be sure to remember them. These values will be used to log in to Keycloak to administer the our application's realm.

![Creating a Keycloak Binding in the MDC](./doc/img/keycloak-bind-form.png)

4. Once the service is bound, go back to the `Configuration` tab in the MDC and verify that the `mobile-services.json` has been updated.

![mobile-services.json with sync and keycloak config](./doc/img/mobile-services-complete.png)

7. Copy the `mobile-services.json` into `client/src/mobile-services.json` in your local project.
8. Restart your client application locally with `npm run start`

This time when the application starts, you should be presented with a keycloak login screen. At this point, we need a username/password combination to log in. Let's quickly create one in the MDC.

1. Go to the `Configuration` tab in the MDC.
2. Under the Bound Services section, expand the panel for the Identity Management Service. In there you will find the `Keycloak Realm Url`.
3. Open the URL and log in using the credentials created during the bind step.
4. In the Keycloak Console, select `Users` from the side menu.
5. Click 'Add User'
6. Fill out the username as `developer` and toggle the `Email Verified` option to true.
7. Once the user is created, find the `Credentials` tab and set the user's password and toggle `Temporary` to `Off`.
8. Go back to your application and log in using your new user.

At this point you should see the main screen of the application again. You can also check in Chrome Dev Tools (or the dev tools equivalent in other browsers) that the Keycloak Authorization header is included in the GraphQL requests being sent to the server. This can be used by the server to authenticate the requests when the keycloak integration is set up on the server side.

![Requests in Dev Tools with Keycloak Auth](./doc/img/dev-tools-keycloak-auth.png)

#### How it works

The Application discovered the Keycloak specific config at startup and used it to enable the keycloak integration. This was done using a combination of the `@aerogear/auth` and `react-keycloak` modules.

In `index.tsx` you can see how the root component being passed into `ReactDOM.render` is being wrapped with a function called `withAuth`. You can see how it works by looking at the code in `client/src/services/auth.service.tsx`.

