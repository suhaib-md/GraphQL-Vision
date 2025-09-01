export const MOCK_SCHEMA = {
  "data": {
    "__schema": {
      "queryType": { "name": "Query" },
      "mutationType": null,
      "subscriptionType": null,
      "types": [
        {
          "kind": "OBJECT",
          "name": "Query",
          "description": "The root query type.",
          "fields": [
            {
              "name": "users",
              "type": { "kind": "LIST", "ofType": { "name": "User" } },
              "args": []
            },
            {
              "name": "user",
              "type": { "name": "User" },
              "args": [{ "name": "id", "type": { "kind": "NON_NULL", "ofType": { "name": "ID" } } }]
            }
          ]
        },
        {
          "kind": "OBJECT",
          "name": "User",
          "description": "Represents a user of the application",
          "fields": [
            { "name": "id", "type": { "kind": "NON_NULL", "ofType": { "name": "ID" } } },
            { "name": "name", "type": { "kind": "NON_NULL", "ofType": { "name": "String" } } },
            { "name": "email", "type": { "kind": "NON_NULL", "ofType": { "name": "String" } } },
            { "name": "status", "type": { "name": "UserStatus" } },
            { "name": "posts", "type": { "kind": "LIST", "ofType": { "name": "Post" } } }
          ]
        },
        {
          "kind": "OBJECT",
          "name": "Post",
          "description": "A post written by a user.",
          "fields": [
            { "name": "id", "type": { "kind": "NON_NULL", "ofType": { "name": "ID" } } },
            { "name": "title", "type": { "kind": "NON_NULL", "ofType": { "name": "String" } } },
            { "name": "content", "type": { "name": "String" } }
          ]
        },
        {
          "kind": "ENUM",
          "name": "UserStatus",
          "description": "The status of a user.",
          "enumValues": [
            { "name": "ACTIVE" },
            { "name": "INACTIVE" },
            { "name": "PENDING" }
          ]
        },
        { "kind": "SCALAR", "name": "String" },
        { "kind": "SCALAR", "name": "ID" },
        { "kind": "SCALAR", "name": "Boolean" }
      ]
    }
  }
};

export const MOCK_QUERY = `
query GetUsersWithPosts {
  users {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
`.trim();

export const MOCK_RESPONSE = {
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "posts": [
          { "id": "101", "title": "First Post about GraphQL" },
          { "id": "102", "title": "GraphQL is Fun and Powerful" }
        ]
      },
      {
        "id": "2",
        "name": "Bob Williams",
        "email": "bob@example.com",
        "posts": [
          { "id": "103", "title": "Hello World in APIs" }
        ]
      },
      {
        "id": "3",
        "name": "Charlie Brown",
        "email": "charlie@example.com",
        "posts": []
      }
    ]
  }
};
