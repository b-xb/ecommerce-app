

## Timezone settings

This codebase is setup to work with the node environement and postgres environment both having their timezones set to 'UTC'

### Set node timezone to UTC

add the following line to the `.env` file at the base of the project

```
TZ = 'UTC'
```

### Set postgres to UTC

in postgresql.conf make sure the variable `timezone` is set to `UTC`, as follows

```
timezone = 'UTC'
```

## Test suite notes

Filter running the test scripts

```
npm run test -- --grep "<string to match in test description>"
```

e.g. run only tests at the API path /api/v1/users

```
npm run test -- --grep "/api/v1/users"
```