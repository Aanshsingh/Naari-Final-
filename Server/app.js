import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.Routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import bannerRouter from "./routes/banner.routes.js";
import reviewRouter from "./routes/review.routes.js";
import contactRouter from "./routes/contact.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import instagramPostRouter from "./routes/instagramPost.routes.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Vercel
  "https://naari-final.vercel.app",

  // Custom domain
  "https://naariethnicbyprerna.com",
  "https://www.naariethnicbyprerna.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        /^https:\/\/naari-final(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Reject everything else
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

// Stripe/payment webhook needs raw body
app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).send("Naari is running");
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/products", productRouter);

app.use("/api/v1/orders", orderRouter);

app.use("/api/v1/payments", paymentRouter);

app.use("/api/v1/banners", bannerRouter);

app.use("/api/v1/reviews", reviewRouter);

app.use("/api/v1/contact", contactRouter);

app.use("/api/v1/testimonials", testimonialRouter);

app.use("/api/v1/instagram-posts", instagramPostRouter);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export { app };