# Deploy to Render

## set up database

### create database project


### connect to database from psql client in your local terminal

1. click on info tab

2. scroll down to connections

3. copy the "PSQL Command"

4. open your terminal at the base of the project folder

5. paste the "PSQL Command" into your terminal


### setting the timezone

The timezone should already be set to UTC

you can check this setting by typing the following from the psql client

```
SELECT * FROM pg_timezone_names WHERE abbrev = current_setting('TIMEZONE');
```

### initialising the database

to run the database setup script from psql type the following

```
\i ./models/db-setup.sql
```

### loading data into the database

to populate your database with data for testing you can import data using the following the command

```
\copy products FROM './mocks/products.csv' delimiter ',' NULL AS 'NULL' csv header
```

In this example the data is being imported from a csv file in the mocks folder (used for testing)


## set up application

### create web service

Create a new web service instance by clicking on.

```
New -> Web Service
```

Fill in the form as you wish, noting the following...

*Region:*

This should match the region setting for your database

*Repository:*

This should match the following format

`https://github.com/b-xb/ecommerce-app`

You can deploy from this repository but I would recommend creating your own fork and deploying from that instead.

*Branch:*

This can be any branch you want.

Note, however, that by default any new commit pushed to this branch will be deployed

*Root Directory:*

leave this blank

*Build Command*

If you want to build the frontend on the server set this to

`npm run build`

Otherwise, if you'd prefer to pre-build the frontend on the client side before pushing it to the server set this to

`npm install`

*Start Command*

`npm run start`

### add environment variables

see example.env