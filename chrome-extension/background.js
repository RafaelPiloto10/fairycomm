'use strict';

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    code: 'let title=document.getElementById("productTitle").innerText;title==null||""==title||fetch("www.fairycomm.tech/api/v1/get-products/"+title).then(a=>{alert(a.join("\n "))});'
  });
});