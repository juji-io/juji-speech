Running development environment
1. npm install in the root directory
2. cd into ./client and npm install
3. Follow the instructions https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries to set up a service account
4. export GOOGLE_APPLICATION_CREDENTIALS="[PATH]", PATH is the location of your service account key. This is a JSON file
5. npm run dev in the root folder to start the server
6. npm start in the client folder to start the client

Build for production
1. cd into client
2. npm run build
3. cd to root
4. gcloud app deploy --stop-previous-version
