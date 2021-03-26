# [CanonAPI.com](https://www.canonapi.com/)

A simple public API to get passages of scripture.

## Usage

```js
fetch('https://www.canonapi.com/v1/genesis/1.json')
	.then(res => res.json())
	.then(verses => {
		console.log('Genesis 1:1 -- ' + verses[0])
		console.log(verses)
	})
// First console.log:
// Genesis 1:1 -- In the beginning, God created the heavens and the earth.

// Second console.log:
// [
//     "In the beginning, God created the heavens and the earth.  ",
//     "The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters. ",
//     "God said, “Let there be light,” and there was light.  ",
// ...
// ]
```

### Request

#### `GET https://www.canonapi.com/v1/[BOOK]/[CHAPTER].json`

If `[BOOK]` or `[CHAPTER]` don't match, you'll get a `404` status code.

##### `[BOOK]`

`[BOOK]` must be lowercase, with the spaces removed. For example:
	- `genesis`
	- `1samuel`
	- `psalms`
	- `songofsolomon`
	- `lamentations`
	- `acts`
	- `3john`

##### `[CHAPTER]`

`[CHAPTER]` is a number from 1 to the maximum number of chapters in that book.

Chapters are 1-indexed.


### Response

If everything goes to plan, you'll get a `200` status code.

It will have valid JSON array, with each element being a string of the verse's text.

Verses are 0-indexed. `verses[0]` gets verse 1. Watch out for off-by-one errors in the verses!


## Client

There is a browser-ready client:
```html
<script src="https://www.canonapi.com/v1client.js"></script>
<script>
	window.canonapiv1client('genesis', 1).then(({ verses, bookName }) => {
		console.log(verses[0]) // 'In the beginning...'
		console.log(verses) // [ 'In the beginning...', ... ]
		console.log(bookName) // 'Genesis'
	})
</script>
```

## License

[MIT](https://choosealicense.com/licenses/mit)
