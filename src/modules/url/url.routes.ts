import express from "express";
import { createShortUrl, redirectToOriginal , getOriginalUrlDetails,getAllUrls} from "./url.controller";
import { authenticateJWT  } from "../../middleware/auth";
export const urlRouter = express.Router();

urlRouter.post("/v1/urls", authenticateJWT, createShortUrl);
urlRouter.get("/v1/urls/:code",authenticateJWT, redirectToOriginal);
urlRouter.get("/v1/geturls/:code", authenticateJWT, getOriginalUrlDetails);
urlRouter.get("/v1/getAllurls", authenticateJWT, getAllUrls);
