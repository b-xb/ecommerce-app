## Demo

Try out a demo of this app at https://ecommerce-demo.bencrosbie.me.uk/

## Setup

### Installation of Server and Client dependencies

1. Install Node or NVM

2. If using nvm, you can type the following to match the node version used in development

```
nvm install
nvm use
```

3. Install Server dependencies

```
npm install
```

4. Install Client dependencies

```
cd view
npm install
```

### Database Setup

Create a database, schema and database user with access to this schema using your favourite PostgreSQL interface

You can optionally seperate schema for testing purposes.

Do note however, that, any data present in the test schema will be erased whenever the server test script is run.

Use the file in `models/db-setup.sql` to set up the required database tables and relationships for each schema.

And then store the login information in a .env file at the base of the project. See `.env.example` for an example.

### Timezone settings

This codebase is setup to work with the node environement and postgres environment both having their timezones set to 'UTC'.

Thus, in order for it to work correctly, both the postgres database and node environment must be set to UTC in order to work.

#### Set node timezone to UTC

Add the following line to the `.env` file at the base of the project

```
TZ = 'UTC'
```

#### Set PostgreSQL to UTC

In postgresql.conf make sure the variable `timezone` is set to `UTC`, as follows. The location of this file will vary depending on your PostgreSQL setup.

```
timezone = 'UTC'
```

### Add a Session Secret Key

Another variable that needs to be added to the `.env` file is the Session Secret.

This variable is used for enabling secure session authentication between a logged in user and the application.

This variable should be set to a long string of characters that cannot be guessed by a malicious user.

In production, it is wise to alter this value on a regular basis. Note, however, that whenever this variable is changed all users will be forced to log in again in.

## Run a development Server

To run the application in development mode, run the following in this order.

1. Start up the PostgreSQL database server (if not already running)

2. Start up the development server

From the base of the project run the following from the terminal

```
npm start

```
3. Start up the client in development mode

In a separate terminal window, switch to the view sub-directory and then run

```
npm start

```

## Testing

### Server

Before running the server tests, make sure your PostgreSQL database server is running.

Then, from the base of the project type the following to run all the tests

```
npm test
```

#### Filtering tests

Tests can be filtered so that only certain tests are run, as follows...

```
npm test -- --grep "<string to match in test description>"
```

e.g. run only tests at the API path /api/v1/users

```
npm test -- --grep "/api/v1/users"
```

### Client

From the view sub-directory, run the following

```
npm test
```


## Notes

### How to switch to the view sub-directory


To switch to the view sub-directory, type the following from the base of the project

```
cd view
```

You can check you are in the right folder by running the following command

```
pwd
```
