import express from "express";
import {
  getallwatchlater,
  handlewatchlater,
  handleyoutubewatchlater,
} from "../controllers/watchlater.js";
 
const routes = express.Router();
// ✅ New: YouTube watch later route
routes.post("/youtube", handleyoutubewatchlater);
routes.post("/:videoId", handlewatchlater);
routes.get("/:userId", getallwatchlater);
export default routes;
 