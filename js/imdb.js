let GLOBAL_API_RESPONSES={};
function setup_listeners_for_title_card(){
  document.addEventListener('mousemove',get_imdb_rating);
}

function get_imdb_rating(e){
  let title_card = e.path.find(x=>{
    if (x.classList){
      return x.classList.contains('title-card-container');
    }
  });
  if (!title_card){
    return;
  }
  let t = title_card.getElementsByClassName('fallback-text')[0];
  if (!t){
    return;
  }
  let title = t.innerText;
  if (!GLOBAL_API_RESPONSES[title]){
    GLOBAL_API_RESPONSES[title] = 'loading';
    chrome.runtime.sendMessage({
      cs_request_type: 'omdb_title',
      title: title,
    },response=>{
      if (response.Response){
        GLOBAL_API_RESPONSES[title] = response;
        add_information_to_box(response,title_card);
      }
    })
  }else{
    if (GLOBAL_API_RESPONSES[title] === 'loading'){
      return;
    }
    add_information_to_box(GLOBAL_API_RESPONSES[title],title_card,true);
  }
}
function add_information_to_box(data, title_card, should_check_if_already_exists){
  let go = true;
  if (should_check_if_already_exists){
    //Check if information already added to page
    //if yes set go to false;
    if (title_card.firstChild.classList.contains('netflix-es-overlay-container')){
      go=false;
    }
  }
  if (go){
    //Add data to item
    let element = make_overlay_element(data,title_card.clientHeight);
    title_card.append(element);
  }
}
function make_overlay_element(data,height){
  var element = document.createElement('div');
  element.onclick=more_info;
  element.onmouseover=more_info;
  element.onmouseenter=more_info;
  element.onmousemove=more_info;
  element.onpointermove=more_info;
  element.onpointermove=more_info;
  element.classList.add('netflix-es-overlay-container');
  var element_inner = document.createElement('div');
  element_inner.innerText=data.imdbRating;
  element.appendChild(element_inner);
  return element;
}
function more_info(e){
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();
}
setup_listeners_for_title_card();
