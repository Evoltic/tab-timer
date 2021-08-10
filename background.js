function openNewEmptyTab() {
  window.open("", "_blank")
}

let timer1Id
function updateIndicator(timeLeft) {
	const startedAt = Date.now()
	clearTimeout(timer1Id)

	if (timeLeft <= 0) {
		return chrome.runtime.sendMessage({ method: "clearIndicatorUI" })
	} else {
		chrome.runtime.sendMessage({ method: "updateIndicatorUI", data: timeLeft })
	}

	timer1Id = setTimeout(() => {
		const difference = Date.now() - startedAt
		updateIndicator(timeLeft - difference)
	}, 100)
}

let timer2Id
function startTimer(minutes, callback) {
  clearTimeout(timer2Id)

  const minutesInMs = minutes * 60 * 1000
  timer2Id = setTimeout(callback, minutesInMs)
	updateIndicator(minutesInMs)
}

let minutes = 3
function start(value) {
  minutes = value ? value : minutes
  startTimer(minutes, openNewEmptyTab)
}

function stop() {
	clearTimeout(timer1Id)
	clearTimeout(timer2Id)
	chrome.runtime.sendMessage({ method: "clearIndicatorUI" })
}

chrome.runtime.onMessage.addListener(({ method, data }) => {
  if (method === "start") start(data)
  if (method === "stop") stop()
})