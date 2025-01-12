"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appFirebase = exports.app = void 0;
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const app_1 = require("firebase/app");
const app = (0, express_1.default)();
exports.app = app;
// Middlewares
app.use(express_1.default.json());
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
const appFirebase = (0, app_1.initializeApp)(firebaseConfig);
exports.appFirebase = appFirebase;
