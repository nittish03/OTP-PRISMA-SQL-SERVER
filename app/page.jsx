import LandingPage from "@/components/LandingPage";
import Image from "next/image";
import ChatBot from "@/components/ChatBot";
import Warning from "@/components/Warning";

export default function Home() {
  return (
<>
<div className="w-full bg-black">
<LandingPage/>
<ChatBot/>
<Warning/>
</div>
</>
  );
}
