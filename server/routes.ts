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
          const $ = cheerio.load(html);
          const trades: any[] = [];

          // Parse trade cards from the HTML
          // Look for trade article sections
          $("article").each((idx, element) => {
            const $article = $(element);
            
            // Extract trade information
            const title = $article.find("h2, h3").text().trim() || `Trade ${idx + 1}`;
            const status = $article.text().includes("BUYING")
              ? "BUYING"
              : "SELLING";
            
            // Extract category - look for elements that might contain category
            const category = $article
              .find("[data-testid*='category'], .category, .type")
              .text()
              .trim();

            // Extract details from text
            const text = $article.text();
            const quantity =
              text.match(/Quantity:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const price = text.match(/Price:\s*([\d,.\s\w]+)/)?.[1]?.trim() || "N/A";
            const contract =
              text.match(/Contract:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const delivery =
              text.match(/Delivery Term:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const payment =
              text.match(/Payment:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const origin = text.match(/Origin:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const currentLocation =
              text.match(/Current Location:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
            const deliveryLocation =
              text.match(/Delivery Location:\s*([^\n]+)/)?.[1]?.trim() || "N/A";

            trades.push({
              title,
              status,
              category: category || "Commodities",
              quantity,
              price,
              contract,
              deliveryTerm: delivery,
              payment,
              origin,
              currentLocation,
              deliveryLocation,
            });
          });

          if (trades.length > 0) {
            return res.json(trades);
          }

          // Alternative: try to extract from Live Trade Quotes section
          const liveQuotes: any[] = [];
          $("h3").each((idx, element) => {
            const text = $(element).text().trim();
            const parentText = $(element).parent().text();
            
            if (
              text.length > 0 &&
              (text.match(/\d+/g) || parentText.includes("USD") || parentText.includes("EUR"))
            ) {
              const quantity =
                parentText.match(/Quantity:\s*([^\n]+)/)?.[1]?.trim() || "N/A";
              const price = parentText
                .match(/([\d,]+\s*[A-Z]{3})/)?.[1]
                ?.trim() || "N/A";

              if (price !== "N/A") {
                liveQuotes.push({
                  title: text,
                  price,
                  quantity,
                  status: parentText.includes("Sell") ? "BUYING" : "SELLING",
                });
              }
            }
          });

          if (liveQuotes.length > 0) {
            return res.json(liveQuotes);
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
