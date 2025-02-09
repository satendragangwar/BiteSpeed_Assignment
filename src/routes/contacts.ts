import express, { Router } from "express";
import { identifyContact } from "../controllers/contacts";
import { validateIdentifyRequest } from "../middleware/validation";

const router: Router = express.Router();

router.post("/", validateIdentifyRequest, identifyContact);

export default router;
