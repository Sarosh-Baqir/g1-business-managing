import express from "express";
import userRoutes from "./user.routes.js";
import serviceRoutes from "./service.routes.js";
import orderRoutes from "./order.routes.js";
import reviewRoutes from "./review.routes.js";
import supportTicketRoutes from "./support.ticket.routes.js";
// import addressRoute from "./address.routes.js"

const router = express.Router();

router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/support-tickets", supportTicketRoutes);

export default router;
