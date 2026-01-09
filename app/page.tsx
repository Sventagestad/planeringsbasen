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
  const [previewEvents, setPreviewEvents] = useState<any>("");
  const [sendData, setSendData] = useState("");

  const handleGetUserID = async () => {
    try {
      setDebugLoading(true);
      setError(null);
      //const response = await fetch("/api/canvas/userid");
      const response = await fetch("/api/canvas/userid", {
        headers: {
          Authorization: `Bearer ${canvasToken}`,
        },
      });
      //if (!response.ko) {
      //  throw new Error("Failed to get user ID");
      //}
      const data = await response.json();
      setUserID(data.userID);
      console.log("User ID:", data.userID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get user ID");
      // console.error("Error getting user ID:", err);
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
      console.log(canvasToken);

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

      const events: ScheduleEvent[] =
        jsonData.reservations?.map((response: any) => ({
          title: response.comlumns?.[0] ?? "(Ingen Titel)",
          start_at: new Date(`${response.start_at}`),
          end_at: new Date(`${response.end_at}`),
          location: response.location_name ?? "",
          description: response.description ?? "",
        })) ?? [];

      setPreviewEvents(timeEditEvents);

      //flytta här så att koden inte postar direkt utan endast previewar sen en ny knapp för skicka!
      //Stänger av tills vidare för debugging

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
  const handleSendData = async () => {
    const canvasService = new CanvasService();
    for (const event of getTimeEditEvents().map((event: any) => ({
      title: event.title,
      description: event.description,
      start_at: event.start_at,
      end_at: event.end_at,
      location_name: event.location_name,
    }))) {
      await canvasService.createCalenderEvent(event);
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
            {loading ? "Laddar..." : "Ladda in data"}
          </Button>
          <Button
            onClick={handleGetUserID}
            disabled={debugLoading}
            variant="outline"
          >
            {debugLoading ? "Laddar..." : "GetUserID"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {userID && (
            <div className="mt-2">
              <p className="text-blue-500">User ID: {userID}</p>
            </div>
          )}

          <div>
            <h1>Preview på timeedit data</h1>
            <table className={"preview-TimeEdit"}>
              <thead>
                <tr className="text-left">
                  <th className="p-2">Aktivitet</th>
                  <th className="p-2">Start</th>
                  <th className="p-2">Slut</th>
                  <th className="p-2">Plats</th>
                  <th className="p-2">Beskrivning</th>
                  <th className="p-2">Heldag?</th>
                </tr>
              </thead>

              <tbody>
                {previewEvents.length === 0 ? (
                  <tr>
                    <td className="p-2" colSpan={6}>
                      ingen data hittades
                    </td>
                  </tr>
                ) : (
                  previewEvents.map(
                    (
                      ev: {
                        title: string;
                        start_at: Date | string;
                        end_at: Date | string;
                        location_name: string;
                        description: string;
                        all_day: boolean;
                      },
                      idx: number
                    ) => {
                      const start = ev.start_at ? new Date(ev.start_at) : null;
                      const end = ev.end_at ? new Date(ev.end_at) : null;

                      const key = `event-${idx}`;

                      const startime =
                        start && !Number.isNaN(start.getTime())
                          ? start.toLocaleString()
                          : "—";

                      const endtime =
                        end && !Number.isNaN(end.getTime())
                          ? end.toLocaleString()
                          : "—";

                      return (
                        <tr key={key} className="border-t">
                          <td className="p-2">
                            <Input
                              value={ev.title}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                updated[idx] = {
                                  ...updated[idx],
                                  title: e.target.value,
                                };
                                setPreviewEvents(updated);
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={startime}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                const newDate = new Date(e.target.value);
                                if (!Number.isNaN(newDate.getTime())) {
                                  updated[idx] = {
                                    ...updated[idx],
                                    start_at: newDate,
                                  };
                                  setPreviewEvents(updated);
                                }
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={endtime}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                const newDate = new Date(e.target.value);
                                if (!Number.isNaN(newDate.getTime())) {
                                  updated[idx] = {
                                    ...updated[idx],
                                    end_at: newDate,
                                  };
                                  setPreviewEvents(updated);
                                }
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={ev.location_name || ""}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                updated[idx] = {
                                  ...updated[idx],
                                  location_name: e.target.value,
                                };
                                setPreviewEvents(updated);
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={ev.description || ""}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                updated[idx] = {
                                  ...updated[idx],
                                  description: e.target.value,
                                };
                                setPreviewEvents(updated);
                              }}
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="checkbox"
                              checked={ev.all_day || false}
                              onChange={(e) => {
                                const updated = [...previewEvents];
                                updated[idx] = {
                                  ...updated[idx],
                                  all_day: e.target.checked,
                                };
                                setPreviewEvents(updated);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
          <Button onClick={handleSendData} disabled={loading}>
            Skicka in till canvas
          </Button>
        </div>
      </div>
    </>
  );
}
