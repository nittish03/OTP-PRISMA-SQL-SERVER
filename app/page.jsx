import LandingPage from "@/components/LandingPage";
import Image from "next/image";

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
