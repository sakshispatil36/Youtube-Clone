
import express from "express";
import {
  handlelike,
  getallLikedVideo,
  handleyoutubelike,
} from "../controllers/like.js";
 
const routes = express.Router();
 
// ✅ IMPORTANT: /youtube route must come BEFORE /:videoId route
// otherwise Express matches "/youtube" as videoId="youtube" and breaks
routes.post("/youtube", handleyoutubelike);
 
routes.get("/:userId", getallLikedVideo);
routes.post("/:videoId", handlelike);
 
export default routes;