import express from 'express';// Import express from express module

import cors from "cors";

import cookieParser from 'cookie-parser';

const app=express();// Create an express app

export{app}//export the app to use in other files like index.js