import express from "express";
import {
  getallhistoryVideo,
  handlehistory,
  handleview,
  handleyoutubehistory,
} from "../controllers/history.js";
 
const routes = express.Router();
routes.post("/views/:videoId", handleview);
// ✅ New: YouTube history route
routes.post("/youtube", handleyoutubehistory);
routes.post("/:videoId", handlehistory);
routes.get("/:userId", getallhistoryVideo);
export default routes;
 