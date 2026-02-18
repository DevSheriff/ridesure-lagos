import { RouteData } from "@/lib/routing";
import { ArrowLeft, ArrowRight, ArrowUp, CornerDownLeft, CornerDownRight, Navigation2, Clock, MapPin as MapPinIcon } from "lucide-react";

interface TurnByTurnProps {
  route: RouteData;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function getStepIcon(type: string, modifier?: string) {
  if (type === "turn" && modifier?.includes("left")) return <CornerDownLeft className="w-4 h-4 text-blue-500" />;
  if (type === "turn" && modifier?.includes("right")) return <CornerDownRight className="w-4 h-4 text-blue-500" />;
  if (modifier?.includes("left")) return <ArrowLeft className="w-4 h-4 text-blue-500" />;
  if (modifier?.includes("right")) return <ArrowRight className="w-4 h-4 text-blue-500" />;
  if (type === "arrive") return <MapPinIcon className="w-4 h-4 text-green-500" />;
  return <ArrowUp className="w-4 h-4 text-blue-500" />;
}

function humanizeInstruction(type: string, modifier?: string): string {
  if (type === "depart") return "Start riding";
  if (type === "arrive") return "You have arrived";
  if (type === "turn" && modifier) return `Turn ${modifier}`;
  if (type === "new name") return "Continue straight";
  if (type === "end of road" && modifier) return `At end of road, turn ${modifier}`;
  if (type === "fork" && modifier) return `Take the ${modifier} fork`;
  if (type === "roundabout" && modifier) return `At roundabout, take ${modifier} exit`;
  if (modifier) return `${type} ${modifier}`;
  return type;
}

const TurnByTurn = ({ route }: TurnByTurnProps) => {
  const meaningfulSteps = route.steps.filter(s => s.distance > 5 || s.maneuver.type === "arrive");

  return (
    <div className="glass-panel rounded-2xl p-4 animate-slide-up w-full max-w-sm max-h-48 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        <Navigation2 className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-semibold text-foreground">Route Directions</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatDuration(route.duration)} · {formatDistance(route.distance)}
        </span>
      </div>
      <div className="space-y-1.5">
        {meaningfulSteps.map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <div className="mt-0.5 flex-shrink-0">{getStepIcon(step.maneuver.type, step.maneuver.modifier)}</div>
            <div className="flex-1">
              <span className="text-foreground">{humanizeInstruction(step.maneuver.type, step.maneuver.modifier)}</span>
              {step.distance > 0 && (
                <span className="text-muted-foreground ml-1">({formatDistance(step.distance)})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnByTurn;
