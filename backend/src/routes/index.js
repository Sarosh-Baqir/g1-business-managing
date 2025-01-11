import express from "express";
import userRoutes from "./user.routes.js";
import serviceRoutes from "./service.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import supportTicketRoutes from "./support.ticket.routes.js";
import conversationRoutes from "./conversation.routes.js";
import messageRoutes from "./message.routes.js";
import adminRoutes from "./admin.routes.js";
import categoryRoutes from "./category.routes.js";

// import addressRoute from "./address.routes.js"

const router = express.Router();

router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/support-tickets", supportTicketRoutes);
router.use("/conversation", conversationRoutes);
router.use("/message", messageRoutes);
router.use("/admin", adminRoutes);
router.use("/category", categoryRoutes);

export default router;
