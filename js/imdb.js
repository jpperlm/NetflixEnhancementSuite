const GLOBAL_API_RESPONSES={};
/**
 * Starts mouse listeners for hovering titles
 */
function setupListenersForTitleCards() {
  document.addEventListener('mousemove', mouseMoveEvent);
}

/**
 * Triggered on mouse move. Looks to see if we are inside a title-card
 * @param {int} e the event triggered
 */
function mouseMoveEvent(e) {
  const tc = getTitleCard(e);
  if (!tc) return;
  const title = getShowTitle(tc);
  handleTitleEvent(title, tc);
}

/**
 * Looks to see if we are inside a title-card
 * @param {int} e the event triggered
 * @return {domelement} returns the titld-card
 */
function getTitleCard(e) {
  const titleCard = e.path.find((x)=>{
    if (x.classList) {
      return x.classList.contains('title-card-container');
    }
  });
  return titleCard;
}

/**
 * Gets title of show
 * @param {int} element the title card element
 * @return {string} returns the title
 */
function getShowTitle(element) {
  return element.getElementsByClassName('fallback-text')[0].innerText;
}

/**
 * Figures out what to do with the title
 * @param {string} title the title
 * @param {domelement} tc the title card element
 */
function handleTitleEvent(title, tc) {
  if (!GLOBAL_API_RESPONSES[title]) {
    GLOBAL_API_RESPONSES[title] = 'loading';
    const payload = {
      cs_request_type: 'omdb_title',
      title: title,
    };
    chrome.runtime.sendMessage(payload, (response)=> {
      if (response.Response) {
        GLOBAL_API_RESPONSES[title] = response;
        appendElements(response, tc);
      }
    });
  } else if (GLOBAL_API_RESPONSES[title] === 'loading') {
    return;
  } else {
    appendElements(GLOBAL_API_RESPONSES[title], tc);
  }
}

/**
 * Checks if we need to add the element onto the page and adds if so
 * @param {object} data IMDB Object of information
 * @param {domelement} titleCard DOM Element class title-card-container
 * @param {int} i tries

 */
function appendElements(data, titleCard, i=0) {
  const actionButtonsElement =
    titleCard.getElementsByClassName('bob-title')[0];
  if (!actionButtonsElement) {
    if (i>20) return;
    setTimeout(function() {
      appendElements(data, titleCard, i+1);
      return;
    }, 100);
    return;
  };
  const imdbButton = actionButtonsElement
      .getElementsByClassName('netflix-es-imdb-circle-hover')[0];
  if (imdbButton) return;
  const newIMDBElement = createIMDBElement(data);
  actionButtonsElement.appendChild(newIMDBElement);
}

/**
 * Creates element based on data
 * @param {object} data IMDB Object of information
 * @return {domelement} IMDB Circle
 */
function createIMDBElement(data) {
  const element = document.createElement('div');
  element.classList.add('netflix-es-imdb-circle-hover');
  element.classList.add('nf-svg-button-wrapper');
  element.classList.add('netflix-es-imdb-circle-hover');
  element.name = data.Title;
  const inner = document.createElement('a');
  inner.classList.add('netflix-es-imdb-circle-inside');
  inner.classList.add('simpleround');
  inner.classList.add('nf-svg-button');
  inner.innerText=data.imdbRating;
  element.onmouseenter=moreInfoShow;
  element.onmouseleave=moreInfoHide;
  element.appendChild(inner);
  return element;
}

function moreInfoShow(e) {
  // debugger;
}
function moreInfoHide(e) {
  // debugger;
}
setupListenersForTitleCards();
