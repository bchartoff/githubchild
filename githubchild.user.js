// ==UserScript==
// @name           Github Child Shortcut
// @namespace      githubChildShortcut
// ==/UserScript==

//update on AJAX request instead of page load (so updates on "p" press)
//https://gist.github.com/BrockA/2625891
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
)
{
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                actionFunction (jThis);
                jThis.data ('alreadyFound', true);
            }
        } );
        btargetsFound   = true;
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                500
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


if(/https:\/\/*.github.com\/.*\/commit/.test(document.URL)){
    waitForKeyElements (".sha.js-selectable-text", get_data);
}
else{
    //if not on commit page, clear repo and commit id variables
    localStorage.setItem("repo_path",null);
    localStorage.setItem("current_id",null);
}


function get_data(){
//scrape commit id
var current_id =$("SPAN.sha.js-selectable-text")[0].innerHTML;
//scrape usr/repo path
var repo_path = $(".js-current-repository.js-repo-home-link")[0].pathname;
//if you navigate to a new repo, clear localstorage and grab commit history from api
if (repo_path != localStorage.getItem("repo_path")){
  localStorage.clear()
    $.get('https://api.github.com/repos'+repo_path+'/commits', function(json){
    //iterate through json structure from github API and find
    //commit who has as a parent the current commit (i.e. it's child)
    //then grab the URL of that child
      $.each(json, function(){
        var temp_url = this.html_url;
        $.each(this.parents, function() {
          $.each(this, function(i,v){
            localStorage.setItem(v,temp_url)
          });
        });
    });
  });
}
//set path and id variables
localStorage.setItem("repo_path",repo_path);
localStorage.setItem("current_id",current_id);
}

//only run if on commit page
if(/https:\/\/*.github.com\/.*\/commit/.test(document.URL)){
    //when key pressed, if the key is c, navigate to the child
    (function(){
    document.addEventListener('keydown', function(e) {
      if (e.keyCode == 67) {
        url = localStorage.getItem(localStorage.getItem("current_id")).replace("https://github.com","");
        window.location = url;
      }
    }, false);
    })();
}
