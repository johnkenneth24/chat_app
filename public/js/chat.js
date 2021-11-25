const socket = io()

//element

const $messageForm = document.querySelector('#message_form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')


socket.on('message', (message) => {
	console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault()


	$messageFormButton.setAttribute('disabled', 'disabled')
	

	const message = e.target.elements.message.value

	socket.emit('sendMessage', message, (error) => {
		$messageFormButton.removeAttribute('disabled')
		$messageFormInput.value = ''
		$messageFormInput.focus()
 
 
		if (error) {
			return console.log(error)
		}

		console.log('Message delivered!')
	})

})


document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation){
		return alert('Geolocation is not supported by your browser.')
	}

	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position)
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {

			console.log('Location shared!')
		})
	})
})