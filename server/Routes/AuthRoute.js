import express from "express";
import { loginUser, registerUser } from "../Controllers/AuthController.js";

const router = express.Router()

router.post('/register', registerUser)           // using post to send data for the server(route, function)
router.post('/login', loginUser)

export default router