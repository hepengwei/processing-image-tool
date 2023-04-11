/*global chrome*/

// 监听插件图标的点击事件
chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.create({ url: "../../dashboard.html" });
});