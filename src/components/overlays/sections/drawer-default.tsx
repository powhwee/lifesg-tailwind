"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function OursPane() {
  const [openR, setOpenR] = useState(false);
  const [openL, setOpenL] = useState(false);
  const [openB, setOpenB] = useState(false);
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">side=&quot;right&quot; (default)</code>
        <div className="mt-3">
          <Drawer open={openR} onOpenChange={setOpenR}>
            <Button variant="secondary" size="sm" onClick={() => setOpenR(true)}>
              Open right drawer
            </Button>
            <DrawerContent side="right">
              <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="p-4">
                <p className="text-sm">
                  Drawer body content. <kbd className="text-xs">Esc</kbd> or click outside to dismiss.
                  Focus is trapped inside while open.
                </p>
              </DrawerBody>
              <DrawerFooter>
                <Button onClick={() => setOpenR(false)}>Save</Button>
                <Button variant="ghost" onClick={() => setOpenR(false)}>
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">side=&quot;left&quot;</code>
        <div className="mt-3">
          <Drawer open={openL} onOpenChange={setOpenL}>
            <Button variant="secondary" size="sm" onClick={() => setOpenL(true)}>
              Open left drawer
            </Button>
            <DrawerContent side="left">
              <DrawerHeader>
                <DrawerTitle>Navigation</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="p-4">
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="block px-2 py-1 rounded hover:bg-lifesg-bg-hover">Home</a></li>
                  <li><a href="#" className="block px-2 py-1 rounded hover:bg-lifesg-bg-hover">Profile</a></li>
                  <li><a href="#" className="block px-2 py-1 rounded hover:bg-lifesg-bg-hover">Settings</a></li>
                </ul>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground">side=&quot;bottom&quot; — sheet</code>
        <div className="mt-3">
          <Drawer open={openB} onOpenChange={setOpenB}>
            <Button variant="secondary" size="sm" onClick={() => setOpenB(true)}>
              Open bottom sheet
            </Button>
            <DrawerContent side="bottom" className="rounded-t-lg">
              <DrawerHeader>
                <DrawerTitle>Pick an option</DrawerTitle>
              </DrawerHeader>
              <DrawerBody className="p-4">
                <p className="text-sm">
                  Bottom sheets are common on mobile for quick choices.
                </p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-10 max-w-md" data-token="default">
      <section>
        <code className="text-xs text-muted-foreground">LifeSG ships no standalone Drawer</code>
        <div className="mt-3 rounded-md border border-lifesg-border p-4 bg-lifesg-bg-strong text-sm space-y-2">
          <p>
            LifeSG <code>Drawer</code> is a <strong>private internal</strong> used by Sidenav and
            Navbar — not a public component. There&rsquo;s nothing to render here as the LifeSG
            reference.
          </p>
          <p>
            For comparison, the LifeSG Sidenav&rsquo;s panel and Navbar&rsquo;s mobile menu both
            render their drawer logic inline. We extracted it as a primitive because it serves
            two consumers in our DS already (Navbar mobile menu) and is a natural building block
            for filter sheets, settings panels, etc.
          </p>
        </div>
      </section>
    </div>
  );
}
