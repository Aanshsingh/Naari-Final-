const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Client Vercel
  "https://naari-final.vercel.app",

  // Admin Vercel
  "https://naari-admin.vercel.app",

  // Custom domain
  "https://naariethnicbyprerna.com",
  "https://www.naariethnicbyprerna.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Vercel preview deployments
      const isNaariClientPreview =
        /^https:\/\/naari-final(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

      const isNaariAdminPreview =
        /^https:\/\/naari-admin(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

      if (isNaariClientPreview || isNaariAdminPreview) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);