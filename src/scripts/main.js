async function drawPattern() {
  while (true) {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
      const randomChild = Math.floor(Math.random() * 299) + 1;
      const randomSelector = `.pattern span:nth-child(${randomChild})`;
      const randomValue = Math.floor(Math.random() * 2);
      const randomVisibility = randomValue === 1 ? "visible" : "hidden";
      const m = document.querySelector(randomSelector);
      m.style.visibility = randomVisibility;
    });
  }
}

function initializePattern() {
  const pattern = document.querySelector(".pattern");

  for (let i = 0; i < 15 * 20; i++) {
    const span = document.createElement("span");
    span.textContent = "M";
    pattern.appendChild(span);
  }

  if (pattern.children.length === 300) {
    drawPattern();
  } else {
    console.warn("Pattern could not be animated because it was not loaded in time.");
  }
}

function numberToDoubleChar(n) {
  let belowTen = true;

  if (n > 9) {
    belowTen = false;
  }

  n = n.toString();

  if (belowTen) {
    n = "0" + n;
  }

  return n;
}

function dateToString(date, format = "long") {
  const longMonths = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };

  const shortMonths = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };

  let month;

  if (format === "long") {
    month = longMonths[date.getMonth()];
  } else if (format === "short") {
    month = shortMonths[date.getMonth()];
  } else {
    console.warn("Incorrect format specified for date, defaulting to short");
    month = shortMonths[date.getMonth()];
  }

  let day = date.getDate().toString();

  return month + " " + day;
}

function populateSuggestionCard(count, location, filename, date, filesize) {
  const card = document.createElement("article");
  const leftColumn = document.createElement("div");
  const rightColumn = document.createElement("div");
  const count_ = document.createElement("h3");
  const location_ = document.createElement("p");
  const filename_ = document.createElement("button");
  const details = document.createElement("div");
  const date_ = document.createElement("p");
  const filesize_ = document.createElement("p");

  card.className = "card";
  leftColumn.className = "left-column";
  rightColumn.className = "right-column";
  count_.className = "count";
  location_.className = "location";
  filename_.className = "file-name";
  details.className = "details";
  date_.className = "date";
  filesize_.className = "file-size";

  count_.textContent = numberToDoubleChar(count);
  location_.textContent = location;
  filename_.textContent = filename;
  //date_.textContent = dateToString(date);
  date_.textContent = date;
  filesize_.textContent = filesize;

  card.appendChild(leftColumn);
  card.appendChild(rightColumn);
  leftColumn.appendChild(count_);
  rightColumn.appendChild(location_);
  rightColumn.appendChild(filename_);
  rightColumn.appendChild(details);
  details.appendChild(date_);
  details.appendChild(filesize_);

  filename_.addEventListener("click", () => {
    // TODO: Implement logic to convert the file pointed by this location to a webpage and display this webpage.
    console.log(location);
  });

  return card;
}

async function getJson(requestURL) {
  const request = new Request(requestURL);
  const response = await fetch(request);
  const data = await response.json();
  return data;
}

async function populateSuggestionGrid() {
  const recent = await getJson("src/data/recent.json");

  if (recent["files"].length === 0) return;

  const container = document.querySelector(".suggestions .max-width");
  const emptyState = document.querySelector(".suggestions .empty-state");
  container.removeChild(emptyState);

  const grid = document.querySelector(".suggestions .card-grid");

  for (let i = 0; i < 6; i++) {
    const card = populateSuggestionCard(
      i + 1,
      recent["files"][i]["location"],
      recent["files"][i]["filename"],
      recent["files"][i]["date"],
      recent["files"][i]["filesize"]
    );
    grid.appendChild(card);
  }
}

function initializePopupListeners() {
  const startReading = document.querySelector(".teaser button");
  const getStarted = document.querySelector(".suggestions .empty-state button");
  const closePopupButton = document.querySelector(".popup .inner .top button");
  const popup = document.querySelector(".popup");
  const inner = document.querySelector(".popup .inner");
  const dropArea = document.querySelector(".popup .inner .rectangle");
  const browseButton = document.querySelector(".popup .inner .rectangle button");
  const browseInput = document.querySelector(".popup .inner .rectangle input");
  const dropAreaActive = document.querySelector(".popup .inner .rectangle .active");

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropAreaActive.style.visibility = "visible";
  });

  dropArea.addEventListener("dragleave", (e) => {
    dropAreaActive.style.visibility = "hidden";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropAreaActive.style.visibility = "hidden";
    file = e.dataTransfer.files[0];
    console.log(file);
  });

  browseButton.addEventListener("click", () => {
    browseInput.click();
  });

  startReading.addEventListener("click", openPopup);
  getStarted.addEventListener("click", openPopup);
  popup.addEventListener("click", closePopup);
  closePopupButton.addEventListener("click", closePopup);
  inner.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
  });
}

function openPopup() {
  const popup = document.querySelector(".popup");
  const inner = document.querySelector(".popup .inner");

  popup.style.visibility = "visible";
  inner.style.visibility = "visible";
}

function closePopup() {
  const popup = document.querySelector(".popup");
  const inner = document.querySelector(".popup .inner");
  const dropAreaActive = document.querySelector(".popup .inner .rectangle .active");

  popup.style.visibility = "hidden";
  inner.style.visibility = "hidden";
  dropAreaActive.style.visibility = "hidden";
}

/* Program execution */

populateSuggestionGrid();
initializePopupListeners();
initializePattern();
