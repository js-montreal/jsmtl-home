const EMAIL_PATTERN = /^([^@\s]+@[^@\s]+\.[^@\s]+)$|^mailto:/i;

function isSafeUrl(url) {
  return !!url && !EMAIL_PATTERN.test(url.trim());
}

function formatMeetupDate(on) {
  const year = on.slice(0, 4);
  const month = on.slice(4, 6);
  const day = on.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}T12:00:00`);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function buildSpeakerLinks(links) {
  const list = document.createElement("ul");
  list.className = "speaker-links";

  links.filter(link => isSafeUrl(link.url)).forEach(link => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.title;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    item.appendChild(anchor);
    list.appendChild(item);
  });

  return list;
}

function buildSpeaker(speaker) {
  const el = document.createElement("div");
  el.className = "speaker";

  if (speaker.title) {
    const talkTitle = document.createElement("p");
    talkTitle.className = "speaker-talk-title";
    talkTitle.textContent = speaker.title;
    el.appendChild(talkTitle);
  }

  const name = document.createElement("p");
  name.className = "speaker-name";
  const label = document.createElement("span");
  label.className = "speaker-label";
  label.textContent = "Speaker: ";
  name.appendChild(label);
  if (isSafeUrl(speaker.url)) {
    const anchor = document.createElement("a");
    anchor.href = speaker.url;
    anchor.textContent = speaker.name;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    name.appendChild(anchor);
  } else {
    name.appendChild(document.createTextNode(speaker.name));
  }
  el.appendChild(name);

  if (speaker.synopsis) {
    const synopsis = document.createElement("p");
    synopsis.className = "speaker-synopsis";
    synopsis.innerHTML = speaker.synopsis;
    el.appendChild(synopsis);
  }

  if (speaker.links && speaker.links.length > 0) {
    el.appendChild(buildSpeakerLinks(speaker.links));
  }

  return el;
}

function buildCancelledCard(meetup) {
  const card = document.createElement("article");
  card.className = "meetup-card meetup-card-cancelled";

  const header = document.createElement("div");
  header.className = "meetup-header";

  const title = document.createElement("h2");
  title.className = "meetup-title";
  title.textContent = "Cancelled";
  header.appendChild(title);

  const date = document.createElement("span");
  date.className = "meetup-date";
  date.textContent = formatMeetupDate(meetup.on);
  header.appendChild(date);

  card.appendChild(header);

  const notice = document.createElement("p");
  notice.className = "meetup-cancelled-notice";
  if (meetup.title) {
    notice.innerHTML = meetup.title;
  } else {
    notice.textContent = "This meetup did not take place.";
  }
  card.appendChild(notice);

  return card;
}

function buildMeetupCard(meetup) {
  const card = document.createElement("article");
  card.className = "meetup-card";

  const header = document.createElement("div");
  header.className = "meetup-header";

  const title = document.createElement("h2");
  title.className = "meetup-title";
  title.innerHTML = meetup.title;
  header.appendChild(title);

  const date = document.createElement("span");
  date.className = "meetup-date";
  date.textContent = formatMeetupDate(meetup.on);
  header.appendChild(date);

  card.appendChild(header);

  if (meetup.blurb) {
    const blurb = document.createElement("p");
    blurb.className = "meetup-blurb";
    blurb.innerHTML = meetup.blurb;
    card.appendChild(blurb);
  }

  const speakers = document.createElement("div");
  speakers.className = "speakers" + (meetup.speakers.length === 2 ? " two-speakers" : "");
  meetup.speakers.forEach(speaker => speakers.appendChild(buildSpeaker(speaker)));
  card.appendChild(speakers);

  return card;
}

function buildYearSeparator(year) {
  const el = document.createElement("div");
  el.className = "year-separator";

  const label = document.createElement("span");
  label.className = "year-label";
  label.textContent = year;

  const lineBefore = document.createElement("span");
  lineBefore.className = "year-line";
  const lineAfter = document.createElement("span");
  lineAfter.className = "year-line";

  el.appendChild(lineBefore);
  el.appendChild(label);
  el.appendChild(lineAfter);

  return el;
}

function loadArchive() {
  const container = document.getElementById("archive-list");

  try {
    const sorted = MEETUPS_DATA.filter(meetup => meetup.hide !== true).sort((a, b) => b.on.localeCompare(a.on));

    container.innerHTML = "";
    let lastYear = null;
    sorted.forEach(meetup => {
      const year = meetup.on.slice(0, 4);
      if (year !== lastYear) {
        container.appendChild(buildYearSeparator(year));
        lastYear = year;
      }
      container.appendChild(meetup.cancelled === true ? buildCancelledCard(meetup) : buildMeetupCard(meetup));
    });
  } catch (err) {
    container.innerHTML = '<p class="archive-loading">Sorry, the archive could not be loaded.</p>';
  }
}

loadArchive();
