"use client";

import { useState } from "react";
import { Headset, Phone, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const contacts = [
  { name: "Olamide", role: "Support Lead", phone: "+234 801 234 5678", email: "olamide@fofikd.org" },
  { name: "Adetutu", role: "Support Coordinator", phone: "+234 802 345 6789", email: "adetutu@fofikd.org" },
];

export function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Support contacts"
          className="fixed z-40 bottom-20 right-4 lg:bottom-8 lg:right-8 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 active:scale-95 transition rounded-full p-3.5 sm:px-5 sm:py-3"
        >
          <Headset className="w-5 h-5" />
          <span className="hidden sm:inline font-semibold text-sm">Support</span>
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
