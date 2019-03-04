window.onscroll = function () {
  section_header_wrapper();
};
let GLOBAL_ORDER = [];
let CURRENT_VISIBLE = [];
let DRAGGING_ELEMENT= undefined;
function get_reorder_list_from_storage(){
  chrome.storage.sync.get(['order_list'], function(result) {
     GLOBAL_ORDER = result.order_list.filter(x=> x)
     section_header_wrapper(true);
   });
}
function set_reorder_list_to_storage(){
  chrome.storage.sync.set({'order_list': GLOBAL_ORDER}, function() {
   });
}
function set_global_order(order){
  GLOBAL_ORDER = order;
  set_reorder_list_to_storage();
}

//Steps 1: check current row headers and global_order list. If they are the same (order irrelevant) return;
//      2: If no, generate new drop down list.

function section_header_wrapper(bool){
  let visibleHeaders = get_visible_row_headers();
  if (!visibleHeaders.length){
    return;
  }
  let found = false;
  visibleHeaders.forEach(h=>{
    if (!GLOBAL_ORDER.includes(h)){
      GLOBAL_ORDER.push(h);
      set_reorder_list_to_storage();
    }
    if (!CURRENT_VISIBLE.includes(h)){
      CURRENT_VISIBLE.push(h);
      found=true;
    }
  })
  if (found || bool){
    visibleHeaders.sort(function(a, b){
      return GLOBAL_ORDER.indexOf(a) - GLOBAL_ORDER.indexOf(b);
    });
    // update_headers_on_page(visibleHeaders);
    let dropdownHTML = generate_drop_down_inner_html(visibleHeaders);
    update_dropdown_list(dropdownHTML);
  }
  return;
}

function get_visible_row_headers(){
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
function update_dropdown_list(html){
  let base = document.getElementById('netflix-es-reorder-dropdown');
  if (!base){
    add_order_list_dropdown();
    base = document.getElementById('netflix-es-reorder-dropdown');
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
  while (found.hasChildNodes()) {
    found.removeChild(found.lastChild);
  }
  let dd = document.getElementById('netflix-es-reorder-dropdown');
  if (![...dd.classList].includes('netflix-es-show-force')){
    dd.classList.add('netflix-es-show-force');
  }
  html.forEach(li=>{
    found.appendChild(li);
  })
}
function generate_drop_down_inner_html(list){
  return list.map(name=>{
    var element = document.createElement('li');
    element.classList.add('netflix-es-order-list-item');
    element.innerText=name;
    element.onclick = jumpToCategory;
    element.draggable=true;
    element.ondragover=ondragover;
    element.ondragstart=ondragstart;
    element.ondrop=drop;
    return element;
  })
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
// function update_headers_on_page(headers){
//   let rows = document.querySelectorAll('div.lolomoRow_title_card:not(.lolomoPreview)');
//   let pre_sorted = get_visible_row_headers();
//   let rows_array = [...rows];
//   let parent = rows_array[0].parentElement;
//   rows_array.forEach(row=>{
//     row.remove()
//   });
//   debugger
//   GLOBAL_ORDER.slice().reverse().forEach(item=>{
//     if (CURRENT_VISIBLE.includes(item)){
//       let index = pre_sorted.indexOf(item);
//       debugger
//       parent.insertBefore(rows[index], parent.firstChild);
//     }
//   })
// }



function mouseout(){
  let found = document.getElementById('netflix-es-reorder-submenu');
  found.classList.remove('netflix-es-show-force');
}
function mouseover(){
  let found = document.getElementById('netflix-es-reorder-submenu');
  found.classList.add('netflix-es-show-force');
}

function ondragstart(e){
  let text = e.target.innerText;
  DRAGGING_ELEMENT = GLOBAL_ORDER.indexOf(text);
}
function drop(e){
  let top = e.clientY;
  let eles = [...document.getElementsByClassName('netflix-es-order-list-item')];
  let height = eles[0].offsetHeight;
  let text = e.target.innerText;
  let current_index = GLOBAL_ORDER.indexOf(text);
  let temp = GLOBAL_ORDER.splice(DRAGGING_ELEMENT,1)[0];
  if (e.offsetY > height/2){
    if (DRAGGING_ELEMENT > current_index){
      GLOBAL_ORDER.splice(current_index+1, 0, temp );
    }else{
      GLOBAL_ORDER.splice(current_index, 0, temp );
    }
  }else{
    if (DRAGGING_ELEMENT > current_index){
      GLOBAL_ORDER.splice(current_index, 0, temp );
    }else{
      GLOBAL_ORDER.splice(current_index - 1, 0, temp );
    }
  }
  set_reorder_list_to_storage();
  section_header_wrapper(true);
  DRAGGING_ELEMENT = undefined;

}
function ondragover(e){
  e.preventDefault()
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



//Run on load
// set_reorder_list_from_storage();
get_reorder_list_from_storage();
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
