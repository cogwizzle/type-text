import { describe, it, expect, vi, afterEach } from 'vitest'
import './index.js'

function mount(text, attrs = {}) {
  const el = document.createElement('type-text')
  el.textContent = text
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
  document.body.appendChild(el)
  return el
}

describe('TypeText', () => {
  let el

  afterEach(() => {
    el?.remove()
    vi.useRealTimers()
  })

  describe('typing', () => {
    it('types the first character synchronously on connect', () => {
      vi.useFakeTimers()
      el = mount('Hi')
      expect(el.innerText).toBe('H')
    })

    it('types one character per delay interval', () => {
      vi.useFakeTimers()
      el = mount('Hi')

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('Hi')
    })

    it('does nothing when mounted with no text content', () => {
      vi.useFakeTimers()
      el = mount('')

      vi.advanceTimersByTime(1000)
      expect(el.innerText).toBe('')
    })
  })

  describe('delay', () => {
    it('defaults to 100ms', () => {
      el = document.createElement('type-text')
      expect(el.delay).toBe(100)
    })

    it('respects the delay attribute set in html', () => {
      vi.useFakeTimers()
      el = mount('Hi', { delay: '200' })

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('H')

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('Hi')
    })

    it('delay setter takes effect for subsequent characters', () => {
      vi.useFakeTimers()
      el = document.createElement('type-text')
      el.textContent = 'Hi'
      el.delay = 200
      document.body.appendChild(el)

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('H')

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('Hi')
    })

    it('updating the delay attribute affects subsequently scheduled characters', () => {
      vi.useFakeTimers()
      el = mount('ABC')

      // 'A' typed synchronously; setTimeout for 'B' already queued at 100ms
      el.setAttribute('delay', '500')

      // The in-flight 100ms timer still fires and types 'B'
      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('AB')

      // 'C' is now on the 500ms delay
      vi.advanceTimersByTime(499)
      expect(el.innerText).toBe('AB')

      vi.advanceTimersByTime(1)
      expect(el.innerText).toBe('ABC')
    })
  })

  describe('paused', () => {
    it('does not start typing when the paused attribute is present', () => {
      vi.useFakeTimers()
      el = mount('Hi', { paused: '' })

      vi.advanceTimersByTime(1000)
      expect(el.innerText).toBe('')
    })

    it('play() starts typing when initially paused', () => {
      vi.useFakeTimers()
      el = mount('Hi', { paused: '' })

      el.play()
      expect(el.innerText).toBe('H')

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('Hi')
    })

    it('removing the paused attribute starts typing', () => {
      vi.useFakeTimers()
      el = mount('Hi', { paused: '' })

      el.removeAttribute('paused')
      expect(el.innerText).toBe('H')

      vi.advanceTimersByTime(100)
      expect(el.innerText).toBe('Hi')
    })

    it('pause() stops typing at the current character position', () => {
      vi.useFakeTimers()
      el = mount('Hello')

      expect(el.innerText).toBe('H')
      el.pause()

      vi.advanceTimersByTime(10000)
      expect(el.innerText).toBe('H')
    })
  })

  describe('events', () => {
    it('fires typing-start with the full text when typing begins', () => {
      el = document.createElement('type-text')
      el.textContent = 'Hi'

      const handler = vi.fn()
      el.addEventListener('typing-start', handler)
      document.body.appendChild(el)

      expect(handler).toHaveBeenCalledOnce()
      expect(handler.mock.calls[0][0].detail).toEqual({ text: 'Hi' })
    })

    it('fires typing-complete with the full text when all characters are typed', () => {
      vi.useFakeTimers()
      el = mount('Hi')

      const handler = vi.fn()
      el.addEventListener('typing-complete', handler)

      vi.advanceTimersByTime(200)

      expect(handler).toHaveBeenCalledOnce()
      expect(handler.mock.calls[0][0].detail).toEqual({ text: 'Hi' })
    })

    it('does not fire typing-start when mounted with no text', () => {
      el = document.createElement('type-text')
      const handler = vi.fn()
      el.addEventListener('typing-start', handler)
      document.body.appendChild(el)

      expect(handler).not.toHaveBeenCalled()
    })

    it('does not fire typing-start when mounted paused', () => {
      el = document.createElement('type-text')
      el.textContent = 'Hi'
      el.setAttribute('paused', '')
      const handler = vi.fn()
      el.addEventListener('typing-start', handler)
      document.body.appendChild(el)

      expect(handler).not.toHaveBeenCalled()
    })
  })
})
