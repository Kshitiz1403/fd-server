const { initializeApp } = require('firebase-admin/app');
var admin = require("firebase-admin");
const { auth } = require('firebase-admin');

var serviceAccount = require("./firebasePrivateKey.json");

initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = auth