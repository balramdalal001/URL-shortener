import { RequestHandler } from "express";
import { createUrlSchema, ShortCodeParams } from "./url.schema";
import { resolveUrl, shortenUrl, shortUrl , getAllUrlDetails} from "./url.service";

export const createShortUrl: RequestHandler = async (req, res, next) => {
  try {
    const input = createUrlSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ error: input.error.flatten() });
      return;
    }

    const record = await shortenUrl(input.data.url);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const redirectToOriginal: RequestHandler<ShortCodeParams> = async (req, res, next) => {
  try {
    const record = await resolveUrl(req.params.code);
    if (!record?.originalUrl) {
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    res.redirect(record.originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getOriginalUrlDetails: RequestHandler<ShortCodeParams> = async (req, res, next) => {
  try {
    const record = await resolveUrl(req.params.code);
    if (!record?.originalUrl) {
      res.status(404).json({ error: "URL not found" });
      return;
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const getAllUrls: RequestHandler = async (req, res, next) => {
  try {
    const record = await getAllUrlDetails();
    if (!record) {
      res.status(404).json({ error: "URL not found" });
      return;
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};
