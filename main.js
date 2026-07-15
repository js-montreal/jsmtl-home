function ordinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function secondTuesday(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const firstTuesday = 1 + ((2 - firstOfMonth.getDay() + 7) % 7);
  return new Date(year, month, firstTuesday + 7);
}

function nextMeetupDate(today) {
  const meetup = secondTuesday(today.getFullYear(), today.getMonth());
  if (today.getTime() <= meetup.getTime()) return meetup;

  const month = (today.getMonth() + 1) % 12;
  const year = today.getFullYear() + (today.getMonth() === 11 ? 1 : 0);
  return secondTuesday(year, month);
}

function nextMeetupText(now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const meetup = nextMeetupDate(today);
  const diffDays = Math.round((meetup - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "The meetup is TONIGHT @ 7pm!";
  if (diffDays === 1) return "Next meetup is tomorrow night @ 7pm!";

  const weekday = meetup.toLocaleDateString("en-US", { weekday: "short" });
  const month = meetup.toLocaleDateString("en-US", { month: "short" });
  const day = ordinal(meetup.getDate());
  return `Next meetup on: ${weekday}, ${month} ${day}, ${meetup.getFullYear()}`;
}

document.getElementById("next-meetup").textContent = nextMeetupText(new Date());
