import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col w-1/2 justify-center gap-2">
          <h1>Planeringsbasen</h1>
          <Input placeholder="Canvas ID" />
          <h2>TimeEdit Länk</h2>
          <Input placeholder="TimeEdit Länk" />
        </div>
      </div>
    </>
  );
}
