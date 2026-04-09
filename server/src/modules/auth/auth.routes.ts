import { Router } from "express";
import { login, me } from "./auth.controller";
import { authenticate, validate } from "../../shared/middleware";
import { loginSchema } from "./auth.validator";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
