import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as cheerio from "cheerio";

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

      // Try multiple API endpoints first
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

      // Try main page fetch and parse HTML
      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          const html = await response.text();
          const trades: any[] = [];

          // Split by trade blocks - look for patterns like "# Title" followed by SELLING/BUYING
          const lines = html.split("\n");
          let currentTrade: any = null;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Match trade title (lines starting with # like "# Frozen Chicken Feet")
            const titleMatch = line.match(/^#+\s+(.+)$/);
            if (titleMatch) {
              // Save previous trade if exists
              if (
                currentTrade &&
                currentTrade.title &&
                (currentTrade.price || currentTrade.quantity)
              ) {
                trades.push(currentTrade);
              }
              currentTrade = { title: titleMatch[1].trim() };
              continue;
            }

            // Match status (SELLING, BUYING)
            if (line === "SELLING" || line === "BUYING") {
              if (currentTrade) {
                currentTrade.status = line;
              }
              continue;
            }

            // Match category
            const categoryMatch = line.match(
              /^(Carbon Credits|Agriculture|Metals|Energy|EV|Chemicals|Construction|Defense|Medical & PPE|Meats & Livestock|Pharmaceuticals|Seafood|Softs|Office Supplies|Water|Delicacy Foods|Alcoholic Beverage|Skincare & Personal Care)$/
            );
            if (categoryMatch && currentTrade) {
              currentTrade.category = categoryMatch[1];
              continue;
            }

            // Extract fields
            if (currentTrade) {
              const quantityMatch = line.match(/Quantity:\s*(.+)/);
              if (quantityMatch) currentTrade.quantity = quantityMatch[1].trim();

              const contractMatch = line.match(/Contract:\s*(.+)/);
              if (contractMatch) currentTrade.contract = contractMatch[1].trim();

              const deliveryMatch = line.match(/Delivery Term:\s*(.+)/);
              if (deliveryMatch)
                currentTrade.deliveryTerm = deliveryMatch[1].trim();

              const currentLocMatch = line.match(/Current Location:\s*(.+)/);
              if (currentLocMatch)
                currentTrade.currentLocation =
                  currentLocMatch[1].trim();

              const deliveryLocMatch = line.match(/Delivery Location:\s*(.+)/);
              if (deliveryLocMatch)
                currentTrade.deliveryLocation = deliveryLocMatch[1].trim();

              const paymentMatch = line.match(/Payment:\s*(.+)/);
              if (paymentMatch) currentTrade.payment = paymentMatch[1].trim();

              const originMatch = line.match(/Origin:\s*(.+)/);
              if (originMatch) currentTrade.origin = originMatch[1].trim();

              const priceMatch = line.match(/Price:\s*(.+)/);
              if (priceMatch) currentTrade.price = priceMatch[1].trim();
            }
          }

          // Add last trade
          if (
            currentTrade &&
            currentTrade.title &&
            (currentTrade.price || currentTrade.quantity)
          ) {
            trades.push(currentTrade);
          }

          if (trades.length > 0) {
            return res.json(trades);
          }

          res.status(404).json({
            error: "Could not parse trade deals from the website",
          });
        } else {
          res
            .status(502)
            .json({ error: "Could not fetch the website" });
        }
      } catch (err) {
        console.error("Failed to fetch/parse trade data:", err);
        res
          .status(500)
          .json({
            error:
              err instanceof Error
                ? err.message
                : "Failed to parse trade deals",
          });
      }
    } catch (err) {
      console.error("Trade fetch error:", err);
      res.status(500).json({
        error: err instanceof Error ? err.message : "Server error",
      });
    }
  });

  return httpServer;
}
