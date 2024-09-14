export function calculateMinReadTime(paragraphs) {
	const wordsPerMinute = 200 // Rata-rata kata per menit
	const totalWords = paragraphs.reduce(
		(acc, paragraph) => acc + paragraph.split(" ").length,
		0
	)
	const minReadTime = Math.ceil(totalWords / wordsPerMinute) // Waktu baca minimum dalam menit
	return minReadTime
}
