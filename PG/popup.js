window.onload = function () {
    var currentUrl; //Stores the current URl of the tab and sends it to the background script
    var bgPage = chrome.extension.getBackgroundPage();
    //Calls the addUrl function of the background page with the current domain
    var addbtn = document.getElementById("add");

    chrome.tabs.getSelected(null, function (tab) {
        currentUrl = tab.url;
        //Regex matches for the domain name out of the current Url
        var currentDomain = currentUrl.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];



        addbtn.onclick = function () {
            bgPage.addURl(currentDomain)
        };

    });
    var options = document.getElementById("options");
    options.onclick = function () {
        chrome.tabs.create({
            url: "options.html"
        });
    }
    

    
}




