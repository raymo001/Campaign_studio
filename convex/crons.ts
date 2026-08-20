import { cronJobs } from "convex/server";

const crons = cronJobs();

// Campaign Studio is intentionally stopped: do not register recurring feed syncs here
// until Convex usage has been reviewed and the deployment is explicitly re-enabled.
export default crons;
