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

npm run build

### add environment variables

see example.env