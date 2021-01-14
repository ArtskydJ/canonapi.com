# [CanonAPI.com](https://www.canonapi.com/)

A simple public API to get passages of scripture.

## Usage

```js
fetch('https://www.canonapi.com/v1/genesis/1.json')
	.then(res => res.json())
	.then(verses => {
		console.log('Genesis 1:1 -- ' + verses[1])
		console.log(verses)
	})
// First console.log:
// Genesis 1:1 -- In the beginning, God created the heavens and the earth.

// Second console.log:
// [
//     null,
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


### Response

If everything goes to plan, you'll get a `200` status code.

It will have valid JSON array. The first element will be null. The remaining elements are strings with the verse's text.

The first element is null so verse numbers will be the same as the array index. `verses[1]` gets the first verse. But `verses.length` will be 1 too high.

<!-- Remove the extraneous null? Force API consumers to handle 1-based verses? -->

## License

[MIT](https://choosealicense.com/licenses/mit)
