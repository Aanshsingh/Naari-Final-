import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.Routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import bannerRouter from "./routes/banner.routes.js"
import reviewRouter from "./routes/review.routes.js"
import contactRouter from "./routes/contact.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js"

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// MUST come before express.json() — webhook needs the raw, unparsed body
// to verify Razorpay's signature correctly
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Naari is running");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/testimonials", testimonialRouter);

// must be the LAST app.use() call — Express only treats a 4-argument
// middleware as an error handler, and only after every route above has run
app.use(errorHandler);

export { app };