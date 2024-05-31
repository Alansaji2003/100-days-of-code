# United Transit Services

UTS in Node backend
# About the website

A taxi service startup for the disabled and elderly people, with volunteers guiding you the entire journey. Made as part of EPICS project at VIT Bhopal University

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Mongo DB Atlas Cluster](https://www.mongodb.com/products/platform/atlas-database)

## Getting Started

1. **Clone the Repository:**

   ```bash
   cd your-project/
   git clone https://github.com/EPICS-UTS/UTS.git
   cd UTS/
   

2. **Install Dependencies:** 
    ```bash
    npm install
3. **Add config.js inside 'public/js/' and write the following** 
    ```bash
    const myToken = 'yourTokenFromMapBox';
    const mongoDBUrl = "yourAtlasConnectionString";
    export { myToken, mongoDBUrl };

4. **Make a .env  file put these information**

    ```bash
    GOOGLE_CLIENT_ID="yourGoogleClientID"
    GOOGLE_CLIENT_SECRET="YOURGOOGLECLIENTSECRET"
    SESSION_SECRET="ANYTEXT"

5. **Run the Project:**

    ```bash
    node server.js
Your application should now be running. Open your web browser and visit http://localhost:3000 (or the specified URL if different).