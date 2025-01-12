import express from 'express';
import morgan from 'morgan';
import CryptoJS from 'crypto-js';
import bodyParser from 'body-parser';

const { initializeApp } = require('firebase-admin/app');

require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


export {app, appFirebase};