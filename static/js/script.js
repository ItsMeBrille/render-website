// JavaScript
function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    console.log(json)
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var jsonElements = document.querySelectorAll('.json');
    jsonElements.forEach(function (element) {
        element.innerHTML = syntaxHighlight(JSON.parse(element.textContent));
    });
});




const events = {
    "08:40": 5, // 8:40 AM
    "09:25": 10, // 9:25 AM
    "10:15": 5, // 10:15 AM
    "11:00": 45, // 11:00 AM
    "12:25": 5, // 12:25 PM
    "13:10": 10, // 1:10 PM
    "13:55": 5, // 1:55 PM
    "14:45": 5, // 2:45 PM
};

function updateCounter() {
    const now = new Date();
    const nowSeconds = Number(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds())
    for (const time in events) {
        eventSeconds = Number(time.split(':')[0]*3600 + time.split(':')[1]*60);
        if (nowSeconds <= eventSeconds+events[time]*60) {
            if (nowSeconds < eventSeconds) {
                eventCountdown = eventSeconds - nowSeconds;
                document.getElementById('pause').innerHTML = `${events[time]} min pause om ${Math.floor(eventCountdown / 60)}:${eventCountdown % 60}`;
            } else {
                document.getElementById('pause').innerHTML = `${events[time]} minutter pause!`;
            }
            return;
        }   
    }   
}

// Initial call to update counter
updateCounter();

// Update counter every second
setInterval(updateCounter, 1000);
