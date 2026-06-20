"use client";

import { useState } from "react";
import { Headset, Phone, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const contacts = [
  { name: "Olamide", role: "Support Contact 1", phone: "+234 801 234 5678", email: "olamide@fofikd.org" },
  { name: "Adetutu", role: "Support Contact 2", phone: "+234 802 345 6789", email: "adetutu@fofikd.org" },
];

export function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Support contacts"
          className="fixed z-40 bottom-20 right-4 lg:bottom-8 lg:right-8 inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:bg-primary/90 active:scale-95 transition rounded-full p-4 sm:px-6 sm:py-4 ring-4 ring-primary/20 animate-pulse"
        >
          <Headset className="w-6 h-6" />
          <span className="hidden sm:inline font-semibold text-base">Support</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Support contacts</SheetTitle>
          <SheetDescription>Reach out to any of the support team below for help.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {contacts.map((c) => (
            <div key={c.name} className="card-soft p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold text-lg">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" /> {c.phone}
                </a>
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" /> {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
