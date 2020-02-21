import { FeedController } from "./feed_controller";
import { TweetVisualization } from "./tweet_visualization";
import { TweetNode, TweetTree } from "./tweet_tree";
import { TweetServer } from "./tweet_server";
import { Toolbar } from "./toolbar";
import { SerializedTweetNode } from "./serialize";
import * as d3 from "d3";
import { tree } from "d3";

declare global {
  interface Navigator {
    clipboard: any;
  }
}


import TurndownService from "turndown";

const turndownService = new TurndownService();

const formatTweet = tweet =>
  `@${tweet.username}: ${turndownService.turndown(tweet.bodyHtml)}\n`;

const formatTweets = (node, indent = 0) => {
  let out = "";
  out += "  ".repeat(indent) + "- " + formatTweet(node.tweet);
  console.log(node, indent, out);
  if (node.children) {
    out += Array.from(node.children)
      .map(([k, v]) => formatTweets(v, indent + 1))
      .join("\n");
  }
  return out;
};

export type PointNode = d3.HierarchyPointNode<TweetNode>;

const expandText = "Expand All";
const cancelExpandText = "Stop Expanding";

/**
 * The controller for the main tree visualization.
 */
export class VisualizationController {
  private tweetTree: TweetTree;
  private vis: TweetVisualization;
  private feed: FeedController;
  private toolbar: Toolbar;
  private server: TweetServer;
  private expandingTimer: number;
  private expandButton: HTMLButtonElement;

  fetchTweets(tweetId: string) {
    this.server.requestTweets(tweetId, null).then(tweetSet => {
      let tweetTree = TweetTree.fromTweetSet(tweetSet);
      document.getElementsByTagName(
        "title"
      )[0].innerText = `${tweetTree.root.tweet.username} - "${tweetTree.root.tweet.bodyText}" in Treeverse`;

      this.setInitialTweetData(tweetTree);
    });
  }

  setInitialTweetData(tree: TweetTree) {
    this.tweetTree = tree;
    this.vis.setTreeData(tree);
    this.vis.zoomToFit();
  }

  private expandNode(node: TweetNode, retry: boolean = true) {
    this.server.requestTweets(node.tweet.id, node.cursor).then(tweetSet => {
      let added = this.tweetTree.addTweets(tweetSet);
      if (added > 0) {
        this.vis.setTreeData(this.tweetTree);
        if (node === this.tweetTree.root) {
          this.vis.zoomToFit();
        }
      } else if (retry) {
        this.expandNode(node, false);
      }
    });
  }

  shareClicked() {
    let value = SerializedTweetNode.fromTweetNode(this.tweetTree.root);
    chrome.runtime.sendMessage({ payload: value, message: "share" });
  }

  expandOne() {
    for (let tweetNode of this.tweetTree.index.values()) {
      if (tweetNode.hasMore()) {
        this.expandNode(tweetNode, true);
        return;
      }
    }
    this.stopExpanding();
  }

  stopExpanding() {
    this.expandButton.textContent = expandText;
    clearInterval(this.expandingTimer);
    this.expandingTimer = null;
  }

  expandAll() {
    if (this.expandingTimer === null) {
      this.expandButton.textContent = cancelExpandText;
      this.expandingTimer = setInterval(this.expandOne.bind(this), 1000);
    } else {
      this.stopExpanding();
    }
  }

  copyClipboard() {
    navigator.clipboard.writeText(formatTweets(this.tweetTree.root));
  }

  constructor(server: TweetServer, offline = false) {
    this.server = server;
    this.feed = new FeedController(document.getElementById("feedContainer"));
    this.vis = new TweetVisualization(document.getElementById("tree"));
    this.expandingTimer = null;

    this.toolbar = new Toolbar(document.getElementById("toolbar"));

    if (!offline) {
      this.toolbar.addButton(
        "Create shareable link",
        this.shareClicked.bind(this)
      );

      this.expandButton = this.toolbar.addButton(
        "Expand All",
        this.expandAll.bind(this)
      );
    }

    this.toolbar.addButton(
      "Copy bullet list to clipboard",
      this.copyClipboard.bind(this)
    );
    this.vis.on("hover", this.feed.setFeed.bind(this.feed));
    if (!offline) {
      this.vis.on("dblclick", this.expandNode.bind(this));
    }
  }
}
