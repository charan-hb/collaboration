export const formatDistanceToNow = (date: string) => {
  const target = new Date(date).getTime();
  const diff = target - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days > 0) return `in ${days} day${days === 1 ? "" : "s"}`;
  return `${Math.abs(days)} day${days === -1 ? "" : "s"} ago`;
};


