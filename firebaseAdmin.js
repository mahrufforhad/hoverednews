const { initializeApp } = require('firebase-admin/app');
const serviceAccount = require('./secrets.json');

export const verifyIDToken = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
}