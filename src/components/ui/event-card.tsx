
import { formatMonthDay } from "@/lib/utils";
import { UpcomingEvent } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface EventCardProps {
  event: UpcomingEvent;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);
  const formattedDate = formatMonthDay(date);
  
  // Determine the description text
  const getEventDescription = () => {
    if (event.type === 'birthday') {
      const age = event.age || 0;
      return `is turning ${age} years old`;
    } else {
      const years = event.yearsAtCompany || 0;
      return `${years} years @ your company`;
    }
  };
  
  return (
    <div className="flex items-start space-x-4 mb-6 animate-fade-up">
      <div className={`flex-shrink-0 ${
        event.type === 'birthday' 
          ? 'bg-[#4b63fe]' // Matching the graph's blue color
          : 'bg-[#94a3b8]' // New lighter slate color that works well with white text
        } text-white rounded-lg w-16 h-16 flex flex-col items-center justify-center text-center`}>
        <span className="text-xl font-bold">{event.daysUntil}</span>
        <span className="text-xs">days</span>
      </div>
      
      <div className="flex-1">
        <p className="font-medium text-sm md:text-base">{formattedDate}</p>
        <h3 className="font-bold text-base md:text-lg mt-1">{event.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {getEventDescription()}
        </p>
      </div>
    </div>
  );
}
