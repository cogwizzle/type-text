/**
 * Custom element that slowly types out the text content of the element, one character at a time.
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <type-text>Hello, world!</type-text>
 *
 * <!-- Sets the delay value -->
 * <type-text delay="200">Hello, world!</type-text>
 *
 * <!-- Waits until unpaused before typing -->
 * <type-text paused>Hello, world!</type-text>
 * ```
 *
 * @fires {CustomEvent<{text: string}>} typing-start - Fired when typing begins.
 * @fires {CustomEvent<{text: string}>} typing-complete - Fired when all text has been typed.
 */
export declare class TypeText extends HTMLElement {
  /** Delay in milliseconds between each typed character. Defaults to `100`. */
  delay: number;

  /** Pauses typing at the current character position. */
  pause(): void;

  /** Resumes typing from the current character position. */
  play(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'type-text': TypeText;
  }
}
