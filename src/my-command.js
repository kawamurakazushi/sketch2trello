import BrowserWindow from "sketch-module-web-view";

import MochaJSDelegate from "./lib/MochaJSDelegate";
import { setPreferences, getPreferences } from "./utils";
import { sync } from "./export";
import { key } from "./secrets";
import { TOKEN_KEY } from "./constants";

const UI = require("sketch/ui");

const loadExportView = (context, authToken) => {
  const options = {
    identifier: "com.kawamurakazushi.sketch2trello",
    width: 540,
    height: 600,
    show: false
  };

  const browserWindow = new BrowserWindow(options);

  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  const webContents = browserWindow.webContents;

  // print a message when the page loads
  webContents.on("did-finish-load", () => {
    UI.message("UI loaded!");
    webContents.executeJavaScript(`fetchBoards("${authToken}")`);
  });

  // add a handler for a call from web content's javascript
  webContents.on("nativeLog", s => {
    UI.message(s);
  });

  webContents.on("exportArtboards", (boardId, listId) => {
    log(boardId);
    log(listId);
    sync(context, key, authToken, listId);
    UI.message("Exporting.....");
  });

  webContents.on("fetchLists", boardId => {
    log("fetching list");
    log(boardId);
    webContents.executeJavaScript(`fetchLists("${authToken}", "${boardId}")`);
  });

  browserWindow.loadURL(require("../resources/webview.html"));
};

const loadTrelloAuthentication = () => {
  COScript.currentCOScript().setShouldKeepAround_(true);
  const URL = `https://trello.com/1/authorize?expiration=never&name=Trello2Sketch&scope=read,write&response_type=token&key=${key}&callback_method=fragment&return_url=https://github.com/kawamurakazushi`;

  const frame = NSMakeRect(0, 0, 400, 620);
  const webView = WebView.alloc().initWithFrame(frame);
  const windowObject = webView.windowScriptObject();
  let authorized = false;

  const delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:": function(webView, webFrame) {
      const location = windowObject.evaluateWebScript(
        "window.location.toString()"
      );
      log(location);

      if (location.indexOf("token=") >= 0 && !authorized) {
        log("set");
        setPreferences(TOKEN_KEY, location.split("=")[1]);
        authorized = true;
        panel.close();
        loadExportView();
        COScript.currentCOScript().setShouldKeepAround_(false);
      }
    }
  });

  webView.setFrameLoadDelegate(delegate.getClassInstance());
  webView
    .mainFrame()
    .loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(URL)));

  const mask = NSTitledWindowMask + NSClosableWindowMask;
  const panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
    frame,
    mask,
    NSBackingStoreBuffered,
    true
  );

  panel.contentView().addSubview(webView);
  panel.makeKeyAndOrderFront(null);
  panel.center();
};

export default function(context) {
  log("fuck 13");
  const token = getPreferences(TOKEN_KEY);
  log(token);
  if (token) {
    loadExportView(context, token);
  } else {
    loadTrelloAuthentication();
  }
}
