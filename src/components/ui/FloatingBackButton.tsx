
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function FloatingBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Do not show on the root landing page, product listing, or checkout
  if (pathname === '/' || pathname === '/deliverypage' || pathname === '/checkout') {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 z-50">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </Button>
    </div>
  );
}

    