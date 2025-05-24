import { isToday, isYesterday, parseISO, format } from "date-fns";

export default function GroupChatsByDate() {

function groupConversationsByDate(conversations: any) {
  return (conversations ?? []).reduce((groups: any, convo: any) => {
    const dateKey = format(new Date(convo.createdAt), 'yyyy-MM-dd');
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(convo);
    return groups;
  }, {} as Record<string, typeof conversations>);
}

  function sortGroupedConversations(groups: any) {
    const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

    return sortedDates.map((date) => {
      const convos = groups[date].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return { date, conversations: convos };
    });
  }

  function formatDateLabel(dateStr: string): string {
    const date = parseISO(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEE, MMM d, yyyy");
  }

  return {
    groupConversationsByDate,
    sortGroupedConversations,
    formatDateLabel,
  };
}