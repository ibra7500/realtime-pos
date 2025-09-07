import { DarkmodeToggle } from "@/components/common/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-semibold">Welcome</h1>
        <Link href="/admin">
            <Button className="bg-teal-500 text-white">Access to Dashboard</Button>
        </Link>
    </div>
  );
}
