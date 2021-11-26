const socket = io()

//element

const $messageForm = document.querySelector('#message_form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplateLocation = document.querySelector('#location-message-template').innerHTML


//option

const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {
	console.log(message)
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm A')
	})
	$messages.insertAdjacentHTML('beforeend', html)

})


socket.on('locationMessage', (message) => {
	console.log(message)
	const html = Mustache.render(messageTemplateLocation, {
		url: message.url,
		createdAt: moment(message.createdAt).format('h:mm A')
	})

	$messages.insertAdjacentHTML('beforeend', html)
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


$sendLocationBtn.addEventListener('click', () => {
	if (!navigator.geolocation){
		return alert('Geolocation is not supported by your browser.')
	}


	$sendLocationBtn.setAttribute('disabled', 'disabled')

	navigator.geolocation.getCurrentPosition((position) => {
		console.log(position)
		socket.emit('sendLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			$sendLocationBtn.removeAttribute('disabled')
			console.log('Location shared!')
		})
	})
})


socket.emit('join', { username, room })