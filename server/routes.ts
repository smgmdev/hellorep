import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Fetch trade deals from external website
  app.post("/api/fetch-trades", async (req, res) => {
    try {
      const { baseUrl } = req.body;
      if (!baseUrl) {
        return res.status(400).json({ error: "baseUrl required" });
      }

      let dataArray: any[] = [];

      // Try multiple endpoints
      const endpoints = [
        `${baseUrl}/api/deals`,
        `${baseUrl}/api/trade-deals`,
        `${baseUrl}/api/trades`,
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result) && result.length > 0) {
              dataArray = result;
              break;
            }
            if (result.deals && Array.isArray(result.deals)) {
              dataArray = result.deals;
              break;
            }
            if (result.data && Array.isArray(result.data)) {
              dataArray = result.data;
              break;
            }
            if (result.trades && Array.isArray(result.trades)) {
              dataArray = result.trades;
              break;
            }
          }
        } catch (err) {
          // Continue to next endpoint
        }
      }

      if (dataArray.length > 0) {
        return res.json(dataArray);
      }

      // Try main page fetch
      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          const text = await response.text();
          // Try to extract JSON from the page
          const jsonMatch =
            text.match(/window\.__DATA__\s*=\s*({[\s\S]*?});/) ||
            text.match(/<script[^>]*>([\s\S]*?"deals"[\s\S]*?)<\/script>/i) ||
            text.match(/<script[^>]*>([\s\S]*?"trades"[\s\S]*?)<\/script>/i);

          if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const data = JSON.parse(jsonStr);
            if (data.deals && Array.isArray(data.deals)) {
              return res.json(data.deals);
            }
            if (data.trades && Array.isArray(data.trades)) {
              return res.json(data.trades);
            }
            if (data.data && Array.isArray(data.data)) {
              return res.json(data.data);
            }
            if (Array.isArray(data)) {
              return res.json(data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse trade data:", err);
      }

      res.status(404).json({ error: "Could not fetch trade deals" });
    } catch (err) {
      console.error("Trade fetch error:", err);
      res
        .status(500)
        .json({
          error: err instanceof Error ? err.message : "Server error",
        });
    }
  });

  return httpServer;
}
