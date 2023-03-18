# sample-sso-auth

This is a simple Node.js web application that demonstrates how to use Google Sign-In for authentication, and how to protect routes using JSON Web Tokens (JWT).

## Getting Started

To run this app, you'll need to set some environment variables. You can do this by creating a .env file in the root directory of the project, and adding the following variables:


- **GOOGLE_CLIENT_ID**: Your Google API client ID. You can obtain this by creating a new project in the Google Cloud Console, enabling the Google Sign-In API, and creating OAuth 2.0 credentials.
- **GOOGLE_CLIENT_SECRET**: Your Google API client secret. This is provided when you create OAuth 2.0 credentials in the Google Cloud Console.
- **GOOGLE_CALLBACK_URL**: The URL that Google should redirect to after a user signs in. This should match the callback URL you specified when creating your OAuth 2.0 credentials.
- **JWT_SECRET**: The secret key used to sign and verify JWTs. If not provided, a default value of my_secret will be used.
- **PORT**: The port that the server will listen on. If not provided, the app will listen on port 3000.
- **HOST**: The HOST that the server will listen on. If not provided, the app will listen on port `127.0.0.1`. For docker usage set `0.0.0.0`


Starting the app:
```sh
npm install
node app.js
```

via docker:
```sh
docker build -t ymuski/sample-sso-auth .

docker run -it --rm -p 3000:3000 -v ${PWD}/.env:/app/.env --name sample-sso-auth ymuski/sample-sso-auth
```

This will start the app on the port specified in your .env file, or port 3000 by default.



## Usage

Open your web browser and navigate to `http://localhost:3000`. You should see a link to "Log in with Google". Click this link to sign in using your Google account. Once you've signed in, you'll be redirected to the `/dashboard` page.

If you're not logged in, you'll be redirected to the home page. If you are logged in, you'll see a welcome message with your name.

To log out, click the "Log out" link in the navigation bar.

## Extra

additional information about creating a Google API client ID:


- Go to the Google Cloud Console. `https://console.cloud.google.com`
- Enable the Google+ API.
- Create a new project or select an existing project from the dropdown in the top navigation bar.
In the left navigation menu, click on "APIs & Services" and then click on "Credentials".
- Click the "Create Credentials" button and select "OAuth client ID".
- Select "Web application" as the application type. 
- In the "Authorized redirect URIs" section, add the callback URL for your application (e.g. `http://127.0.0.1:3000/callback`) to the list of authorized redirect URIs.
- Click "Create" to create your OAuth 2.0 credentials.
Your client ID and client secret will be displayed on the next screen. Copy these values and add them to your .env file as GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, respectively.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
