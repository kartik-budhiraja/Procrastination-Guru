/*
Author:Kartik Budhiraja
Procrastination Guru
background.js
This file contains the code of the script which runs at the background in the 
browser and checks for the blocked pages and acts accordingly
*/


//Default JSON object to store in the local storage
var PGDataDefault = {
    "urlList": [],
    "time": [],
    "counter": [],
    "password": null,
    "recoveryQuestion": null,
    "prominentList": []
}

//Stores the default JSON object to the local storage on the installation

chrome.runtime.onInstalled.addListener(function () {
    if (details.reason == "install") {
        localStorage.setItem("PGData", JSON.stringify(PGDataDefault));

        //Notification for user to remind the setting of password
        var opt = {
            type: "basic",
            title: "Set Password",
            message: "Please Set passsword through options for secure unblocking of websites.",
            iconUrl: "logoforwebsite128.png"
        }
        chrome.notifications.create(opt);
    }
})


//Major function checking the current url on every update of tabs
chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    var currentUrl = info.url;
    if (currentUrl != null || currentUrl != undefined) {
        currentDomain = currentUrl.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];


        var isBlocked = manipulateStorage(currentDomain, 0, 3); //Passes the current URL for checking to the block list

        if (isBlocked) { //If the link is blocked
            chrome.tabs.remove(tabId);
            //Notification for user that the page is blocked
            var opt = {
                type: "basic",
                title: "Access Denied",
                message: "Sorry, the website " + currentDomain + " is blocked, Kindly get back to work! :)",
                iconUrl: "logoforwebsite128.png"
            }
            chrome.notifications.create(opt);
        }
    }
})



//Adds the Url to the block list
function addURl(inputDomain) {
    var minutesCalculation = 0.60; //Kind of denotes 60 minutes of an hour
    var valid //To check if the user input is valid or not
    if (inputDomain != null)
        currentDomain = inputDomain;
    var timeSet,
        timeCal = 0;
    //Time input option for user
    var opt = {
        type: "basic",
        title: "Website Blocked",
        message: "Great,now you can work without distraction, " + currentDomain + " has been blocked!",
        iconUrl: "logoforwebsite128.png"
    }

    var timeInput = prompt("Please Enter the duration you want to block it for if you want to!! Press Cancel otherwise  ***(HH:MM)**", "HH:MM");
    if (timeInput == null || timeInput == "HH:MM") {
        timeSet = 0;
        valid = true;
    } else {
        for (var i = 0; i < 5; i++) {
            if (i == 2)
                continue;
            timeCal = (timeCal * 10) + parseInt(timeInput[i]);
        }
        if (isNaN(timeCal))
            valid = false;
        else
            valid = true;

    }
    if (!valid)
        timeSet = 0

    if (valid && timeSet != 0) {
        timeSet = currentPGTime() + (timeCal / 100);
        var timeHourCalculation = (timeSet - minutesCalculation); //To change if the total goes above .60 that is 60 minutes
        if (timeHourCalculation > parseInt(timeSet))
            timeSet = (timeHourCalculation + 1).toFixed(2);
    }


    var test = manipulateStorage(currentDomain, timeSet, 1); //Adds the URl to the storage list
    if (test) {
        chrome.notifications.create(opt);
        chrome.tabs.query({
                'active': true,
                'windowId': chrome.windows.WINDOW_ID_CURRENT
            },
            function (tabs) {
                chrome.tabs.remove(tabs[0].id);
            }
        );

    } else
        alert("Sorry,Some error occurred,please report an error!Thank you");
}




//Removes the url from the storage list of blocked links
function removeUrl(inputDomain) {

    var currentDomain = inputDomain;
    var result = manipulateStorage(currentDomain, 0, 2);

    if (result) {
        var opt = {
            type: "basic",
            title: "Website Unblocked!",
            message: "Hope all of your work is done! " + inputDomain + " has been unblocked! Have a great day! :)",
            iconUrl: "logoforwebsite128.png"
        }
        chrome.notifications.create(opt);
    }


}


//Returns the current system time for processing in the required format
function currentPGTime() {
    var currentPGDate = new Date();
    var currentPGHours = currentPGDate.getHours();
    var currentPGMin = currentPGDate.getMinutes();
    var PgTime = currentPGHours + (currentPGMin / 100);

    return PgTime;
}


//Major function manipulating the storage
function manipulateStorage(inputDomain, inputTime, action) {

    var data = localStorage.getItem('PGData');
    var reterivedData = JSON.parse(data);
    switch (action) {
        //For adding the url to the storage list
        case 1:
            reterivedData.urlList.push(inputDomain);
            reterivedData.time.push(inputTime);
            reterivedData.counter.push(0);
            localStorage.setItem("PGData", JSON.stringify(reterivedData));
            return true;
            break;
        case 2:
            //Removes the url from the list
            var timeOfRemoval = currentPGTime();
            for (var i = 0; i < reterivedData.urlList.length; i++) {
                var removed;
                if (inputDomain == reterivedData.urlList[i]) {
                    if (timeOfRemoval > reterivedData.time[i]) {
                        reterivedData.urlList.splice(i, 1);
                        reterivedData.time.splice(i, 1);
                        reterivedData.counter.splice(i, 1);
                        localStorage.setItem("PGData", JSON.stringify(reterivedData));
                        removed = true;
                    } else {
                        var decision = confirm("The time is still left, don't you want to finish your stuff? Press cancel to continue working!");
                        if (decision) {
                            reterivedData.urlList.splice(i, 1);
                            reterivedData.time.splice(i, 1);
                            reterivedData.counter.splice(i, 1);
                            localStorage.setItem("PGData", JSON.stringify(reterivedData));
                            removed = true;
                        } else {
                            removed = false;
                        }
                    }

                }
            }
            return removed;
            break;
        case 3:
            //Returns the result of comparing with the storage list            
            var found = false;

            if (reterivedData.urlList.length > 0) {
                for (var i = 0; i < reterivedData.urlList.length && found == false; i++) {
                    if (inputDomain == reterivedData.urlList[i]) {
                        if (reterivedData.time[i] != 0 && currentPGTime() > reterivedData.time[i]) {
                            manipulateStorage(inputDomain, inputTime, 2);
                            found = false;
                        } else {
                            var currentCounter = reterivedData.counter[i];
                            reterivedData.counter[i] = currentCounter + 1;
                            localStorage.setItem("PGData", JSON.stringify(reterivedData));
                            found = true;
                        }
                    } else
                        found = false; //If domain is not matched
                }
                return found;
            } else {
                return false; //If no website is blocked
            }

            break;
        default:
            return false;
    }

}