# Hapi Node.js API Project

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  <!-- - [Running the Application](#running-the-application) -->
  <!-- - [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license) -->

## Introduction

This project demonstrates how to create a RESTful API using Hapi.js with Node.js. The API supports basic CRUD operations and includes authentication using JWT (JSON Web Tokens).

## Features

- **Hapi.js Framework**: Robust and scalable web framework for building APIs.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **CRUD Operations**: Basic Create, Read, Update, and Delete functionalities.
- **Error Handling**: Graceful error handling using Boom.
- **Data Validation**: Request payload validation using Joi.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node package manager is installed with Node.js.

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/khoido2003/Hapi-Nodejs.git
   ```
2. **Install Dependencies**:

   ```sh
   npm install
   ```

3. **Start the Project**:
   ```sh
   npm run start
   ```

## Configuration

Before running the application, you need to set up the configuration variables. Create a `.env` file in the root directory of the project and add the following variables:

```env
   NODE_ENV=''

  HAPI_PORT=''
  HAPI_HOST=''

  MONGODB_URI=''

  JWT_SECRET=''
  JWT_EXPIRES_IN=''
  JWT_COOKIE_EXPIRES_IN=''
```

## Technologies Used

- [Hapi](https://hapi.dev/)
- [Nodejs](https://nodejs.org)
