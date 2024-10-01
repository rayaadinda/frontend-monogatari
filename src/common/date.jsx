let months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]

export const getDay = (timestamp) => {
	const now = new Date()
	const date = new Date(timestamp)
	const diff = now.getTime() - date.getTime()
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) {
		return `${date.getDate()} ${months[date.getMonth()]}`
	} else if (hours > 0) {
		return `${hours}h`
	} else if (minutes > 0) {
		return `${minutes}m`
	} else {
		return `${seconds}s`
	}
}
