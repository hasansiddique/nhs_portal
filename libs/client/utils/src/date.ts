import {format, formatDistanceToNow, parseISO} from 'date-fns';

export const timeAgo = (timestamp: string) => {
  try {
    let isoTimestamp = timestamp;

    if (!/Z|([+-]\d{2}:\d{2})$/.test(timestamp)) {
      isoTimestamp += 'Z';
    }

    const utcTime = parseISO(isoTimestamp);

    return formatDistanceToNow(utcTime, { addSuffix: true });
  } catch (error) {
    console.error('Error parsing timestamp:', error);
    return 'Invalid date';
  }
};

export const formatDate = (timestamp: string) => {
  try {
    let isoTimestamp = timestamp;

    if (!/Z|([+-]\d{2}:\d{2})$/.test(timestamp)) {
      isoTimestamp += 'Z';
    }

    const utcTime = parseISO(isoTimestamp);

    return format(new Date(utcTime), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error parsing timestamp:', error);
    return 'Invalid date';
  }
};
