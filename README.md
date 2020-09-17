![NetflixOSS Lifecycle](https://img.shields.io/osslifecycle/paulgb/Treeverse.svg)

![Treeverse Icon](extension/common/icons/32.png) Treeverse
=========

Treeverse is a tool for visualizing and navigating Twitter conversation threads.

It is available as a browser extension for Chrome and Firefox.

Installation
------------
for the Roam Toolkit: - To run, just click the icon when you're on the first tweet in a Twitter thread. Click expand all to see all the replies, and then Copy bullet list to clipboard. You can then just paste it into Roam, or another Markdown editor (works best with a bullet-list style tool). //
- This is a fork of Treeverse to support Roam Research output. This has not been published to the Chrome/Firefox stores, you need to build it manually. Download, run `yarn install`, and then `sh build_extensions.sh`. You can then go to chrome://extensions, turn on developer mode, click Load unpacked, and find the directory dist/extension_chrome.


Introduction
------------
- To run, just click the icon when you're on the first tweet in a Twitter thread. Click expand all to see all the replies, and then Copy bullet list to clipboard. You can then just paste it into Roam, or another Markdown editor (works best with a bullet-list style tool). //
- This is a fork of Treeverse to support Roam Research output. This has not been published to the Chrome/Firefox stores, you need to build it manually. Download, run `yarn install`, and then `sh build_extensions.sh`. You can then go to chrome://extensions, turn on developer mode, click Load unpacked, and find the directory dist/extension_chrome.


Exploring the Conversation
--------------------------

![Screenshot of Treeverse.](images/treeverse640.gif)

Conversations are visualized as a tree. Each box is an individual tweet, and
an line between two boxes indicates that the lower one is a reply to the upper
one. The color of the line indicates the time duration between the two tweets
(red is faster, blue is slower.)

As you hover over nodes, the reply-chain preceeding that tweet appears on the right-side
pane. By clicking a node, you can freeze the UI on that tweet in order to interact with
the right-side pane. By clicking anywhere in the tree window, you can un-freeze the tweet
and return to the normal hover behavior.

![Right pane in action.](images/right_pane.png)

Some tweets will appear with a red circle with white ellipses inside them, either overlayed
on them or as a separate node. This means that
there are more replies to that tweet that haven't been loaded. Double-clicking a node will
load additional replies to that tweet.

![More tweets indicator.](images/red_circles.png)

Privacy
-------

Treeverse runs entirely in your browser. No data is collected or tracked by Treeverse directly
when you use or install it. Browser extension installs may be tracked by Google and Mozilla, and the data
requests made to Twitter may be tracked by Twitter.

When you create a sharable link, the data is sent to a server so that it can be made available to other
users. Access to the shared link server may be tracked to prevent abuse.

Additionally, when Treeverse runs it loads a font hosted by Google Fonts (https://fonts.google.com/). Google may track this download.

