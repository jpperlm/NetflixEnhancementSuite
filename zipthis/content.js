window.onscroll = function () {
  update_dropdown_list();
};
let GLOBAL_ORDER = [];

function get_row_headers(){
  let all_headers_list = [...document.querySelectorAll('.rowHeader .row-header-title')];
  let header_names=[];
  all_headers_list.forEach(item=>{
    let t = item.innerText
    if (!header_names.includes(t)){
      header_names.push(t)
    }
  })
  return header_names;
}

function add_order_list_dropdown(){
  let found = document.querySelector('ul.tabbed-primary-navigation');
  if (found){
    let new_element =
      '<li id="netflix-es-reorder-dropdown" class="navigation-tab">' +
        '<a>' +
          'Quick-Nav' +
        '</a>' +
        '<ul id="netflix-es-reorder-submenu" class="netflix-es-hidden sub-menu theme-lakira"></ul>' +
      '</li>';
    found.innerHTML = found.innerHTML + new_element;
    let re_order_menu_item = document.getElementById('netflix-es-reorder-dropdown');
    re_order_menu_item.addEventListener("mouseover", mouseover);
    re_order_menu_item.addEventListener("mouseout", mouseout);

  }
}
function mouseout(){
  let found = document.getElementById('netflix-es-reorder-submenu');
  found.classList.remove('netflix-es-show-force');
}
function mouseover(){
  let found = document.getElementById('netflix-es-reorder-submenu');
  found.classList.add('netflix-es-show-force');
}

function update_dropdown_list(){
  let base = document.getElementById('netflix-es-reorder-dropdown');
  if (!base){
    add_order_list_dropdown();
  }
  let found = document.getElementById('netflix-es-reorder-submenu');
  if (!found){
    base.remove()
    add_order_list_dropdown();
    found = document.getElementById('netflix-es-reorder-submenu');
  }
  if (!found){
    return;
  }
  const drop_down_list_html  = generate_drop_down_inner_html();
  while (found.hasChildNodes()) {
    found.removeChild(found.lastChild);
  }
  if (drop_down_list_html.length){
    let dd = document.getElementById('netflix-es-reorder-dropdown');
    if (![...dd.classList].includes('netflix-es-show-force')){
      dd.classList.add('netflix-es-show-force');
    }
    drop_down_list_html.forEach(li=>{
      found.appendChild(li);
    })
  }
}

function generate_drop_down_inner_html(){
  let list = get_row_headers();
  if (list){
    return list.map(name=>{
      var element = document.createElement('li');
      element.classList.add('netflix-es-order-list-item');
      element.innerText=name;
      element.onclick = jumpToCategory;
      return element;
    })
      // return `<li class="netflix-es-order-list-item" onclick="onClickListItem">${name}</li>`;
  }
}
function jumpToCategory(e){
  let t = e.target.innerText;
  let headers = [...document.getElementsByClassName('row-header-title')];
  let header = headers.find(h=>{
    return h.innerText === t;
  })
  header.scrollIntoView(true);
  window.scrollBy(0,-70);
  //TODO Look for the row with this as the header title and then jump to that point on the screen
}

function get_reorder_list_from_storage(){
  chrome.storage.sync.get(['order_list'], function(result) {
     GLOBAL_ORDER = result.order_list
   });
}
function set_reorder_list_from_storage(){
  chrome.storage.sync.set({'order_list': GLOBAL_ORDER}, function() {
   });
}

//Run on load
// set_reorder_list_from_storage();
get_reorder_list_from_storage();
add_order_list_dropdown();
update_dropdown_list();

// debugger

// window.onload = function () {
//   remove_visible();
// };
// function remove_visible(){
//   debugger
//   const class_names = ['billboard-row','bigRow'];
//   class_names.forEach(name=>{
//     let list = document.getElementsByClassName(name);
//     for (let item of list) {
//       item.style.display='none';
//     }
//   });
// }
// remove_visible();
