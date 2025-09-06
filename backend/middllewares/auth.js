import { catchAsyncError } from "./catchAsyncError.js";
import { User } from "../models/user.js";

import ErrorHandler from "../middllewares/error.js";
import jwt from "jsonwebtoken";

 export const isAuthorizedUser = catchAsyncError(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("User not authorized - token missing", 401));
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === 'null' || token === 'undefined') {
    return next(new ErrorHandler("User not authorized - invalid token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
});


// export const isAuthorizedUser = catchAsyncError(async (req, res, next) => {
//   const token = req.get("Authorization");
//   console.log("auth " + req.get("Authorization"));

//   jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
//     if (err) {
//       /*
//         err = {
//           name: 'JsonWebTokenError',
//           message: 'jwt malformed'
//         }
//       */
//       console.log("jwt  " + err);
//     }
//   });

//   if (!token) {
//     return next(new ErrorHandler("User not authorized", 400));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (error) {
//     // Handle JWT verification errors
//     return next(new ErrorHandler("Invalid token", 400));
//   }
// });
