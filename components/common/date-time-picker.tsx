import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePicker } from "./time-picker";
import { Label } from "../ui/label";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  format24?: boolean;
  label: string;
  error?:string
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date and time",
  className,
  disabled,
  label,
  error,
  format24 = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [time, setTime] = useState({
    hours: value?.getHours() || 12,
    minutes: value?.getMinutes() || 0,
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDateTime = new Date(date);
      newDateTime.setHours(time.hours, time.minutes, 0, 0);
      setSelectedDate(newDateTime);
    } else {
      setSelectedDate(undefined);
    }
  };

  const handleTimeChange = (newTime: { hours: number; minutes: number }) => {
    setTime(newTime);
    if (selectedDate) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(newTime.hours, newTime.minutes, 0, 0);
      setSelectedDate(newDateTime);
    }
  };

  const handleApply = () => {
    if (onChange) {
      onChange(selectedDate);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setTime({ hours: format24 ? 12 : 12, minutes: 0 });
    if (onChange) {
      onChange(undefined);
    }
  };

  const formatDateTime = (date: Date) => {
    const timeFormat = format24 ? "HH:mm" : "hh:mm aa";
    return `${format(date, "PPP")} at ${format(date, timeFormat)}`;
  };

  return (
    <div className="gap-2 flex flex-col">
      <Label className="mb-1 text-sm md:text-lg">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !selectedDate && "text-muted-foreground",
              className
            )}
            disabled={disabled}
              onClick={(e) => e.stopPropagation()}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDateTime(selectedDate) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100]" align="start"            
            onClick={(e) => e.stopPropagation()}>
          <Tabs defaultValue="date" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </TabsTrigger>
            </TabsList>

            <TabsContent value="date" className="m-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </TabsContent>

            <TabsContent value="time" className="m-0">
              <TimePicker
                time={time}
                onChange={handleTimeChange}
                format24={format24}
              />
            </TabsContent>
          </Tabs>

          <div className="border-t p-3 flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1"
              disabled={!selectedDate}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <strong>{error}</strong>
    </div>
  );
};
