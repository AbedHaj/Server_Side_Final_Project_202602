# Cost Management API Course Project

Course: Node.Js Server-Side Development

This repository contains the server-side implementation of a cost-management REST API used for coursework. The code is organized as four small, single-purpose HTTP services that together provide user management, cost entry, reporting and administrative logging.


## Table of contents

- [Purpose and learning objectives](#purpose-and-learning-objectives)
- [Project layout](#project-layout)
- [Deployment Render](#deployment-render)
- [API reference](#api-reference)
- [Data model summary](#data-model-summary)
- [Testing](#testing)
- [Authors](#authors)


## Purpose and learning objectives

This project demonstrates the following competencies:

- Designing focused HTTP services using Express and Mongoose
- Defining and enforcing data models with Mongoose schemas
- Implementing idempotent endpoints and consistent JSON error responses
- Persisting application-level logs to the database
- Producing reproducible test cases for functional verification


## Project layout

```
Server_Side_Final_Project_202602/
├── server_admin.js
├── server_users.js
├── server_costs.js
├── server_dev.js
├── logger.js
├── test.http
├── models/
│   ├── users.js
│   ├── costs.js
│   ├── reports.js
│   └── logs.js
├── routes/
│   ├── admin_api.js
│   ├── users_api.js
│   ├── costs_api.js
│   └── dev_api.js
└── tests/
    ├── run_tests.py
    └── test_endpoints.py
```


## Deployment Render

The services are deployed to Render and available at:

- Admin: https://server-side-final-project-202602-admin.onrender.com
- Users: https://server-side-final-project-202602-users.onrender.com
- Costs: https://server-side-final-project-202602-costs.onrender.com
- Dev: https://server-side-final-project-202602-dev.onrender.com

Each service exposes its API under the `/api` path.


## API reference

All endpoints return JSON and use standard HTTP status codes.

Admin
- GET `/api/logs` — returns array of log documents (200)

Users
- POST `/api/add` — create a new user (201) or error (400)
- GET `/api/users` — return all users (200)
- GET `/api/users/:id` — return user profile with total spending (200 or 404)

Costs
- POST `/api/add` — add a cost entry (201) or error (400)
  - Valid categories: food, education, health, housing, sports
- GET `/api/report?id=<userid>&year=<year>&month=<month>` — return monthly report (200)

Dev
- GET `/api/about` — return team information (200)


## Data model summary

Mongoose schemas:

- `users`: id (Number), first_name (String), last_name (String), birthday (Date), total (Number)
- `costs`: description (String), category (String), userid (Number), sum (Number)
- `reports`: userid (Number), year (Number), month (Number), costs (object with category arrays)
- `logs`: logging documents


## Testing

Run tests on deployed services:

```powershell
python tests/run_tests.py
 py -m unittest discover tests 
```


## Authors

- Abed Haj Yahia
- Lior Mizrachi
