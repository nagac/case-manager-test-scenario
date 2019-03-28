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
            $("#result h3 span").append("<a href='#'' class=''>View in Case Manager</a>");
        },
        error: function (response) {
            $("#result #json-response").wrap('<p class="error"></p>').text("ERROR\nThis was the request:<br/>" + JSON.stringify(event.target.previousSibling.text) + " and this the response" + JSON.stringify(response));
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