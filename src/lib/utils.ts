
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInDays, differenceInYears, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'MMM dd, yyyy');
}

export function formatShortDate(date: string | Date): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'MMM dd');
}

export function getDaysUntil(date: string | Date): number {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return differenceInDays(date, new Date());
}

export function calculateAge(birthday: string | Date): number {
  if (typeof birthday === 'string') {
    birthday = parseISO(birthday);
  }
  return differenceInYears(new Date(), birthday);
}

export function getYearsAtCompany(startDate: string | Date): number {
  if (typeof startDate === 'string') {
    startDate = parseISO(startDate);
  }
  return differenceInYears(new Date(), startDate);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatMonthDay(date: string | Date): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'dd MMM');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
