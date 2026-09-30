# College Sports Team and Match Management System

## Project Description

A REST API backend for managing college sports teams, players, fixtures, and match results.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Thunder Client

## Main Features

### Authentication
- User registration
- User login
- JWT authentication
- Role-based authorization

### Player Management
- Create player
- View players
- View player by ID
- Update player
- Delete player

### Team Management
- Create team
- View teams
- Add players to teams
- Prevent a player from joining two teams of the same sport

### Match Management
- Create match
- View matches
- View individual match
- Update match
- Delete match
- Record match result
- Completed match stores the winning team

### Authorization

Sports coordinators can:
- Create matches
- Update matches
- Delete matches
- Record match results

Authenticated users can:
- View teams
- View players
- View matches
- View team fixtures and results

## API Base URL

http://localhost:5001

## API Routes

### Authentication

POST `/api/auth/register`

POST `/api/auth/login`

### Players

GET `/api/players`

GET `/api/players/:id`

POST `/api/players`

PUT `/api/players/:id`

DELETE `/api/players/:id`

### Teams

GET `/api/teams`

POST `/api/teams`

POST `/api/teams/:id/players`

GET `/api/teams/:id/matches`

### Matches

GET `/api/matches`

GET `/api/matches/:id`

POST `/api/matches`

PUT `/api/matches/:id`

PATCH `/api/matches/:id/result`

DELETE `/api/matches/:id`

## Database

MongoDB Atlas is used as the database.

The application uses the following collections:

- Users
- Players
- Teams
- Matches

## Running the Project

Install dependencies:

```bash
npm install