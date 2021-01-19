# Running development environment

To get started with the development environment, first run the following command in root directory of the project:

```npm install```

Change directory to ./client and run `npm install` again.

## To use with GCP

In the config.yaml file, set speech property to google.

You will need to set up a service account with Google Cloud, the instructions can be found [here](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries).

After setting the service account you will need to download your key and set an environment variable so the Google client libraries can use it.

```export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"```, PATH is the location of your service account key. This is a JSON file

## To use with Azure

In the config.yaml file, set speech property to azure.

You will need to set up an account with Azure. Then you will need to enable the Microsoft speech service from the marketplace. After that put your location and key into the location and key property of config.yaml under the azure property. Note neural voices are only supported for Speech resources created in East US, South East Asia, and West Europe regions.

Now you can run `npm run dev` in the project root to start the server and `npm start` in ./client to start the client

# Build for production

First change directory to the client folder and run:

```npm run build```

This will create a production version of the client. This is what will be served by the server.

Then change directory back to the project root and run:

```gcloud app deploy --stop-previous-version```
