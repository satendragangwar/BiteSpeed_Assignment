
# Bitespeed Contact Identification Assignment

  

This backend service is designed to identify and consolidate contact information based on email addresses and phone numbers. It efficiently manages contact records, linking secondary contacts to primary ones based on shared identifiers.

## Technologies Used

*  **Backend Framework:** Node.js with Express.js
*  **Language:** TypeScript
*  **ORM (Object-Relational Mapper):** Drizzle ORM
*  **Database:** PostgreSQL (using Neon serverless database)
*  **Hosting:** Render
* 
## Endpoints

### POST /identify/

This endpoint is used to identify or create contacts based on the provided email and/or phone number.

#### Request Body (JSON):

```json

{
"email":  "string (optional, email format)",
"phoneNumber":  "string (optional, phone number format)"
}
```

#### Example cURL Request:

```sh

curl  -X  POST \
-H "Content-Type: application/json" \
-d  '{"email": "test@example.com", "phoneNumber": "1234567890"}' \
https://bitespeed-assignment-0e2a.onrender.com/identify/
```

## Contact Linking Logic

* If both email and phone number exist in the database, they are linked to the same primary contact.
* If only one of them exists, a new secondary contact is created and linked to the primary contact.
* If neither exists, a new primary contact is created.

## Setup & Installation

### Clone the Repository:

```sh
git  clone  https://github.com/yourusername/bitespeed-contact-identification.git
```
```sh
cd  bitespeed-contact-identification
```

### Install Dependencies:

```sh
npm  install
```

### Set Up Environment Variables:

Create a `.env` file in the root directory and add the following:
```env
PORT=your_port_number
DATABASE_URL=your_postgresql_connection_string
```

### Run the Application:
```sh
npm  run  dev
```

## Deployment

This project is deployed on Render. You can test the live API at:
https://bitespeed-assignment-0e2a.onrender.com