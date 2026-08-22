import { tool } from "ai";
import { z } from "zod";

export const destinationTool = tool({
  description:
    "Get travel information about a destination. Use this when the user asks about a city, country, landmark, or travel destination.",

  inputSchema: z.object({
    destination: z
      .string()
      .min(2)
      .describe("The name of the city, country, or destination"),

    reason: z
      .string()
      .optional()
      .describe("Why the user is interested in this destination"),
  }),

  execute: async ({ destination, reason }) => {
    // Simulated server-side destination lookup.
    // Replace this with your real database/API later.

    if (
      destination.toLowerCase().includes("invalid") ||
      destination.toLowerCase().includes("unknown")
    ) {
      throw new Error(
        "Destination information could not be found."
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    return {
      destination,
      country: getCountry(destination),
      description: getDescription(destination),
      bestFor: getBestFor(destination),
      stampDifficulty: "Easy",
      recommendedDays: 3,
      reason: reason ?? null,
    };
  },
});

function getCountry(destination: string): string {
  const normalized = destination.toLowerCase();

  if (normalized.includes("tokyo")) {
    return "Japan";
  }

  if (normalized.includes("paris")) {
    return "France";
  }

  if (normalized.includes("london")) {
    return "United Kingdom";
  }

  if (normalized.includes("hyderabad")) {
    return "India";
  }

  if (normalized.includes("vizag")) {
    return "India";
  }

  if (normalized.includes("visakhapatnam")) {
    return "India";
  }

  return "Unknown";
}

function getDescription(destination: string): string {
  return `${destination} is a destination worth adding to your StampQuest travel passport. Explore local culture, food, landmarks, and experiences while collecting your digital stamp.`;
}

function getBestFor(destination: string): string[] {
  const normalized = destination.toLowerCase();

  if (
    normalized.includes("tokyo") ||
    normalized.includes("japan")
  ) {
    return [
      "Culture",
      "Food",
      "Technology",
      "City exploration",
    ];
  }

  if (
    normalized.includes("vizag") ||
    normalized.includes("visakhapatnam")
  ) {
    return [
      "Beaches",
      "Nature",
      "Food",
      "Weekend trips",
    ];
  }

  return [
    "Sightseeing",
    "Culture",
    "Food",
    "Photography",
  ];
}
