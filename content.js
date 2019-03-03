window.onscroll = function () {
  remove_visible();
};
function remove_visible(){
  const class_names = ['billboard-row','bigRow'];
  class_names.forEach(name=>{
    let list = document.getElementsByClassName(name);
    for (let item of list) {
      item.style.display='none';
    }
  });
}
remove_visible();
