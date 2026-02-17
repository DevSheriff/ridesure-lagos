const STORAGE_KEY = "ridesure_voted_pins";

function getVotedPins(): Record<string, "up" | "down"> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function hasVoted(pinId: string): "up" | "down" | null {
  return getVotedPins()[pinId] || null;
}

export function recordVote(pinId: string, direction: "up" | "down") {
  const voted = getVotedPins();
  voted[pinId] = direction;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(voted));
}
