import { Notification } from "../models/notification.model.js";

// Controller nahi hai — ek reusable helper jo connection/message/booking
// controllers se call hota hai jab bhi koi notification-worthy event ho.
export const createNotification = async ({
  user,
  type,
  message,
  relatedId,
  relatedModel,
}) => {
  try {
    await Notification.create({ user, type, message, relatedId, relatedModel });
  } catch (error) {
    console.log("Error creating notification:", error.message);
  }
};