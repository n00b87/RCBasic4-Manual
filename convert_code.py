import tkinter as tk
from tkinter.scrolledtext import ScrolledText
import re
import keywords


class CodeHighlighter:

    def __init__(self):

        self.root = tk.Tk()
        self.root.title("RCBasic Code → HTML Converter")
        self.root.geometry("900x600")
        self.root.state("zoomed")

        # editor
        self.editor = ScrolledText(self.root, font=("Consolas",12), bg="#2d3335", fg="white", insertbackground="white")
        self.editor.pack(fill="both", expand=True)

        # button
        tk.Button(self.root, text="Convert to HTML", command=self.convert).pack()

        # exit
        self.output = ScrolledText(self.root, height=10)
        self.output.pack(fill="x")

        self.keywords = keywords.kw

        self.keys = keywords.keys

        self.editor.bind("<KeyRelease>", self.highlight_all)

        # --- compile regex once ---
        self.patterns = {
            "comment": re.compile(r"'.*"),
            "string": re.compile(r'".*?"'),
            "keyword": re.compile(rf"\b({'|'.join(self.keywords)})\b"),
            "number": re.compile(r"\b\d+\b"),
            "symbol": re.compile(r"[+\-*/=(){}\[\];:,<>$.]"),
            "key": re.compile(rf"\b({'|'.join(self.keys)})\b")
        }

        # --- styles ---
        self.styles = {
            "keyword":{"foreground":"#6084a8"},
            "number":{"foreground":"#0b9898"},
            "string":{"foreground":"#dd4040"},
            "comment":{"foreground":"#6e716e"},
            "symbol":{"foreground":"#ffbb00"},
            "key":{"foreground":"#258bff"}
        }

        # apply styles only once
        for tag,style in self.styles.items():
            self.editor.tag_config(tag, **style)

        self.root.mainloop()

    # ---------------- HIGHLIGHT ----------------

    def highlight_all(self, e=None):

        editor = self.editor

        start = "1.0"
        end = "end-1c"

        text = editor.get(start, end)

        # limpiar todo
        for tag in self.patterns:
            editor.tag_remove(tag, start, end)

        lines = text.split("\n")

        for i, line_text in enumerate(lines, start=1):

            protected = []

            # comments
            for m in self.patterns["comment"].finditer(line_text):

                s = f"{i}.{m.start()}"
                e = f"{i}.{m.end()}"

                protected.append((m.start(), m.end()))

                editor.tag_add("comment", s, e)

            # strings
            for m in self.patterns["string"].finditer(line_text):

                s = f"{i}.{m.start()}"
                e = f"{i}.{m.end()}"

                protected.append((m.start(), m.end()))

                editor.tag_add("string", s, e)

            def is_protected(pos):
                for a,b in protected:
                    if a <= pos < b:
                        return True
                return False

            for tag in ("keyword","number","symbol","key"):

                for m in self.patterns[tag].finditer(line_text):

                    if is_protected(m.start()):
                        continue

                    s = f"{i}.{m.start()}"
                    e = f"{i}.{m.end()}"

                    editor.tag_add(tag, s, e)


    # ---------------- TEXT -> HTML ----------------

    def text_to_html(self):

        MAP = {
            "keyword":"rc_keyword",
            "number":"rc_number",
            "string":"rc_string",
            "comment":"rc_comment",
            "symbol":"rc_symbol",
            "key":"rc_key"
        }

        PRIORITY = ["comment","string","number","keyword","symbol","key"]

        html = ""
        current = None
        i = "1.0"

        while i != self.editor.index("end-1c"):

            ch = self.editor.get(i)
            tags = self.editor.tag_names(i)

            tag = None
            for p in PRIORITY:
                if p in tags:
                    tag = p
                    break

            if tag != current:

                if current:
                    html += "</span>"

                if tag:
                    html += f"<span class='{MAP[tag]}'>"

                current = tag

            if ch == "\n":
                html += "<br>"
            else:
                html += (
                    ch.replace("&","&amp;")
                      .replace("<","&lt;")
                      .replace(">","&gt;")
                )

            i = self.editor.index(f"{i}+1c")

        if current:
            html += "</span>"

        return html


    # ---------------- CONVERT ----------------

    def convert(self):

        html = f"<pre>{self.text_to_html()}</pre>"

        self.output.delete("1.0","end")
        self.output.insert("1.0", html)

        self.root.clipboard_clear()
        self.root.clipboard_append(html)


if __name__ == "__main__":
    CodeHighlighter()