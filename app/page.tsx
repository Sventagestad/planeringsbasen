"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [timeEditLink, setTimeEditLink] = useState("");
  const [timeEditData, setTimeEditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetTimeEditLink = async () => {
    if (!timeEditLink) {
      setError("Please enter a TimeEdit link");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Replace .html with .json
      const jsonUrl = timeEditLink.replace(/\.html$/, ".json");

      // Fetch the JSON data
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const jsonData = await response.json();
      setTimeEditData(jsonData);
      console.log("TimeEdit data:", jsonData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch JSON data"
      );
      console.error("Error fetching TimeEdit data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col w-1/2 justify-center gap-2">
          <h1>Planeringsbasen</h1>
          <Input placeholder="Canvas ID" />
          <h2>TimeEdit Länk</h2>
          <Input
            placeholder="TimeEdit Länk"
            value={timeEditLink}
            onChange={(e) => setTimeEditLink(e.target.value)}
          />
          <Button onClick={handleSetTimeEditLink} disabled={loading}>
            {loading ? "Laddar..." : "Skicka!"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {timeEditData && (
            <div className="mt-4">
              <p className="text-green-500">Data loaded successfully!</p>
              {/* You can display or use timeEditData here */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
