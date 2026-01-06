"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScheduleEvent } from "./domain/ScheduleEvent";
import { CanvasService } from "./Service/CanvasService";

export default function Home() {
  const [timeEditLink, setTimeEditLink] = useState("");
  const [timeEditData, setTimeEditData] = useState<any>(null);
  const [canvasToken, setCanvasToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [debugLoading, setDebugLoading] = useState(false);

  const handleGetUserID = async () => {
    try {
      setDebugLoading(true);
      setError(null);
      const response = await fetch("/api/canvas/userid");
      if (!response.ok) {
        throw new Error("Failed to get user ID");
      }
      const data = await response.json();
      setUserID(data.userID);
      console.log("User ID:", data.userID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get user ID");
      console.error("Error getting user ID:", err);
    } finally {
      setDebugLoading(false);
    }
  };

  const handleSetTimeEditLink = async () => {
    if (!timeEditLink) {
      setError("Please enter a TimeEdit link");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCanvasToken(canvasToken);

      // Replace .html with .json
      const jsonUrl = timeEditLink.replace(/\.html$/, ".json");

      // Fetch the JSON data
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const jsonData = await response.json();
      setTimeEditData(jsonData);

      const timeEditEvents: ScheduleEvent[] =
        jsonData.reservations?.map((reservation: any) => ({
          contextCode: String(userID),
          title: reservation.columns[0],
          description: reservation.columns[8],
          start_at: new Date(
            `${reservation.startdate}T${reservation.starttime}`
          ),
          end_at: new Date(`${reservation.enddate}T${reservation.endtime}`),
          location_name: reservation.columns[1],
          all_day: false,
        })) || [];

      const canvasService = new CanvasService();
      for (const event of timeEditEvents) {
        await canvasService.createCalenderEvent(event);
      }

      console.log("TimeEdit Events:", timeEditEvents);
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
          <Input
            placeholder="Canvas Token"
            value={canvasToken}
            onChange={(e) => setCanvasToken(e.target.value)}
          />
          <h2>TimeEdit Länk</h2>
          <Input
            placeholder="TimeEdit Länk"
            value={timeEditLink}
            onChange={(e) => setTimeEditLink(e.target.value)}
          />
          <Button onClick={handleSetTimeEditLink} disabled={loading}>
            {loading ? "Laddar..." : "Skicka!"}
          </Button>
          <Button
            onClick={handleGetUserID}
            disabled={debugLoading}
            variant="outline"
          >
            {debugLoading ? "Laddar..." : "Debug: Get User ID"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {userID && (
            <div className="mt-2">
              <p className="text-blue-500">User ID: {userID}</p>
            </div>
          )}
          {timeEditData && (
            <div className="mt-4">
              <p className="text-green-500">Data loaded successfully!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
