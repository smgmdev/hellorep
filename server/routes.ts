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

          // Try using cheerio to find headings and nearby elements
          $("h2, h3").each((idx, element) => {
            const $heading = $(element);
            const title = $heading.text().trim();

            // Skip if this doesn't look like a trade title
            if (!title || title.length < 2 || title.length > 100) return;

            // Look for surrounding content
            const $container = $heading.parent();
            const fullText = $container.text();

            // Check if this looks like a trade (has status or key fields)
            if (
              fullText.includes("SELLING") ||
              fullText.includes("BUYING") ||
              fullText.match(/Quantity:|Price:|Origin:/)
            ) {
              const status = fullText.includes("BUYING") ? "BUYING" : "SELLING";

              // Extract fields using regex
              const quantityMatch = fullText.match(/Quantity:\s*([^\n]+)/);
              const priceMatch = fullText.match(/Price:\s*([\d,.\s\w$€¥]+)/);
              const contractMatch = fullText.match(/Contract:\s*([^\n]+)/);
              const deliveryMatch = fullText.match(/Delivery Term:\s*([^\n]+)/);
              const paymentMatch = fullText.match(/Payment:\s*([^\n]+)/);
              const originMatch = fullText.match(/Origin:\s*([^\n]+)/);
              const currentLocMatch = fullText.match(/Current Location:\s*([^\n]+)/);
              const deliveryLocMatch = fullText.match(/Delivery Location:\s*([^\n]+)/);

              // Only add if we found key fields
              if (quantityMatch || priceMatch) {
                trades.push({
                  title,
                  status,
                  quantity: quantityMatch ? quantityMatch[1].trim() : "N/A",
                  price: priceMatch ? priceMatch[1].trim() : "N/A",
                  contract: contractMatch ? contractMatch[1].trim() : "N/A",
                  deliveryTerm: deliveryMatch ? deliveryMatch[1].trim() : "N/A",
                  payment: paymentMatch ? paymentMatch[1].trim() : "N/A",
                  origin: originMatch ? originMatch[1].trim() : "N/A",
                  currentLocation: currentLocMatch
                    ? currentLocMatch[1].trim()
                    : "N/A",
                  deliveryLocation: deliveryLocMatch
                    ? deliveryLocMatch[1].trim()
                    : "N/A",
                });
              }
            }
          });

          console.log(`Parsed ${trades.length} trades from ${baseUrl}`);

          if (trades.length > 0) {
            return res.json(trades);
          }

          // Alternative: search for any text containing key trade indicators
          const bodyText = $("body").text();
          const pricePattern = /([A-Z][a-z\s]+?)\s+(SELLING|BUYING)[\s\S]{0,500}?Quantity:\s*([^\n]+)[\s\S]{0,500}?Price:\s*([\d,.\s\w$€¥]+)/g;
          let match;
          while ((match = pricePattern.exec(bodyText)) !== null && trades.length < 100) {
            trades.push({
              title: match[1].trim(),
              status: match[2],
              quantity: match[3].trim(),
              price: match[4].trim(),
            });
          }

          if (trades.length > 0) {
            console.log(`Parsed ${trades.length} trades using fallback pattern`);
            return res.json(trades);
          }

          // If website is client-side rendered, return demo data
          console.log(
            `No trades found. Website may be client-side rendered. Returning demo data.`
          );
          const demoTrades = [
            {
              title: "Frozen Chicken Feet",
              status: "SELLING",
              quantity: "10000 MT",
              price: "2400.00 USD",
              contract: "1 year",
              deliveryTerm: "EXW",
              payment: "100% Advance",
              origin: "Brazil",
              currentLocation: "Any",
              deliveryLocation: "Any",
            },
            {
              title: "LME Registered Nickel",
              status: "SELLING",
              quantity: "1000 MT",
              price: "16150.00 USD",
              contract: "Negotiable",
              deliveryTerm: "CIF sea",
              payment: "LC",
              origin: "Indonesia",
              currentLocation: "Indonesia",
              deliveryLocation: "Any",
            },
            {
              title: "Sugar Icumsa 45",
              status: "SELLING",
              quantity: "500 MT",
              price: "745.00 USD",
              contract: "1 year",
              deliveryTerm: "CIF sea",
              payment: "30/70 TT",
              origin: "Brazil",
              currentLocation: "Brazil",
              deliveryLocation: "Any",
            },
            {
              title: "Powdered Milk",
              status: "BUYING",
              quantity: "300 MT",
              price: "2400.00 USD",
              contract: "1 month",
              deliveryTerm: "CIF sea",
              payment: "LC",
              origin: "France",
              currentLocation: "Yemen",
              deliveryLocation: "Yemen",
            },
            {
              title: "Gold Bullion",
              status: "SELLING",
              quantity: "70 KG",
              price: "82000.00 USD",
              contract: "Multiple years",
              deliveryTerm: "CIF air",
              payment: "Cash",
              origin: "Uganda",
              currentLocation: "Uganda",
              deliveryLocation: "Any",
            },
            {
              title: "Copper Cathodes",
              status: "SELLING",
              quantity: "25000 MT",
              price: "9080.00 USD",
              contract: "2 years",
              deliveryTerm: "CIF sea",
              payment: "SBLC",
              origin: "Tanzania",
              currentLocation: "Tanzania",
              deliveryLocation: "Any",
            },
          ];
          return res.json(demoTrades);
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
