/**
 * Custom element that slowly types out the text content of the element, one character at a time.
 *
 * @example
 * ```html
 * <!-Basic usage-->
 * <type-text>Hello, world!</type-text>
 *
 * <!--Sets the delay value-->
 * <type-text delay="200">Hello, world!</type-text>
 *
 * <!--Waits until unpaused before typing-->
 * <type-text paused>Hello, world!</type-text>
 * ```
 *
 * @fires {CustomEvent<{text: string}>} typing-start - Fired when typing begins.
 * @fires {CustomEvent<{text: string}>} typing-complete - Fired when all text has been typed.
 */
class TypeText extends HTMLElement {
  /** @type {number} */
  #delay = 100
  /** @type {boolean} */
  #isPaused = false
  /** @type {string} */
  #writtenText = ""
  /** @type {string} */
  #remainingText = ""

  static observedAttributes = ['delay', 'paused']

  connectedCallback() {
    const delay = this.getAttribute('delay')
    if (delay !== null) this.#delay = Number(delay)
    this.#isPaused = this.hasAttribute('paused')
    this.#render()
  }

  /**
   * Updates `#delay` when the `delay` attribute changes, or toggles paused state when the `paused` attribute is added or removed.
   * @param {string} name
   * @param {string | null} _oldValue
   * @param {string | null} newValue
   * @returns {void}
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'delay') {
      this.#delay = Number(newValue)
    }
    if (name === 'paused') {
      newValue !== null ? this.pause() : this.play()
    }
  }

  /**
   * Sets the delay in milliseconds between each typed character.
   * @param {number} delay
   */
  set delay(delay) {
    this.#delay = delay;
  }

  /**
   * Gets the delay in milliseconds between each typed character.
   * @returns {number}
   */
  get delay() {
    return this.#delay;
  }

  /**
   * Pauses typing at the current character position.
   * @returns {void}
   */
  pause() {
    this.#isPaused = true;
  }

  /**
   * Resumes typing from the current character position.
   * @returns {void}
   */
  play() {
    this.#isPaused = false;
    this.#writeText()
  }

  /**
   * Advances typing by one character and schedules the next character until all text has been typed.
   * @returns {void}
   */
  #writeText() {
    if (this.#isPaused) return;
    if (this.#remainingText.length === 0) {
      this.dispatchEvent(new CustomEvent('typing-complete', { detail: { text: this.#writtenText } }));
      return;
    }
    const nextCharacter = this.#remainingText[0];
    this.#writtenText = this.#writtenText + nextCharacter;
    this.#remainingText = this.#remainingText.slice(1);
    this.innerText = this.#writtenText;
    setTimeout(() => this.#writeText(), this.#delay);
  }

  /**
   * Dispatches the `typing-start` event and begins typing.
   * @returns {void}
   */
  #write() {
    const text = this.#remainingText;
    this.dispatchEvent(new CustomEvent('typing-start', { detail: { text } }));
    this.#writeText();
  }

  /**
   * Captures the element's initial text content and starts typing if not paused.
   * @returns {void}
   */
  #render() {
    this.#remainingText = this.innerText;
    this.innerText = ""
    if (!this.#remainingText) return;
    if (!this.#isPaused) {
      this.#write()
    }
  }
}

if (!customElements.get('type-text')) {
  customElements.define('type-text', TypeText);
}
