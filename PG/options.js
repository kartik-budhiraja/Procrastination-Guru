/*
Author:Kartik Budhiraja
Procrastination Guru
options.js
This file contains the code of the script which runs in the options page, 
checks for the blocked pages, displays them , provides options to manipulate and acts accordingly
*/


window.onload = function () {
    var bgPage = chrome.extension.getBackgroundPage();
    var data = localStorage.getItem('PGData');
    var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage
    var listTable = document.getElementById("urlList");
    var listPresent;




    if (reterivedData.urlList.length > 0) {
        listPresent = true;
        //Displays the list to the page
        for (var i = 0; i < reterivedData.urlList.length; i++) {
            var tableRow = document.createElement("tr");
            var UrlListTd = document.createElement("td");
            var urldata = document.createTextNode(reterivedData.urlList[i]);
            UrlListTd.appendChild(urldata);
            tableRow.appendChild(UrlListTd);
            var TimeListTd = document.createElement("td");
            if (reterivedData.time[i] > 0 && (!(isNaN(reterivedData.time[i])))) {
                var timeInDecimals = reterivedData.time[i].toFixed(2);
                if (timeInDecimals > 24) {
                    var timedataContent = (timeInDecimals - 24.00);
                    var timedata = document.createTextNode(timedataContent.toFixed(2));
                } else
                    var timedata = document.createTextNode(timeInDecimals);
            } else
                var timedata = document.createTextNode("No Time Set");
            TimeListTd.appendChild(timedata);
            tableRow.appendChild(TimeListTd);
            var counterListTd = document.createElement("td");
            var counterdata = document.createTextNode(reterivedData.counter[i]);
            counterListTd.appendChild(counterdata);
            tableRow.appendChild(counterListTd);

            //If time is set then no option of removing the website
            var removeTd = document.createElement("td");
            if (reterivedData.time[i] == 0 || reterivedData.time[i] == NaN) {
                var removebttn = document.createElement("button");
                removebttn.setAttribute("type", "button");
                removebttn.setAttribute("id", "R" + i);
                removebttn.setAttribute("class", "buttons");
                var bttnText = document.createTextNode("REMOVE");
                removebttn.appendChild(bttnText);
                removeTd.appendChild(removebttn);
            } else {
                var notRemovable = document.createTextNode("Cannot be removed! Sorry");
                removeTd.appendChild(notRemovable);
            }
            tableRow.appendChild(removeTd);
            var addTd = document.createElement("td");
            var addToProminentList = document.createElement("button");
            addToProminentList.setAttribute("type", "button");
            addToProminentList.setAttribute("id", "A" + i);
            addToProminentList.setAttribute("class", "buttons");
            var addBttnTxt = document.createTextNode("Add to prominent List");
            addToProminentList.appendChild(addBttnTxt);
            addTd.appendChild(addToProminentList);
            tableRow.appendChild(addTd);
            listTable.appendChild(tableRow);
        }
    } else {
        var message = document.createTextNode("No websites blocked!!");
        listTable.appendChild(message);

    }

    if (listPresent) {
        var rembttn = []; //Array of remove button present on the page
        for (var i = 0; i < reterivedData.urlList.length; i++) {
            rembttn[i] = document.getElementById("R" + i);
            if (rembttn[i] != null) {
                //Separate call back function to handel the closure problem
                rembttn[i].onclick = removebuttonCallBack(i);
            }
        }

    }


    if (reterivedData.prominentList.length > 0) {
        //Displaying the list to the page
        var pList = document.getElementById("prominentList");
        for (var i = 0; i < reterivedData.prominentList.length; i++) {
            var pLtableRow = document.createElement("tr");
            var pLtableDataDomain = document.createElement("td");
            var pLDomain = document.createTextNode(reterivedData.prominentList[i]);
            pLtableDataDomain.appendChild(pLDomain);
            pLtableRow.appendChild(pLtableDataDomain);
            var removePLTd = document.createElement("td");
            var removeFromProminentList = document.createElement("button");
            removeFromProminentList.setAttribute("type", "button");
            removeFromProminentList.setAttribute("id", "Remove" + i);
            removeFromProminentList.setAttribute("class", "buttons");
            var removeBttnTxt = document.createTextNode("Remove");
            removeFromProminentList.appendChild(removeBttnTxt);
            removePLTd.appendChild(removeFromProminentList);
            pLtableRow.appendChild(removePLTd);
            var blockPLTd = document.createElement("td");
            var singleBlock = document.createElement("button");
            singleBlock.setAttribute("type", "button");
            singleBlock.setAttribute("id", "singleBlock" + i);
            singleBlock.setAttribute("class", "buttons");
            var blockBttnTxt = document.createTextNode("BLOCK");
            singleBlock.appendChild(blockBttnTxt);
            blockPLTd.appendChild(singleBlock);
            pLtableRow.appendChild(blockPLTd);
            pList.appendChild(pLtableRow);
        }
    } else {
        var pList = document.getElementById("prominentList");
        var noData = document.createTextNode("No websites added");
        pList.appendChild(noData);
    }

    if (listPresent) {

        var addPLbutton = []; //Array for all of the add button present on the page
        for (var i = 0; i < reterivedData.urlList.length; i++) {
            //Handels the onclick of add to prominent list button
            addPLbutton[i] = this.document.getElementById("A" + i);
            if (addPLbutton[i] != null) {
                addPLbutton[i].onclick = addButtonCallBack(i);
            }
        }
    }

    if (reterivedData.prominentList.length > 0) {

        for (var i = 0; i < reterivedData.prominentList.length; i++) {
            var removePlList = [];
            //Handles the removal of a domain from the prominent list
            removePlList[i] = document.getElementById("Remove" + i);
            removePlList[i].onclick = removePLCallBack(i);

            //Handels the single block button in the prominent list
            var singleBlockbutton = [];
            singleBlockbutton[i] = document.getElementById("singleBlock" + i);
            singleBlockbutton[i].onclick = singleBlockCallBack(i);
        }
    }

    //Button for blocking all of the domains in the prominent list in one go
    var blockPL = document.getElementById("blockAllButton");
    if (reterivedData.prominentList.length > 0)
        blockPL.style.visibility = "visible";
    else
        blockPL.style.visibility = "hidden";



    blockPL.onclick = function () {
        var exist = false;
        var minutesCalculation = 0.60; //Kind of denotes 60 minutes of an hour
        var timeCal = 0,
            timeSet;
        var timeInput = prompt("Set the time for blocking if you want to! (HH:MM), Press Cancel otherwise for without time blocking!", "HH:MM");
        if (timeInput != null && timeInput != undefined && timeInput != "HH:MM") {
            for (var i = 0; i < 5; i++) {
                if (i == 2)
                    continue;
                timeCal = (timeCal * 10) + parseInt(timeInput[i]);
            }

            var timeSys = bgPage.currentPGTime();

            timeSet = timeSys + (timeCal / 100);

            var timeHourCalculation = (timeSet - minutesCalculation); //To change if the total goes above .60 that is 60 minutes
            if (timeHourCalculation > parseInt(timeSet))
                timeSet = (timeHourCalculation + 1).toFixed(2);
        } else
            timeSet = 0;

        for (var j = 0; j < reterivedData.prominentList.length; j++) {
            exist = false;
            for (var i = 0; i < reterivedData.urlList.length; i++) {
                if (reterivedData.urlList[i] == reterivedData.prominentList[j])
                    exist = true;
            }

            if (!exist) {
                reterivedData.urlList.push(reterivedData.prominentList[j]);
                reterivedData.time.push(timeSet);
                reterivedData.counter.push(0);

            }
        }
        localStorage.setItem("PGData", JSON.stringify(reterivedData));
        window.location.reload();

    }

}

