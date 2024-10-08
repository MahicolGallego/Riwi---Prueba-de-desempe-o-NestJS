<p align="center">
  <img src="https://educowebmedia.blob.core.windows.net/educowebmedia/educospain/media/images/blog/que-son-los-esports-portada.jpg" width="70%" />
</p>

# Riwi Nest JS Performance Test

## Description

Api for the project eSport Arena

## Running the Project

### Prerequisites

Before running the NestJS project, ensure you have the following installed on your system:

- **Node.js**:

  - Version: v14.x or higher (recommended: LTS version)
  - Download from: [Node.js Official Website](https://nodejs.org/)

- **npm (Node Package Manager)**:

  - npm comes bundled with Node.js.

- **Git**:

  - For version control and repository management.
  - Install Git from: [Git Official Website](https://git-scm.com/)

- **Postman or cURL** (optional):

  - For testing API endpoints easily.
  - Download Postman from: [Postman Official Website](https://www.postman.com/)

### Create Database

Create a PostgreSQL database with a service provider. You can use the same one utilized in the project's creation: Aiven Cloud [Aiven Cloud](https://aiven.io/).

With the provided connection URI, set up your environment variables:

- Based on the `.env.template` file found in the root of the project, create a `.env` file in the root directory of the project.
- Copy and paste the content of `.env.template` into the newly created `.env` file.

- Assign the appropriate values according to the URI or variables provided by your selected service provider.

# Project Setup

### Open Terminal in Project Directory

## Install Dependencies

To install the project dependencies, run the following command:

```bash
npm i
```

## Run the Project

To start the project in development mode, use:

```bash
npm run start:dev
```

## The API is running correctly, you can now interact with it

## License

[MIT licensed](LICENSE).
