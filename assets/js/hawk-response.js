$( document ).ready(function() {
    // add navigation menu items to pages dynamically
    $('nav ul').append('<li><a href="detect-transactions-to-high-risk-country-bosnia.html">Detect Transactions to High Risk Country Bosnia</a></li>');
    $('nav ul').append('<li><a href="pep-auto-close-based-on-geography-and-birthdate.html">PEP Auto-Close based on Geography and Birthdate</a></li>');
    $('nav ul').append('<li><a href="auto-close-based-on-contextual-replay.html">Auto Close based on Contextual Replay</a></li>');
    $('nav ul').append('<li><a href="detect-amount-splitting.html">Detect Amount Splitting (Smurfs)</a></li>');

    var jsonStr = $(".pre").text();
    var jsonObj = JSON.parse(jsonStr);
    var jsonPretty = JSON.stringify(jsonObj, null, '\t');

    $(".pre").text(jsonPretty);
});

function getFileNameForStorage() {
    var fullFilename = window.location.href;
    var indexFrom = fullFilename.lastIndexOf('/') + 1;
    var length = fullFilename.indexOf(".html") - indexFrom + 5;
    var name = fullFilename.substr(indexFrom, length)

    return name;
}

function addStoreLink() {

    var data = "<html>" + $("html").html() + "</html>";
    $('#store').children().remove();
    var data = "<html>" + $("html").contents()[1].parentNode.innerHTML + "</html>";
    var exportLink = document.createElement('a');
    var name = getFileNameForStorage();
    exportLink.setAttribute("download", name);
    exportLink.setAttribute('href', 'data:text/csv;base64,' + window.btoa(data));
    exportLink.appendChild(document.createTextNode('store to local hard disk: ' + name));
    exportLink.setAttribute('id', "linkToStore")
    $('#store').append(exportLink);
    $('#linkToStore').click(addStoreLink)
}

function handleHttpsForStorage() {
    if (window.location.href.startsWith("https")) {
        alert("As this test sheet is hosted under https and our dev machine in on http it needs to be stored locally and opened from there.");
        document.getElementById('linkToStore').click()
        alert("Document stored in download folder as:\n'" + getFileNameForStorage() + "'");
        $('button').attr("disabled", true);
        $('button').attr("title", "Please store as a https page cannot call http content!");
    }
    else {
        $('button').attr("disabled", false);
        $('button').attr("title", "Click to send to dev system!");
    }
}

// display the button
function prepareRequests() {
    if ($(".testButton").length == 0) {
        $(".POST,.GET,.PUT").attr("contenteditable", "true").wrap("<div></div>").after("<br/><button id='run-scenario' class='testButton btn-primary' style='float: right;'>Run Scenario</button>")
    }
}

// execute request
function executeRequest(event) {
    $.ajax
    ({
        type: $(event.target).siblings("div").attr("class"),
        headers: {
            'api-key': '4yRVMZ3L8s2*7C5c#',
            'Content-Type': 'application/json'
        },
        url: 'http://a18428cc0997511e8adf30215972eacb-798119299.eu-central-1.elb.amazonaws.com/v1/amlChecks',
        dataType: 'json',
        async: false,
        data: $(event.target).parent().text(),
        success: function (response) {
            $("#result #json-response").text(JSON.stringify(response));
            $("#result h3 span a").remove();
            $("#result h3 span").append("<a href='http://a39dc08367b8111e8adf30215972eacb-71037246.eu-central-1.elb.amazonaws.com:3000/caseManager/openCases/3a442036-2968-4ae4-ab2a-a656afdf2e30' target='_blank' class=''>View in Case Manager</a>");
        },
        error: function (response) {
            $("#result #json-response p.error").text("ERROR\nThis was the request:" + JSON.stringify(event.target.previousSibling.text) + " and this the response" + JSON.stringify(response));
        }
    })
    $("#run-scenario").text('Processing Scenario...').fadeOut();
    $("#run-scenario").text('Run Scenario').fadeIn()
    
}

// click to execute
$(document).ready(function () {
    prepareRequests();
    $(".POST,.GET,.PUT").siblings("button").click(executeRequest);    
    addStoreLink();
    handleHttpsForStorage();
});