import { ApiError } from "../utils/ApiError.js";

// Usage: router.delete("/:id", verifyJWT, AuthorizeRoles("admin"), deleteUser)
export const AuthorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You are not allowed to access this resource");
    }
    next();
  };
};