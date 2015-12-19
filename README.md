# address-db

## Data
#### User Class

Key | Value | Description
------------ | ------------- | ------------
id | uuid  | unique id
email | string  | email address - will be used as username
createdAt | dateTime  | created at value
firstName | string  | first name
lastName | string  | last name
addresses | object  | key/value map -> addressId: true
events | object  | key/value map -> eventId: true

#### Address Class

Key | Value | Description
------------ | ------------- | ------------
id | uuid  | unique id
createdAt | dateTime  | created at value
owner | uuid  | the owner's id
anonymous | bool | some addresses might not have an owner associated with them
name | string | address name (e.g. "The Ski Chalet")
address1 | string  | first line of address
address2 | string  | second line of address
city | string  | city
state | string  | state
postalCode | string  | zip code or postal code
country | string  | country name
users | object  | key/value map -> userId: true
events | object  | key/value map -> eventId: true

#### Event Class

Key | Value | Description
------------ | ------------- | ------------
id | uuid  | unique id
owner | uuid  | the owner's id
name | string | event name
message | string | message to be sent to invited parties
createdAt | dateTime  | created at value
expires | dateTime  | expiration
emailList |object| key/value map -> email: true
addresses | object  | key/value map -> addressId: true
users | object  | key/value map -> userId: true

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## App Structure
This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.