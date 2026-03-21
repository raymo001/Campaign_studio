import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "sync vanpella product feed",
  { minutes: 30 },
  internal.feed.internalSyncProducts,
  {},
);

export default crons;
