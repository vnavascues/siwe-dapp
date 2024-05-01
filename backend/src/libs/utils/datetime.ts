export enum DateTimeUnit {
  DAY = "day",
  HOUR = "hour",
  MINUTE = "minute",
  MONTH = "month",
  SECOND = "second",
  YEAR = "year",
}

export function getDateWithOffset<T extends number | string>(offset: T, unit: DateTimeUnit): Date {
  const currentDate = new Date();

  switch (unit) {
    case DateTimeUnit.SECOND:
      currentDate.setSeconds(currentDate.getSeconds() + Number(offset));
      break;
    case DateTimeUnit.MINUTE:
      currentDate.setMinutes(currentDate.getMinutes() + Number(offset));
      break;
    case DateTimeUnit.HOUR:
      currentDate.setHours(currentDate.getHours() + Number(offset));
      break;
    case DateTimeUnit.DAY:
      currentDate.setDate(currentDate.getDate() + Number(offset));
      break;
    case DateTimeUnit.MONTH:
      currentDate.setMonth(currentDate.getMonth() + Number(offset));
      break;
    case DateTimeUnit.YEAR:
      currentDate.setFullYear(currentDate.getFullYear() + Number(offset));
      break;
    default:
      throw new Error(`unsupported 'unit': ${unit}`);
  }

  return currentDate;
}
