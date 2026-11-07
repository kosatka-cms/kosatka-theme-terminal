# Terminal

A theme for [Kosatka](https://github.com/kosatka-cms/kosatka): a
technical blog in a terminal. A prompt in the header, monospace
headings, dates and tags, lists in rows divided by dashed lines, code
blocks with highlighting, their language and a copy button, the contents
of a long text beside it. A palette of colours, a dark and a light
scheme.

![Terminal](https://raw.githubusercontent.com/kosatka-cms/kosatka-theme-terminal/main/static/screenshot.jpg)

## Install

```bash
app theme add https://github.com/kosatka-cms/kosatka-theme-terminal
```

Then commit `themes/` and choose *Terminal* on *Appearance*. See
[Distributing a theme](https://kosatka-cms.github.io/kosatka/themes/distribute/).

## Settings

On *Appearance → Terminal → Settings*:

| Setting | Default |
|---|---|
| Palette - amber, green phosphor, ice or rose | amber |
| Colour scheme by default - dark, light, or as on the visitor's device | dark |
| The text's font - proportional or monospace | proportional |
| The header's prompt | the site's name |
| The contents of a text with three headings or more | on |
| Logging in and registration in the header | on |

A visitor switches the scheme with the button in the header; the choice
is kept in the browser.

## Code

A `<pre>` in a text gets a head with its language and a copy button. The
language comes from the `class` of the `<pre>` or its `<code>`
(`language-php`, `lang-php` - what the editor's code sample writes) or
from a `data-lang` attribute. These languages are highlighted: JavaScript,
TypeScript, Go, PHP, Java, C and C++, C#, Rust, Kotlin, Swift, Python,
shell, HTML and XML, CSS, JSON, YAML, SQL, Dockerfile, INI and TOML, diff.
Another language gets its label without highlighting.

The text format of such texts keeps `pre` and `code`, and the `class`
attribute for the language (*Configuration → Text formats*).

## Regions

The engine's regions - *Header*, *Sidebar*, *Content top*, *Content
bottom*, *Inside content*, *Footer*, *Footer bottom line* - so blocks
placed for another theme stay where they are. A new site gets the
copyright block in *Footer bottom line*. A block's title in the sidebar
is shown as a command: `> title`.

## Translations

The theme's own strings: English, Russian, German and Spanish
(`translations/`).

## License

MIT
