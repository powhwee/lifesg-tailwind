"use client";

import { Avatar } from "@/components/ui/avatar";
import { Avatar as LifeSGAvatar } from "@lifesg/react-design-system/avatar";
import { HouseIcon } from "@lifesg/react-icons/house";
import { House } from "lucide-react";

const PROFILE_URL =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&q=80&fit=crop&crop=face";

export function OursPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground" data-token="initials-default">
          initials &mdash; default
        </code>
        <div className="mt-2 flex items-end gap-4">
          <Avatar>HC</Avatar>
          <Avatar sizeType="small">HC</Avatar>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="icon">icon</code>
        <div className="mt-2 flex items-end gap-4">
          <Avatar>
            <House size={20} strokeWidth={1.6} />
          </Avatar>
          <Avatar sizeType="small">
            <House size={16} strokeWidth={1.6} />
          </Avatar>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="image">image</code>
        <div className="mt-2 flex items-end gap-4">
          <Avatar>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE_URL} alt="" className="size-full object-cover" />
          </Avatar>
          <Avatar sizeType="small">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE_URL} alt="" className="size-full object-cover" />
          </Avatar>
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground" data-token="initials-default">
          initials &mdash; default
        </code>
        <div className="mt-2 flex items-end gap-4">
          <LifeSGAvatar>HC</LifeSGAvatar>
          <LifeSGAvatar sizeType="small">HC</LifeSGAvatar>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="icon">icon</code>
        <div className="mt-2 flex items-end gap-4">
          <LifeSGAvatar><HouseIcon /></LifeSGAvatar>
          <LifeSGAvatar sizeType="small"><HouseIcon /></LifeSGAvatar>
        </div>
      </section>

      <section>
        <code className="text-xs text-muted-foreground" data-token="image">image</code>
        <div className="mt-2 flex items-end gap-4">
          <LifeSGAvatar>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE_URL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </LifeSGAvatar>
          <LifeSGAvatar sizeType="small">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PROFILE_URL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </LifeSGAvatar>
        </div>
      </section>
    </div>
  );
}
