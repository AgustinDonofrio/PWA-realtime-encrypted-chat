import { Router } from "express";
import * as usersController from "../controllers/users_controller";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ code: 200, message: "Server is running!" });
});

router.post("/create", usersController.createUser);

export default router;
