import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function signup() {
  return (
    <div className="min-h-screen flex flex-row-reverse">
      <div className="h-full flex flex-1 flex-col items-center justify-center px-4 py-2">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2447]">Welcome new Customer!! </h1>
          <p className="text-base text-[#7E8CA0]"> Create an account to access your Dashboard</p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp path="/signup"/>
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground"/>
          </ClerkLoading>
        </div>
      </div>
      <div className="bg-blue-700 flex-1 min-h-full hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" alt="Logo" height={200} width={200}/>
      </div>
    </div>
  
)
}
