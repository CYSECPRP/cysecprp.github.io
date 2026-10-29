import { useSyncExternalStore } from "react";
import { site } from "../content/site";

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.location.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const stamp = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.location.timeZone,
  dateStyle: "full",
  timeStyle: "long",
});

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 5000);
  return () => window.clearInterval(id);
}

const getTime = () => clock.format(new Date());

export const useLocalTime = () =>
  useSyncExternalStore(subscribe, getTime, () => "--:--");

export const formatLocalDate = (date: Date) => stamp.format(date);
