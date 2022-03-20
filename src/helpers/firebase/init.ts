import admin from 'firebase-admin';

var serviceAccount = require('../../../three-musketeers-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
