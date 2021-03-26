// BELOW IS AUTOGENERATED. DO NOT ALTER //
const books_names = [
	[ 'Genesis', 'Gen' ],
	[ 'Exodus', 'Exod', 'Ex', 'Exo' ],
	[ 'Leviticus', 'Lev' ],
	[ 'Numbers', 'Num' ],
	[ 'Deuteronomy', 'Deut' ],
	[ 'Joshua', 'Josh' ],
	[ 'Judges', 'Judg' ],
	[ 'Ruth' ],
	[ '1 Samuel', '1 Sam', '1st Sam', '1st Samuel', 'First Samuel' ],
	[ '2 Samuel', '2 Sam', '2nd Sam', '2nd Samuel', 'Second Samuel' ],
	[ '1 Kings', '1 Kgs', '1st Kgs', '1st Kings', 'First Kings' ],
	[ '2 Kings', '2 Kgs', '2nd Kgs', '2nd Kings', 'Second Kings' ],
	[ '1 Chronicles', '1 Chr', '1st Chr', '1st Chronicles', 'First Chronicles' ],
	[ '2 Chronicles', '2 Chr', '2nd Chr', '2nd Chronicles', 'Second Chronicles' ],
	[ 'Ezra', 'Ezra' ],
	[ 'Nehemiah', 'Neh' ],
	[ 'Esther', 'Esth', 'Est' ],
	[ 'Job' ],
	[ 'Psalms', 'Ps', 'Psalm' ],
	[ 'Proverbs', 'Prov', 'Pro' ],
	[ 'Ecclesiastes', 'Eccl', 'Ecc' ],
	[ 'Song of Solomon', 'Song', 'Song of Songs' ],
	[ 'Isaiah', 'Isa' ],
	[ 'Jeremiah', 'Jer' ],
	[ 'Lamentations', 'Lam' ],
	[ 'Ezekiel', 'Ezek' ],
	[ 'Daniel', 'Dan' ],
	[ 'Hosea', 'Hos' ],
	[ 'Joel' ],
	[ 'Amos' ],
	[ 'Obadiah', 'Obad', 'Oba' ],
	[ 'Jonah', 'Jon' ],
	[ 'Micah', 'Mic' ],
	[ 'Nahum', 'Nah' ],
	[ 'Habakkuk', 'Hab' ],
	[ 'Zephaniah', 'Zeph' ],
	[ 'Haggai', 'Hag' ],
	[ 'Zechariah', 'Zech' ],
	[ 'Malachi', 'Mal' ],
	[ 'Matthew', 'Matt' ],
	[ 'Mark' ],
	[ 'Luke' ],
	[ 'John' ],
	[ 'Acts' ],
	[ 'Romans', 'Rom' ],
	[ '1 Corinthians', '1 Cor', '1st Cor', '1st Corinthians', 'First Corinthians' ],
	[ '2 Corinthians', '2 Cor', '2nd Cor', '2nd Corinthians', 'Second Corinthians' ],
	[ 'Galatians', 'Gal' ],
	[ 'Ephesians', 'Eph' ],
	[ 'Philippians', 'Phil' ],
	[ 'Colossians', 'Col' ],
	[ '1 Thessalonians', '1 Thess', '1st Thess', '1st Thessalonians', 'First Thessalonians' ],
	[ '2 Thessalonians', '2 Thess', '2nd Thess', '2nd Thessalonians', 'Second Thessalonians' ],
	[ '1 Timothy', '1 Tim', '1st Tim', '1st Timothy', 'First Timothy' ],
	[ '2 Timothy', '2 Tim', '2nd Tim', '2nd Timothy', 'Second Timothy' ],
	[ 'Titus' ],
	[ 'Philemon', 'Phlm' ],
	[ 'Hebrews', 'Heb' ],
	[ 'James', 'Jas' ],
	[ '1 Peter', '1 Pet', '1st Pet', '1st Peter', 'First Peter' ],
	[ '2 Peter', '2 Pet', '2nd Pet', '2nd Peter', 'Second Peter' ],
	[ '1 John', '1st John', 'First John' ],
	[ '2 John', '2nd John', 'Second John' ],
	[ '3 John', '3rd John', 'Third John' ],
	[ 'Jude' ],
	[ 'Revelation', 'Rev' ]
]
// ABOVE IS AUTOGENERATED. DO NOT ALTER //

fetch('https://artskydj.github.io/lookup-multiple-bible-verses/bible_text/last_update.json')
	.then(res => res.text())
	.then(last_update => {
		const cached_version = localStorage.getItem('last_update')
		if (cached_version !== last_update) {
			localStorage.clear()
			localStorage.setItem('last_update', last_update)
			console.log(`cleared cache`)
		} else {
			console.log(`keeping cache`)
		}
	})

function normalize(book) {
	return book.toLowerCase().replace(/ /g, '').trim()
}

function fetch_cached(book, chapter) {
	const normalized_book = normalize(book)
	const book_name = books_names.find(book_names => book_names.map(normalize).includes(normalized_book))?.[0]

	if (book_name) {
		const key = normalize(book_name) + chapter
		const cached = localStorage.getItem(key)
		if (cached) {
			return Promise.resolve({ // THESE SHOULD MATCH
				verses: JSON.parse(cached),
				book_name,
			})
		}
		return fetch(`https://artskydj.github.io/lookup-multiple-bible-verses/bible_text/${normalize(book_name)}/${chapter}.json`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`Invalid chapter: ${book_name} ${chapter}`)
				}
				return res.text()
			})
			.then(text => {
				localStorage.setItem(key, text)
				return { // THESE SHOULD MATCH
					verses: JSON.parse(text),
					book_name,
				}
			})
	}
	return Promise.reject(new Error(`Invalid book: ${book}`))
}

const textarea = document.querySelector('textarea')
const output = document.querySelector('div.output')

function refresh() {
	Promise.all(
		textarea.value
			.split('\n')
			.filter(ref => ref.trim())
			.map(ref => {
				const matches = /(\d*\s*\w+)\s*(\d+)\D+(\d+)(?:\D+(\d+))?/.exec(ref)
				if (matches) {
					const [ , book, chapter, start_verse, end_verse ] = matches.map(match => isNaN(Number(match)) ? match : Number(match))
					return fetch_cached(book, chapter)
						.then(({ verses, book_name }) => {
							const slice_end = (end_verse || start_verse) + 1
							const pretty_ref = `${book_name} ${chapter}:${start_verse + (end_verse ? '-' + end_verse : '')}`
							const text = verses.slice(start_verse, slice_end).join('')
							return `<span class="verse"><span class="ref">${pretty_ref}</span>${text}</span>`
						})
						.catch(e => `<span class="err">${e.message}</span>`)
				}
			})
	).then(html => output.innerHTML = html.filter(Boolean).join(''))
}

textarea.oninput = refresh

refresh()