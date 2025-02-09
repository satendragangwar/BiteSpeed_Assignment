
# Bitespeed Contact Identification Assignment

This backend service is designed to identify and consolidate contact information based on email addresses and phone numbers. It efficiently manages contact records, linking secondary contacts to primary ones based on shared identifiers.

## Technologies Used

-  **Backend Framework:**  [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
-  **Language:**  [TypeScript](https://www.typescriptlang.org/)
-  **ORM (Object-Relational Mapper):**  [Drizzle ORM](https://orm.drizzle.team/)
-  **Database:**  [PostgreSQL](https://www.postgresql.org/) (using [Neon](https://neon.tech/) serverless database)
-  **Hosting:**  [Render](https://render.com/)

## Endpoints
### `POST /identify/`
This endpoint is used to identify or create contacts based on the provided email and/or phone number.

#### Request Body (JSON):

```json
{
"email":  "string (optional, email format)",
"phoneNumber":  "string (optional, phone number format)"
}

curl -X POST \\
-H "Content-Type: application/json" \\
-d '{"email":  "test@example.com",  "phoneNumber":  "1234567890"}'
https://bitespeed-assignment-0e2a.onrender.com/identify/

```

## Technologies Used

If both email and phone number exist in the database, they are linked to the same primary contact.
If only one of them exists, a new secondary contact is created and linked to the primary.
If neither exists, a new primary contact is created.

## Setup & Installation

* Clone the repository:
```json
  git clone https://github.com/yourusername/bitespeed-contact-identification.git
```
```json
cd bitespeed-contact-identification
```
* Install dependencies:
```json
npm install
```

## Set up environment variables in a .env file:
```json
POST =
DATABASE_URL=your_postgresql_connection_string
```
## Run the application:
```json
npm run dev
```

##  Deployment
This project is deployed on Render. You can test the live API at: https://bitespeed-assignment-0e2a.onrender.com