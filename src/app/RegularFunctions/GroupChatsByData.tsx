import { isToday, isYesterday, parseISO, format } from "date-fns";

export default function GroupChatsByDate() {
  function groupConversationsByDate(conversations: any) {
    return (conversations ?? []).reduce((groups: any, convo: any) => {
      const dateKey = new Date(convo.createdAt).toISOString().split("T")[0];

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(convo);
      return groups;
    }, {} as Record<string, typeof conversations>);
  }

  function sortGroupedConversations(groups: any) {
    const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1)); // newest first

    return sortedDates.map((date) => {
      const convos = groups[date].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return { date, conversations: convos };
    });
  }

  function formatDateLabel(dateStr: string): string {
    const date = parseISO(dateStr); // ensures it's a Date object

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEE, MMM d, yyyy"); // e.g., "Mon, May 20, 2024"
  }

  return {
    groupConversationsByDate,
    sortGroupedConversations,
    formatDateLabel,
  };
}