const socket = io()

socket.on('countUpdated', (count) => {
	console.log('The count has been updated', count)
})

document.querySelector('#increement').addEventListener('click', () => {
	console.log('Clicked')
	socket.emit('increement')
})