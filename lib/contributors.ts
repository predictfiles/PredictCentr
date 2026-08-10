import type { Contributor } from "./types";
import contributorsRaw from "@/data/contributors.json";

// Add a new contributor by appending an entry to data/contributors.json --
// no code changes needed, same "just add data" pattern as trending.json.
export const contributors = contributorsRaw as Contributor[];
