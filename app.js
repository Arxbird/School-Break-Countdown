const breaks = {
    Autumn : 1698667200,
    Christmas : 1703246400,
    NewYear : 1704063600,
    Sport : 1708698600,
    Easter : 1711722600,
    Summer : 1718362800,
}

const CURRENT_UNIX_TIMESTAMP = 1698667200 + (86_400 * 7)
const ONE_WEEK = 86_400 * 7
var headBreak = undefined
var nextBreak = undefined

function getCurrentTimestamp() {
    const currentDate = new Date();
    const currentTimestamp = currentDate.getTime()
    return Math.floor(currentTimestamp / 1000)
    // return CURRENT_UNIX_TIMESTAMP
}

// Seconds = 129_600
function formatTime(seconds) {
    var days = Math.floor(seconds / (60 * 60 * 24));
    var hours = Math.floor((seconds / (60 * 60)) % 24);
    var minutes = Math.floor((seconds / 60) % 60);
    var seconds = Math.floor(seconds % 60);

    return {
        Days : days,
        Hours : hours,
        Minutes : minutes,
        Seconds : seconds
    }
}

function getTimeDifference(timestamp) {
    const currentTimestamp = getCurrentTimestamp()
    const timeDifference = timestamp - currentTimestamp;
    return timeDifference
}

function getDateFromTimestamp(timestamp) {
    const date = new Date(timestamp * 1000)
    return date.toDateString()
}

function getNextBreak(ignore) {
    const currentTimestamp = getCurrentTimestamp();
    for (const [name, timestamp] of Object.entries(breaks)) {
        if (name == ignore) continue;
        if (currentTimestamp >= timestamp + ONE_WEEK) continue;
        return {
            name : name, 
            timestamp : timestamp
        }
    }
}

function updateCountdown(countdownElement, countdownData) {
    if (!countdownElement) {
        return
    }
    if (!countdownData) {
        countdownElement.style.visibility = "hidden";
        return
    } else {
        countdownElement.style.visibility = "visible";
    }
    var children = countdownElement.children
    for (const [key, value] of Object.entries(children)) {
        const name = value.id
        if (name == "title") {
            value.innerHTML = countdownData.name + " Break Countdown"
        } else if (name == "date") {
            value.innerHTML = getDateFromTimestamp(countdownData.timestamp)
        } else if (name == "time-left") {
            
            var secondsLeft = getTimeDifference(countdownData.timestamp)
            var formattedTime = formatTime(secondsLeft)
            var text = undefined
            
            if (secondsLeft < 0) {
                text = countdownData.name + " Break!"
            } else if (countdownElement.id == "head-countdown") {
                for (const [name, v] of Object.entries(formattedTime)) {
                    if (v < 10) {
                        formattedTime[name] = "0" + v
                    }
                }

                text = formattedTime.Days + " : " + formattedTime.Hours + " : " + formattedTime.Minutes + " : " + formattedTime.Seconds
            } else if (countdownElement.id == "next-countdown") {
                text = formattedTime.Days + " Days Left"
            }
            
            console.log(text)

            value.innerHTML = text
        }
    }
}

function updatePage() {
    var headCountdown = document.getElementById("head-countdown")
    updateCountdown(headCountdown, headBreak)

    var nextCountdown = document.getElementById("next-countdown")
    updateCountdown(nextCountdown, nextBreak)

    window.requestAnimationFrame(updatePage)
}

function setupPage() {
    headBreak = getNextBreak()
    nextBreak = getNextBreak(headBreak.name)
    updatePage()
}
window.onload = setupPage;