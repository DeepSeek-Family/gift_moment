export const parseBookingDateTime = (dateStr: string, timeStr: string): Date => {
    const [day, month, year] = dateStr.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const isoString = `${formattedDate}T${timeStr}`;
    return new Date(isoString);
};