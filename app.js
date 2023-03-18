const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

// Your Google API credentials
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_uri = process.env.GOOGLE_CALLBACK_URL || `http://${host}:${port}/callback`;

// Check ENV vars are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET ) {
  console.error('Please set the GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET environment variables.');
  process.exit(1);
}

// Create an OAuth2 client with your credentials
const client = new OAuth2Client(client_id, client_secret, redirect_uri);

// Secret key used to sign and verify JWTs
const jwtSecret = process.env.JWT_SECRET || 'my_jwt_secret';

// Use cookie-parser middleware to parse cookies in the HTTP request headers
app.use(cookieParser());

// Homepage redirects to Google login page
app.get('/', (req, res) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email']
  });
  const loggedIn = !!req.cookies.token;
  res.send(`
    <html>
      <head>
        <title>Login with Google</title>
      </head>
      <body>
        <h1>Login with Google</h1>
        ${loggedIn ? '<a href="/logout">Logout</a>' : `<a href="${url}">Login with Google</a>`}
      </body>
    </html>
  `);
});

// After the user logs in to Google, Google redirects them here with a code
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  // Exchange the code for access and ID tokens
  const {tokens} = await client.getToken(code);

  // Verify the ID token to get the user's profile
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: client_id,
  });
  const profile = ticket.getPayload();

  // Create a JWT token with the user's profile
  const token = jwt.sign(profile, jwtSecret);

  // Set the token as an HTTP-only cookie and redirect to the dashboard
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/dashboard');

  // Log that the user has logged in
  console.log(`User logged in: ${profile.name}`);
});

// Dashboard page requires a valid JWT token
app.get('/dashboard', (req, res) => {
  // Retrieve the JWT token from the request cookies
  const token = req.cookies.token;

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, jwtSecret);

    // Send a welcome message with the user's name
    res.send(`
      <html>
        <head>
          <title>Dashboard</title>
        </head>
        <body>
          <h1>Dashboard</h1>
          <p>Welcome, ${decoded.name}!</p>
          <p>This Page is availiable only for authorized users</p>
          <a href="/logout">Logout</a>
        </body>
      </html>
    `);
  } catch (err) {
    // Return a 401 Unauthorized status code if the token is invalid or has expired
    res.status(401).send('Unauthorized');
  }
});

// Logout clears the token cookie and redirects to the homepage
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Start the server
const server = app.listen(port, host, () => {
  console.log(`App listening at http://${host}:${port}`);
});

// Handle SIGINT and SIGTERM gracefully
process.on('SIGINT', () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
  });
});