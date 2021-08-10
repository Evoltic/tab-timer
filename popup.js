const form = document.querySelector('.form')
const stopButton = document.querySelector('.stop-button')
const input = document.querySelector('.input')
const indicator = document.querySelector('.indicator')

function clearIndicatorUI() {
	indicator.innerHTML = ``
}

function updateIndicatorUI(timeLeft) {
	let minutes = Math.floor(timeLeft / (1000 * 60))
	let seconds = Math.floor((timeLeft / 1000) % 60)

	minutes = (minutes < 10) ? "0" + minutes : minutes
	seconds = (seconds < 10) ? "0" + seconds : seconds

	indicator.innerHTML = `${minutes + ":" + seconds}`
}

function handleStop(e) {
	e.preventDefault()
	chrome.runtime.sendMessage({ method: "stop", data: input.value })
}

function handleSubmit(e) {
	e.preventDefault()
	chrome.runtime.sendMessage({ method: "start", data: input.value })
}

form.addEventListener('submit', handleSubmit)
stopButton.addEventListener('click', handleStop)

chrome.runtime.onMessage.addListener(({ method, data }) => {
	if (method === 'updateIndicatorUI') updateIndicatorUI(data)
	if (method === 'clearIndicatorUI') clearIndicatorUI()
})