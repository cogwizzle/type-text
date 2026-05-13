# type-text

A web component that animates text content as if it is being typed one character at a time.

## Installation

```bash
npm install type-text
```

## Usage

Import the module to register the custom element, then use `<type-text>` anywhere in your HTML.

```html
<script type="module" src="node_modules/type-text/src/index.js"></script>

<type-text>Hello, world!</type-text>
```

Or import it in JavaScript:

```js
import 'type-text';
```

## Attributes

| Attribute | Type   | Default | Description                                      |
|-----------|--------|---------|--------------------------------------------------|
| `delay`   | number | `100`   | Milliseconds between each typed character.       |
| `paused`  | boolean | —      | If present, typing will not start until `play()` is called. |

```html
<!-- Slow down the typing speed -->
<type-text delay="200">Hello, world!</type-text>

<!-- Start paused and trigger play() manually -->
<type-text paused>Hello, world!</type-text>
```

## Properties

| Property | Type   | Description                                |
|----------|--------|--------------------------------------------|
| `delay`  | number | Gets or sets the delay between characters. |

## Methods

| Method    | Description                                           |
|-----------|-------------------------------------------------------|
| `pause()` | Pauses typing at the current character position.      |
| `play()`  | Resumes typing from the current character position.   |

```js
const el = document.querySelector('type-text');

el.pause();
el.play();
```

## Events

| Event             | Detail                  | Description                          |
|-------------------|-------------------------|--------------------------------------|
| `typing-start`    | `{ text: string }`      | Fired when typing begins.            |
| `typing-complete` | `{ text: string }`      | Fired when all text has been typed.  |

```js
const el = document.querySelector('type-text');

el.addEventListener('typing-start', (e) => {
  console.log('Started typing:', e.detail.text);
});

el.addEventListener('typing-complete', (e) => {
  console.log('Finished typing:', e.detail.text);
});
```

## License

MIT
