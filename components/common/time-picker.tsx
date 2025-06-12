import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  time: { hours: number; minutes: number };
  onChange: (time: { hours: number; minutes: number }) => void;
  format24?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  time,
  onChange,
  format24 = true,
}) => {
  const incrementHours = () => {
    const maxHours = format24 ? 23 : 12;
    const newHours =
      time.hours === maxHours ? (format24 ? 0 : 1) : time.hours + 1;
    onChange({ ...time, hours: newHours });
  };

  const decrementHours = () => {
    const maxHours = format24 ? 23 : 12;
    const minHours = format24 ? 0 : 1;
    const newHours = time.hours === minHours ? maxHours : time.hours - 1;
    onChange({ ...time, hours: newHours });
  };

  const incrementMinutes = () => {
    const newMinutes = time.minutes === 59 ? 0 : time.minutes + 1;
    onChange({ ...time, minutes: newMinutes });
  };

  const decrementMinutes = () => {
    const newMinutes = time.minutes === 0 ? 59 : time.minutes - 1;
    onChange({ ...time, minutes: newMinutes });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const maxHours = format24 ? 23 : 12;
    const minHours = format24 ? 0 : 1;

    if (value >= minHours && value <= maxHours) {
      onChange({ ...time, hours: value });
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= 59) {
      onChange({ ...time, minutes: value });
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="flex flex-col items-center space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Hours
        </Label>
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="outline"
            size="sm"
            onClick={incrementHours}
            className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={time.hours.toString().padStart(2, "0")}
            onChange={handleHoursChange}
            className="w-16 text-center font-mono text-lg"
            min={format24 ? 0 : 1}
            max={format24 ? 23 : 12}
            label={""}
            prefixicon={undefined}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={decrementHours}
            className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-2xl font-bold text-muted-foreground">:</div>

      <div className="flex flex-col items-center space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Minutes
        </Label>
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="outline"
            size="sm"
            onClick={incrementMinutes}
            className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={time.minutes.toString().padStart(2, "0")}
            onChange={handleMinutesChange}
            className="w-16 text-center font-mono text-lg"
            min={0}
            max={59}
            label={""}
            prefixicon={undefined}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={decrementMinutes}
            className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