//Call back function for onClick of remove buttons
function removebuttonCallBack(indexInput) {
    //Takes index as argument to handel the closure problem of onclick inside a loop
    return function () {
        var bgPage = chrome.extension.getBackgroundPage();
        var data = localStorage.getItem('PGData');
        var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage
        if (reterivedData.password != null) {
            var userInputPassword = prompt("Please Enter the password for unblocking:");
            if (userInputPassword == reterivedData.password) {
                bgPage.removeUrl(reterivedData.urlList[indexInput]);
                window.location.reload();
            } else {
                alert("wrong password");
            }
        } else {
            bgPage.removeUrl(reterivedData.urlList[indexInput]);
            window.location.reload();

        }
    };
}


//Call Back function to handle the onclick of add buttons
function addButtonCallBack(inputIndex) {
    var exist;
    return function () {
        var data = localStorage.getItem('PGData');
        var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage
        for (var j = 0; j < reterivedData.prominentList.length; j++) {
            if (reterivedData.urlList[inputIndex] == reterivedData.prominentList[j])
                exist = true;
        }
        if (!exist) {
            reterivedData.prominentList.push(reterivedData.urlList[inputIndex]);
            localStorage.setItem("PGData", JSON.stringify(reterivedData));
        }
        window.location.reload();
    }
}


//Call back function for removing from prominent list
function removePLCallBack(inputIndex) {
    return function () {
        var data = localStorage.getItem('PGData');
        var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage
        reterivedData.prominentList.splice(inputIndex, 1);
        window.location.reload();
        localStorage.setItem("PGData", JSON.stringify(reterivedData));
    }
}

//Call back function to block a single website from the prominent list
function singleBlockCallBack(inputIndex) {
    return function () {
        var data = localStorage.getItem('PGData');
        var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage
        var exist;
        if (reterivedData.urlList.length <= 0)
            exist = false;
        for (var j = 0; j < reterivedData.urlList.length; j++) {
            if (reterivedData.urlList[j] == reterivedData.prominentList[inputIndex])
                exist = true;
        }
        if (!exist) {
            reterivedData.urlList.push(reterivedData.prominentList[inputIndex]);
            reterivedData.time.push(0);
            reterivedData.counter.push(0);
            localStorage.setItem("PGData", JSON.stringify(reterivedData));
            window.location.reload();
        }
    }
}