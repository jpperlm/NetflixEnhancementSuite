// debugger
// window.onscroll = function () {
//   remove_visible();
// };
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

function get_row_headers(){
  let all_headers_list = [...document.querySelectorAll('.rowHeader .row-header-title')];
  let header_names=[];
  all_headers_list.forEach(item=>{
    console.log(item.innerText);
  })
}
get_row_headers();
