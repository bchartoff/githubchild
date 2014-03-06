githubchild
===========

Greasemonkey script to navigate to child commit when 'c' is pressed

First [install greasemonkey in Firefox](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

Then open the script in Firefox (file -> open -> githubchild.user.js) and install.

From any github commit page, press 'c' to navigate to the child commit. Press 'p' to navigate to the parent commit (built in github functionality).

Commit history stored in localstorage, so only 1 API call made per repo. Fast performance even for [very large repos](https://github.com/django/django)