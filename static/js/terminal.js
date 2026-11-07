// The terminal theme's script (linked deferred in footer.html, after the
// engine's app.js): code blocks and the contents of a long text.
//
// terminalCode - a behavior: every <pre> of a text (.node-content, a
// comment's .comment-body) goes into a .t-code figure with a head - the
// code's language and a copy button - and its code is highlighted when
// the language is one of LANGS. The language is the pre's or the code's
// data-lang / data-language, or their class language-<name> / lang-<name>
// (the editor's code sample). A block highlighted already (spans inside)
// keeps its markup.
//
// The contents - on a content page whose text (the first .node-content
// of article.node) has three headings h2-h3 or more, unless the theme's
// "toc" setting is off (data-toc="0" on <html>): a list of them before
// the text and at the top of the sidebar (terminal.css shows the one
// beside the text: the sidebar's on a wide screen); the heading being
// read is marked (aria-current). Headings without an id get one from
// their text.
(function () {
    'use strict';

    Kosatka.behaviors = Kosatka.behaviors || {};

    function escapeHTML(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function words(list) {
        return '\\b(?:' + list.trim().split(/\s+/).join('|') + ')\\b';
    }

    // The rules' pieces shared by the languages.
    var CLIKE_COMMENT = '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
    var DQ = '"(?:\\\\[\\s\\S]|[^"\\\\\\n])*"';
    var SQ = "'(?:\\\\[\\s\\S]|[^'\\\\\\n])*'";
    var BQ = '`(?:\\\\[\\s\\S]|[^`\\\\])*`';
    var NUMBER = '\\b(?:0[xX][\\da-fA-F_]+|0[bB][01_]+|\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b';
    var FUNC = '\\b[A-Za-z_$][\\w$]*(?=\\s*\\()';
    var HASH_COMMENT = '(?:^|[ \\t])#[^\\n]*';

    function clike(keywords, extra) {
        return [
            ['comment', CLIKE_COMMENT],
            ['string', DQ + '|' + SQ + '|' + BQ]
        ].concat(extra || []).concat([
            ['keyword', words(keywords)],
            ['number', NUMBER],
            ['func', FUNC]
        ]);
    }

    var JS_KEYWORDS = 'async await break case catch class const continue debugger default delete do else export extends false finally for from function get if import in instanceof let new null of return set static super switch this throw true try typeof undefined var void while with yield';
    var TS_KEYWORDS = JS_KEYWORDS + ' abstract any as boolean declare enum implements interface keyof namespace never number private protected public readonly string type unknown';

    // name: [the rules in order - a class and a pattern, flags].
    var LANGS = {
        js: [clike(JS_KEYWORDS)],
        ts: [clike(TS_KEYWORDS)],
        go: [clike('break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var nil true false iota any error string int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 float32 float64 bool byte rune make new len cap append copy delete panic recover')],
        php: [clike('abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile enum extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait true false try unset use var while yield self parent int float string bool void mixed never', [
            ['keyword', '<\\?php|\\?>'],
            ['comment', '#(?!\\[)[^\\n]*'],
            ['name', '\\$[A-Za-z_]\\w*']
        ])],
        java: [clike('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new null package private protected public record return short static super switch synchronized this throw throws transient true false try var void volatile while', [
            ['func', '@[A-Za-z_]\\w*']
        ])],
        c: [clike('auto bool break case char class const constexpr continue default delete do double else enum explicit extern false float for friend goto if inline int long namespace new nullptr operator private protected public register return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while', [
            ['keyword', '^[ \\t]*#[ \\t]*\\w+']
        ])],
        cs: [clike('abstract as async await base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly record ref return sbyte sealed short sizeof static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while')],
        rust: [clike('as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while i8 i16 i32 i64 u8 u16 u32 u64 f32 f64 usize isize bool char str String Vec Option Some None Result Ok Err')],
        kotlin: [clike('as break class continue do else false for fun if in interface is null object package return super this throw true try typealias val var when while by companion constructor data enum init internal lateinit open override private protected public sealed suspend')],
        swift: [clike('as associatedtype break case catch class continue default defer deinit do else enum extension fallthrough false fileprivate for func guard if import in init inout internal is let nil open operator private protocol public repeat rethrows return self Self static struct subscript super switch throw throws true try typealias var where while')],
        python: [[
            ['string', '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|[rbfu]{0,2}' + DQ + '|[rbfu]{0,2}' + SQ],
            ['comment', '#[^\\n]*'],
            ['func', '@[A-Za-z_][\\w.]*'],
            ['keyword', words('and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return self True try while with yield')],
            ['number', NUMBER],
            ['func', FUNC]
        ]],
        shell: [[
            ['comment', HASH_COMMENT],
            ['string', DQ + '|' + SQ],
            ['name', '\\$\\{[^}\\n]*\\}|\\$[A-Za-z_]\\w*|\\$[0-9@#?*!$-]'],
            ['keyword', words('if then else elif fi for while until do done case esac in function return export local readonly declare unset set source alias exit')],
            ['func', words('sudo cd echo printf cat ls cp mv rm mkdir rmdir touch chmod chown ln grep sed awk find xargs curl wget tar unzip zip ssh scp rsync git docker kubectl apt apt-get yum dnf brew pip npm npx yarn pnpm node go php composer python python3 make systemctl journalctl kill ps tail head less nano vim aws')],
            ['name', '(?:^|[ \\t])--?[A-Za-z][\\w-]*'],
            ['number', '\\b\\d+\\b']
        ], 'gm'],
        markup: [[
            ['comment', '<!--[\\s\\S]*?-->'],
            ['keyword', '<!DOCTYPE[^>]*>|<\\/?[A-Za-z][\\w:.-]*|\\/?>'],
            ['name', '[ \\t\\n][A-Za-z_:@][\\w:.-]*(?==)'],
            ['string', '"[^"]*"|\'[^\']*\'']
        ]],
        css: [[
            ['comment', '\\/\\*[\\s\\S]*?\\*\\/'],
            ['string', DQ + '|' + SQ],
            ['keyword', '@[\\w-]+|!important'],
            ['func', '[\\w-]+(?=\\()'],
            ['name', '[\\w-]+(?=\\s*:[^\\n;{]*;)|--[\\w-]+'],
            ['number', '#[\\da-fA-F]{3,8}\\b|-?\\b\\d*\\.?\\d+(?:px|em|rem|%|vh|vw|vmin|vmax|ch|fr|s|ms|deg)?\\b']
        ]],
        json: [[
            ['name', DQ + '(?=\\s*:)'],
            ['string', DQ],
            ['keyword', words('true false null')],
            ['number', '-?' + NUMBER]
        ]],
        yaml: [[
            ['comment', HASH_COMMENT],
            ['name', '^[ \\t-]*[\\w.$\\/-]+(?=[ \\t]*:(?:[ \\t]|$))'],
            ['string', DQ + '|' + SQ],
            ['keyword', words('true false null yes no on off') + '|~'],
            ['number', NUMBER]
        ], 'gm'],
        sql: [[
            ['comment', '--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/'],
            ['string', SQ + '|' + DQ + '|' + BQ],
            ['keyword', words('add all alter and as asc auto_increment between by cascade case check column constraint create database default delete desc distinct drop else end engine exists foreign from full group having if in index inner insert into is join key left like limit not null offset on or order outer primary references replace right select set table then truncate union unique update values view when where with int integer bigint smallint tinyint varchar char text datetime timestamp date boolean decimal float double serial')],
            ['func', FUNC],
            ['number', NUMBER]
        ], 'gi'],
        dockerfile: [[
            ['comment', '^[ \\t]*#[^\\n]*'],
            ['keyword', '^[ \\t]*' + words('from run cmd label maintainer expose env add copy entrypoint volume user workdir arg onbuild stopsignal healthcheck shell') + '|' + words('as')],
            ['string', DQ + '|' + SQ],
            ['name', '\\$\\{[^}\\n]*\\}|\\$[A-Za-z_]\\w*']
        ], 'gmi'],
        ini: [[
            ['comment', '^[ \\t]*[#;][^\\n]*'],
            ['keyword', '^[ \\t]*\\[[^\\]\\n]*\\]'],
            ['name', '^[ \\t]*[\\w.-]+(?=[ \\t]*=)'],
            ['string', DQ + '|' + SQ],
            ['number', NUMBER]
        ], 'gm'],
        diff: [[
            ['name', '^@@[^\\n]*'],
            ['string', '^\\+[^\\n]*'],
            ['keyword', '^-[^\\n]*'],
            ['comment', '^(?:diff|index|---|\\+\\+\\+)[^\\n]*']
        ], 'gm']
    };

    // The names a language goes by.
    var ALIASES = {
        javascript: 'js', jsx: 'js', mjs: 'js', cjs: 'js', node: 'js',
        typescript: 'ts', tsx: 'ts',
        golang: 'go',
        h: 'c', cpp: 'c', 'c++': 'c', cc: 'c', hpp: 'c', cxx: 'c',
        csharp: 'cs', 'c#': 'cs',
        rs: 'rust', kt: 'kotlin', py: 'python',
        bash: 'shell', sh: 'shell', zsh: 'shell', console: 'shell', terminal: 'shell', 'shell-session': 'shell', powershell: 'shell', ps1: 'shell',
        html: 'markup', xml: 'markup', svg: 'markup', vue: 'markup', xhtml: 'markup',
        scss: 'css', sass: 'css', less: 'css',
        json5: 'json', jsonc: 'json',
        yml: 'yaml',
        mysql: 'sql', pgsql: 'sql', postgresql: 'sql', postgres: 'sql', sqlite: 'sql',
        docker: 'dockerfile',
        toml: 'ini', env: 'ini', conf: 'ini', properties: 'ini', editorconfig: 'ini',
        patch: 'diff'
    };

    // Plain text: a label, nothing to highlight.
    var PLAIN = {text: true, plain: true, plaintext: true, txt: true, none: true, output: true};

    var compiled = {};

    function grammar(lang) {
        var key = ALIASES[lang] || lang;
        if (!LANGS[key]) return null;
        if (!compiled[key]) {
            var rules = LANGS[key][0];
            compiled[key] = {
                re: new RegExp(rules.map(function (r) { return '(' + r[1] + ')'; }).join('|'), LANGS[key][1] || 'g'),
                classes: rules.map(function (r) { return r[0]; })
            };
        }
        return compiled[key];
    }

    // highlight - the code's HTML: its text escaped, the tokens in spans.
    function highlight(code, g) {
        var out = '', last = 0, m;
        g.re.lastIndex = 0;
        while ((m = g.re.exec(code)) !== null) {
            if (m[0] === '') {
                g.re.lastIndex++;
                continue;
            }
            var i = 1;
            while (i < m.length && m[i] === undefined) i++;
            out += escapeHTML(code.slice(last, m.index)) +
                '<span class="t-tok-' + g.classes[i - 1] + '">' + escapeHTML(m[0]) + '</span>';
            last = m.index + m[0].length;
        }
        return out + escapeHTML(code.slice(last));
    }

    function languageOf(pre, code) {
        var els = [pre, code], i, el, m;
        for (i = 0; i < els.length; i++) {
            el = els[i];
            if (!el) continue;
            var attr = el.getAttribute('data-lang') || el.getAttribute('data-language');
            if (attr) return attr.trim().toLowerCase();
            m = /(?:^|\s)(?:language|lang)-([\w#+.-]+)/.exec(el.className || '');
            if (m) return m[1].toLowerCase();
        }
        return '';
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        // An address without https (a local site): the old way.
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            area.remove();
            if (ok) resolve(); else reject(new Error('copy'));
        });
    }

    Kosatka.behaviors.terminalCode = {
        attach: function (context) {
            Kosatka.once('terminal-code', '.node-content pre, .comment-body pre', context).forEach(function (pre) {
                if (pre.closest('.t-code')) return;
                var code = pre.querySelector('code');
                var lang = languageOf(pre, code);
                var g = lang && !PLAIN[lang] ? grammar(lang) : null;
                var target = code || pre;
                if (g && !target.querySelector('span')) {
                    target.innerHTML = highlight(target.textContent, g);
                }

                var figure = document.createElement('figure');
                figure.className = 't-code';
                var head = document.createElement('figcaption');
                head.className = 't-code-head';
                var label = document.createElement('span');
                label.className = 't-code-lang';
                label.textContent = lang;
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 't-code-copy';
                button.textContent = Kosatka.t('copy');
                button.addEventListener('click', function () {
                    copy(pre.innerText.replace(/\n$/, '')).then(function () {
                        button.textContent = Kosatka.t('copied');
                        button.classList.add('is-copied');
                        setTimeout(function () {
                            button.textContent = Kosatka.t('copy');
                            button.classList.remove('is-copied');
                        }, 1500);
                    }, function () {});
                });
                head.appendChild(label);
                head.appendChild(button);
                pre.parentNode.insertBefore(figure, pre);
                figure.appendChild(head);
                figure.appendChild(pre);
            });
        }
    };

    // slug - an id from a heading's text: letters and digits of any
    // script, the rest as "-".
    function slug(text) {
        var s = text.toLowerCase().trim();
        try {
            s = s.replace(new RegExp('[^\\p{L}\\p{N}]+', 'gu'), '-');
        } catch (e) {
            s = s.replace(/[^\wЀ-ӿ]+/g, '-');
        }
        return s.replace(/^-+|-+$/g, '') || 'section';
    }

    function contents() {
        if (document.documentElement.getAttribute('data-toc') === '0') return;
        var text = document.querySelector('article.node .node-content');
        if (!text) return;
        var headings = Array.prototype.slice.call(text.querySelectorAll('h2, h3'));
        if (headings.length < 3) return;

        var links = [], used = {};
        headings.forEach(function (h) {
            if (!h.id) {
                var id = slug(h.textContent), n = 2, base = id;
                while (used[id] || document.getElementById(id)) id = base + '-' + n++;
                h.id = id;
            }
            used[h.id] = true;
            links.push({heading: h, links: []});
        });

        // build - the contents' <nav>: the h3 under their h2.
        function build(className) {
            var nav = document.createElement('nav');
            nav.className = 't-toc ' + className;
            nav.setAttribute('aria-label', Kosatka.t('Contents'));
            var title = document.createElement('h2');
            title.className = 't-toc-title';
            title.textContent = Kosatka.t('contents');
            nav.appendChild(title);
            var list = document.createElement('ol'), sub = null;
            nav.appendChild(list);
            links.forEach(function (l) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = '#' + encodeURIComponent(l.heading.id);
                a.textContent = l.heading.textContent.trim();
                li.appendChild(a);
                l.links.push(a);
                if (l.heading.tagName === 'H3' && list.lastElementChild) {
                    if (!sub || sub.parentNode !== list.lastElementChild) {
                        sub = document.createElement('ol');
                        list.lastElementChild.appendChild(sub);
                    }
                    sub.appendChild(li);
                } else {
                    list.appendChild(li);
                    sub = null;
                }
            });
            return nav;
        }

        // Before the text always (shown where the sidebar is under the
        // content: terminal.css), and at the top of the sidebar.
        var field = text.closest('.dynamic-field') || text;
        var sidebar = document.querySelector('section.sidebar') || document.querySelector('.sidebar');
        field.parentNode.insertBefore(build(sidebar ? 't-toc-inline' : 't-toc-only'), field);
        if (sidebar) sidebar.insertBefore(build('t-toc-side'), sidebar.firstChild);

        // The heading being read: the last one above the top quarter of
        // the window.
        if (!('IntersectionObserver' in window)) return;
        var current = null;
        function mark() {
            var line = window.innerHeight / 4, active = links[0];
            links.forEach(function (l) {
                if (l.heading.getBoundingClientRect().top <= line) active = l;
            });
            if (active === current) return;
            if (current) current.links.forEach(function (a) { a.removeAttribute('aria-current'); });
            active.links.forEach(function (a) { a.setAttribute('aria-current', 'true'); });
            current = active;
        }
        var io = new IntersectionObserver(mark, {rootMargin: '0px 0px -75% 0px'});
        links.forEach(function (l) { io.observe(l.heading); });
        mark();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', contents);
    } else {
        contents();
    }
})();
