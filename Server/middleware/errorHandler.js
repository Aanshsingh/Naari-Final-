// middleware/errorHandler.js
import {ApiError} from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // anything NOT thrown as your custom ApiError — a genuinely unexpected bug.
  // Log the real thing server-side so you can actually debug it...
  console.error("UNHANDLED ERROR:", err);

  // ...but never leak stack traces or internals to the client in the response itself
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;