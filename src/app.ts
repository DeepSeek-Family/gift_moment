import express, { Request, Response } from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { Morgan } from "./shared/morgan";
import router from "./app/routes";
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import session from "express-session";
import handleStripeWebhook from "./helpers/handleStripeWebhook";
import requestIp from "request-ip";
import { limiter } from "./rate-limit/rate-limit";
const app = express();


// rate limit

// app.use(requestIp.mw());
// app.use(limiter);

//! stripe
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// CORS must come before routes
const corsOptions = {
  origin: ["http://10.10.7.44:5173", "http://localhost:5173", "http://147.93.94.210:9990", "http://31.97.211.94:5173","http://147.93.94.210:9991"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));
app.use(express.static("public"));

// Session middleware (must be before passport initialization)
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Secure should be true in production with HTTPS
}));


//router
app.use('/api/v1', router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hey Backend, How can I assist you ");
})

//global error handle
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST"
      }
    ]
  })
});

export default app;