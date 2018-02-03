# Reaktor Summer 2018 Backend

Back end for the project. It uses [Serverless](https://serverless.com/) and [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

### Problems

I really regret using DynamoDB for this. This app requires sorting of the entries in the database, and since DynamoDB doesn't really have a good way to sort entries, I have to do it serverside with javascript which isn't ideal. DynamoDB isn't bad, but a relational database would have been a better choice for this project.