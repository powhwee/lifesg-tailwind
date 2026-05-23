"use client";

import { useState } from "react";
import { DateNavigator } from "@/components/ui/date-navigator";
import { DateNavigator as LifeSGDateNavigator } from "@lifesg/react-design-system/date-navigator";

export function OursPane() {
  const [day, setDay] = useState<string>("2026-05-12");
  const [week, setWeek] = useState<string>("2026-05-12");
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">day view, with calendar dropdown</code>
        <div className="mt-3" data-token="day-view">
          <DateNavigator
            selectedDate={day}
            view="day"
            showCurrentDateAsToday
            onLeftArrowClick={setDay}
            onRightArrowClick={setDay}
            onCalendarDateSelect={setDay}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">week view, short form</code>
        <div className="mt-3" data-token="week-view">
          <DateNavigator
            selectedDate={week}
            view="week"
            showDateAsShortForm
            onLeftArrowClick={setWeek}
            onRightArrowClick={setWeek}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with min/max bounds</code>
        <div className="mt-3" data-token="min-max">
          <DateNavigator
            selectedDate={day}
            view="day"
            minDate="2026-05-01"
            maxDate="2026-05-31"
            onLeftArrowClick={setDay}
            onRightArrowClick={setDay}
          />
        </div>
      </section>
    </div>
  );
}

export function LifeSGPane() {
  const [day, setDay] = useState<string>("2026-05-12");
  const [week, setWeek] = useState<string>("2026-05-12");
  return (
    <div className="flex flex-col gap-8">
      <section>
        <code className="text-xs text-muted-foreground">day view, with calendar dropdown</code>
        <div className="mt-3" data-token="day-view">
          <LifeSGDateNavigator
            selectedDate={day}
            view="day"
            showCurrentDateAsToday
            onLeftArrowClick={setDay}
            onRightArrowClick={setDay}
            onCalendarDateSelect={setDay}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">week view, short form</code>
        <div className="mt-3" data-token="week-view">
          <LifeSGDateNavigator
            selectedDate={week}
            view="week"
            showDateAsShortForm
            onLeftArrowClick={setWeek}
            onRightArrowClick={setWeek}
          />
        </div>
      </section>
      <section>
        <code className="text-xs text-muted-foreground">with min/max bounds</code>
        <div className="mt-3" data-token="min-max">
          <LifeSGDateNavigator
            selectedDate={day}
            view="day"
            minDate="2026-05-01"
            maxDate="2026-05-31"
            onLeftArrowClick={setDay}
            onRightArrowClick={setDay}
          />
        </div>
      </section>
    </div>
  );
}
