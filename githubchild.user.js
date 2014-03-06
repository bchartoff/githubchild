// ==UserScript==
// @name           Github Child Shortcut
// @namespace      githubChildShortcut
// @match https://*.github.com/*
// ==/UserScript==



var current_id;
var url;

//scrape the path name from github
var repo_path = $(".js-current-repository.js-repo-home-link")[0].pathname;


function geturl(){
//scrape the commit id
current_id = $("SPAN.sha.js-selectable-text")[0].innerHTML;
$.get('https://api.github.com/repos'+repo_path+'/commits', function(json){
  //iterate through json structure from github API and find
  //commit who has as a parent the current commit (i.e. it's child)
  //then grab the URL of that child
    $.each(json, function(){
      var temp_url = this.html_url;
      $.each(this.parents, function() {
        $.each(this, function(i,v){
          if (v == current_id){
            url = temp_url;
          };
        });
      });
  });
});
};
geturl();


//when key pressed, if the key is c, navigate to the child
(function(){
document.addEventListener('keydown', function(e) {
  if (e.keyCode == 67) {
    url = url.replace("https://github.com","");
    window.location = url;
  }
  geturl();
}, false);
})();
