export const getAfterMonthDate = (
  month: number,
  date: Date | string | null = null,
) => {
  const now = date ? new Date(date) : new Date();
  return new Date(now.setMonth(now.getMonth() + month));
};

export function getKorDate() {
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long',
  });

  return `${dateString} ${dayName}`;
}
