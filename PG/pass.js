/*
Author:Kartik Budhiraja
Procrastination Guru
pass.js
This file contains the code of the script which runs in the password page, 
checks for the stored password, and gives the option to change it or set it.
*/


window.onload = function () {
    var content = document.getElementById("content"); //the containing element in html page
    var data = localStorage.getItem('PGData');
    var reterivedData = JSON.parse(data); //Stores the reterived data from the local storage  
    var validationPassed = false; //Boolean to store whether the password entered was correct or not
    var breakLine = document.createElement("br");
    //If password has been set 
    if (reterivedData.password != null) {
        //taking input for the current password
        var icPLabel = document.createElement("label");
        var icPLabelText = document.createTextNode("Please enter the Current Password:");
        icPLabel.appendChild(icPLabelText);
        var icPInput = document.createElement("input");
        icPInput.setAttribute("type", "password");
        icPInput.setAttribute("id", "userInputPass");
        icPLabel.appendChild(icPInput);
        content.appendChild(icPLabel);
        content.appendChild(breakLine);

        //Submit Link designed as a button to submit password for validation
        var submitLinkbttn = document.createElement("button");
        submitLinkbttn.setAttribute("type", "button");
        submitLinkbttn.setAttribute("class", "buttons");
        submitLinkbttn.setAttribute("id", "passValidation");
        var submitText = document.createTextNode("Submit");
        submitLinkbttn.appendChild(submitText);
        content.appendChild(submitLinkbttn);
        //The link for resetting password
        var forgetPass = document.createElement("a");
        forgetPass.setAttribute("href", "#");
        forgetPass.setAttribute("id", "forgetPass");
        var forgetPassText = document.createTextNode("Forgot Password");
        forgetPass.appendChild(forgetPassText);
        content.appendChild(forgetPass);

        //The function to get the user answer to recovery question and act accordingly
        var forgetPassAction = document.getElementById("forgetPass");
        forgetPassAction.onclick = function () {
            var userInput = prompt("Please enter your dream, what you want to become in one word as answer to the recovery question:");
            if (userInput == reterivedData.recoveryQuestion) {
                reterivedData.password = null;
                localStorage.setItem("PGData", JSON.stringify(reterivedData));
                window.location.reload();

            } else {
                alert("Wrong Answer");
            }
        }

        //Function on onclick of the submit button of the password entered validation
        var passwordValidation = document.getElementById("passValidation");
        passwordValidation.onclick = function () {
            var userInput = document.getElementById("userInputPass").value.trim();
            validationPassed = (userInput === reterivedData.password);

            //If a valid password is entered
            if (validationPassed) {

                //To clear out the previous button and display a message
                content.innerHTML = "Please Enter the new details:" + "<br>";
                //Input for the new password
                var inPLabel = document.createElement("label");
                var inPLabelText = document.createTextNode("Please enter the New Password");
                inPLabel.appendChild(inPLabelText);
                var inPInput = document.createElement("input");
                inPInput.setAttribute("type", "password");
                inPInput.setAttribute("id", "userNewPass");
                inPLabel.appendChild(inPInput);
                content.appendChild(inPLabel);
                content.appendChild(breakLine);


                //Submit button for the validation of the new password entered by the user
                var submitNewPasswordBttn = document.createElement("button");
                submitNewPasswordBttn.setAttribute("type", "button");
                submitNewPasswordBttn.setAttribute("id", "newPassValidationButton");
                submitNewPasswordBttn.setAttribute("class", "buttons");
                var submitText = document.createTextNode("Submit");
                submitNewPasswordBttn.appendChild(submitText);
                content.appendChild(submitNewPasswordBttn);
                content.appendChild(breakLine);
                //Function to validate the new password set  and set it to the local storage 
                //Display the success message
                var newPasswordButton = document.getElementById("newPassValidationButton");
                newPasswordButton.onclick = function () {
                    var newPassword = document.getElementById("userNewPass").value.trim();
                    var valid = passwordChecker(newPassword);
                    //Guidelines not followed
                    if (!valid) {
                        alert("Please Enter the Password according to the guidelines");
                        document.getElementById("userNewPass") = "";
                    } else {
                        //Password accepted and changed
                        reterivedData.password = newPassword;
                        localStorage.setItem("PGData", JSON.stringify(reterivedData));
                        content.innerHTML = "Password Changed Successfully!!";
                        var opt = {
                            type: "basic",
                            title: " Password Changed!",
                            message: "Password Changed Successfully! Cheers! :)",
                            iconUrl: "logoforwebsite128.png"
                        }
                        chrome.notifications.create(opt);

                    }
                }

            } else
                alert("Wrong Password!! Try Again");
        }
        //If no password is set <Default Case>
    } else {
        //Input for the password by the user
        var iPLabel = document.createElement("label");
        var iPLabelText = document.createTextNode("Please enter the Password you want*:");
        iPLabel.appendChild(iPLabelText);
        var iPInput = document.createElement("input");
        iPInput.setAttribute("type", "password");
        iPInput.setAttribute("id", "userPass");
        iPLabel.appendChild(iPInput);
        content.appendChild(iPLabel);
        content.appendChild(breakLine);
        content.appendChild(breakLine);
        //Input for the security question by the user
        var securityQuestionLabel = document.createElement("label");
        var securityQuestionLabelText = document.createTextNode("Please enter your dream, what you want to become in one word as answer to the recovery question:*");
        securityQuestionLabel.appendChild(securityQuestionLabelText);
        var securityQuestionInput = document.createElement("input");
        securityQuestionInput.setAttribute("type", "text");
        securityQuestionInput.setAttribute("id", "securityQ");
        securityQuestionLabel.appendChild(securityQuestionInput);
        content.appendChild(securityQuestionLabel);


        //The submit button to store the values
        var submitbttn = document.createElement("button");
        submitbttn.setAttribute("type", "button");
        submitbttn.setAttribute("id", "defaultInput")
        submitbttn.setAttribute("class", "buttons");
        var submitText = document.createTextNode("Submit");
        submitbttn.appendChild(submitText);
        content.appendChild(submitbttn);


        var defaultInputBttn = document.getElementById("defaultInput");
        defaultInputBttn.onclick = function () {
            var recoveryQ = document.getElementById("securityQ").value.trim();
            var firstPass = document.getElementById("userPass").value.trim();
            if (firstPass != null && recoveryQ != null) {
                var isValid = passwordChecker(firstPass);
                if (isValid) {
                    //Password accepted and changed
                    reterivedData.password = firstPass;
                    reterivedData.recoveryQuestion = recoveryQ;
                    localStorage.setItem("PGData", JSON.stringify(reterivedData));
                    content.innerHTML = "Changes Saved";
                    var opt = {
                        type: "basic",
                        title: "Password Set",
                        message: "Password has been set successfully, enjoy distraction free working! Cheers :)",
                        iconUrl: "logoforwebsite128.png"
                    }
                    chrome.notifications.create(opt);

                } else {
                    alert("Please Follow the specified guidelines");
                }
            } else
                alert("Empty fields");

        }


    }




}

//Checks the password for the rules set
function passwordChecker(newPasswordEntered) {
    var okay = true;
    var digit, upper = 0;
    //Checks for the lenght and Starting with a letter
    if (newPasswordEntered.length < 8 || newPasswordEntered.charAt(0).toUpperCase() < 'A' || newPasswordEntered.charAt(0).toUpperCase() > 'Z')
        okay = false;
    if (okay) {
        for (var i = 0; i < newPasswordEntered.length; i++) {
            //Checks for the presence of a digit in the password
            if (parseInt(newPasswordEntered.charAt(i)) == newPasswordEntered.charAt(i))
                digit = 1;
            //Checks for the upper case digit in the password
            if (newPasswordEntered.charCodeAt(i) >= '65' && newPasswordEntered.charCodeAt(i) <= '90')
                upper = 1;
        }
    }
    if (digit == 0 || upper == 0)
        okay = false;
    return okay;
}