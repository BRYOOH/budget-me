import { Button } from "@/components/ui/button";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Props={
    href:string;
    label:string;
    isActive?:boolean;
};

export default function NavButton({href,label,isActive}:Props) {
  return (
    <Button asChild
    size="sm"
    variant='outline'
    className={twMerge("w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",isActive ? "bg-white/10 text-white" :"bg-transparent")}>
      <Link href={href} className="text-base">
      {label}
      </Link>
    </Button>
  )
}
