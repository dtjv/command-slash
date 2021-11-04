# Command Slash <kbd>⌘</kbd><kbd>/</kbd>

A super simple React-based command palette from within a text field.

> This project is for demonstration purposes only.

### [View demo](https://dtjv.io/command-slash)

## About

This demo displays a text field in which users can freely type. The following
featues are available while the text field has focus.

### Features

- Use <kbd>⌘</kbd><kbd>/</kbd> to toggle display of menu command
- Run a command via point-and-click or via the keyboard
  (<kbd>↑</kbd><kbd>↓</kbd> + <kbd>Enter</kbd>).
- With the command menu displayed, continue typing to filter commands displayed.
- Hit <kbd>Esc</kbd> to close menu
- Available commands in this demo:
  - **Insert 🎃** → Insert a pumpkin emoji in the current location
  - **Say Hi!** → Show an alert box that displays "Hi!"
  - **Delete Text** → Delete all the text in the text field

## Development

### Environment

- Node >= v17
- Yarn v1.22.17 _(optional)_

### Get Started

Once the project is cloned to your local machine:

```sh
$ yarn # or npm i
$ yarn dev
```

Navigate to `http://localhost:1234`.

## Author

- [David Valles](https://dtjv.io)

## License

[MIT License](LICENSE)
