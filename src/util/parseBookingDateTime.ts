export const parseBookingDateTime = (dateStr: string, timeStr: string): Date => {
    const [day, month, year] = dateStr.split("-");
    const formattedDate = `${year}-${month}-${day}`;
    const parts = timeStr.trim().split(":");
    const hh = parts[0] ?? "0";
    const mm = parts[1] ?? "00";
    const ss = parts[2] ?? "00";
    const paddedTime = `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:${ss.padStart(2, "0")}`;
    const isoString = `${formattedDate}T${paddedTime}`;
    return new Date(isoString);
};