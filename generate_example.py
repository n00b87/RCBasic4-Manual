from tkinter import *
from tkinter.scrolledtext import ScrolledText
from tkinter import filedialog
from PIL import Image, ImageTk
import shutil
import keywords
import re
import os

class CodeHighlighter:
	def __init__(self, root):
		self.root = root

		# editor
		self.editor = ScrolledText(self.root, font=("Consolas",12), bg="#2d3335", fg="white", insertbackground="white")
		self.editor.pack(padx=10, pady=10, fill="x")
		self.editor.config(tabs=(30))

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

					s = f"{i}.{m.start()}".lower()
					e = f"{i}.{m.end()}".lower()

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

		self.root.clipboard_clear()
		self.root.clipboard_append(html)


class window:
	def __init__(self):
		self.root = Tk()
		self.root.state("zoomed")
		self.root.config(bg="#213a63")

		self.file_name = ""
		self.img = ""
		self.path_html = "C:\\Users\\Xelmo\\OneDrive\\Desktop\\Pag RCBasic\\html_example".replace("\\", "/")
		self.path_folder_img = "C:\\Users\\Xelmo\\OneDrive\\Desktop\\Pag RCBasic\\example_img".replace("\\", "/")
		self.path_assets = "C:\\Users\\Xelmo\\OneDrive\\Desktop\\Pag RCBasic\\assets_example".replace("\\", "/")
		self.extend_zip = "zip"
		self.img_path = ""
		self.path_enlaces = "C:\\Users\\Xelmo\\OneDrive\\Desktop\\Pag RCBasic\\html file\\examples.html".replace("\\", "/")

		self.UI()
		self.code = CodeHighlighter(self.root)

		self.root.mainloop()
		

	def UI(self):
		self.change_name = Entry(self.root, font=("Arial", 16), justify="center")
		self.change_name.pack(pady=10)
		
		self.img_view = Label(self.root, bg="#213a63")
		self.img_view.pack()


		self.fold_name = ""

		load_img = Button(self.root, text="LOAD IMAGE", bg="#0867cc", fg="white", font=("Arial", 16), command=self.load_img)
		load_img.pack(pady=10, padx=20, fill="x")

		load_img = Button(self.root, text="LOAD FOLDER OF ASSETS", bg="#cc6708", fg="white", font=("Arial", 16), command=self.load_assets)
		load_img.pack(pady=10, padx=20, fill="x")

		save_btn = Button(self.root, text="SAVE", bg="#0fbd1b", fg="white", font=("Arial", 16), command=self.save)
		save_btn.pack(pady=10, fill="x", padx=20)

	def save(self):
		text_ = self.change_name.get()
		code = self.code.text_to_html()
		path = ""

		if self.fold_name:
			archive = shutil.make_archive(self.fold_name, self.extend_zip, self.fold_path)
			path = os.path.join(self.fold_path, self.fold_name+".zip")
			shutil.copy2(archive, self.path_assets)
		
		if not self.img_path.strip() == "":
			shutil.copy(self.img_path, self.path_folder_img+"/"+text_+".png")
		if self.file_name.strip() == "":
			with open(self.path_html+"/" + text_ + ".html", "w", encoding="utf-8") as file:
				source_html = f'''<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Examples | RCBasic</title>

<link rel="stylesheet" href="../css file/style_example.css">

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
</head>


<body>

<header class="header">

<div class="nav-container">

<div class="logo">
	<a href="home.html"><img src="../assets/banner.png"></a>
</div>

<nav class="nav">
	<a href="home.html">Home</a>
	<a href="download">Download</a>
	<a href="../rcbasic_docs/docs/build/html/index.html">Docs</a>
	<a href="https://rcbasic.freeforums.net/">Community</a>
</nav>

</div>
</header>

<main class="container-body">

<h1>{text_}</h1>

<div class="download-box">
	<img src="{self.path_folder_img + "/" + text_ + ".png"}"><br><br>
	<a href="../assets_example/beast_media.zip" download class="assets-download"><img src="../assets/icon/carpeta.png" width="32" height="32"> Download assets</a>
	<pre class="language-basic"><button class="copy-btn" onclick="copyCode(this)">
    <img src="../assets/icon/copy-icon.png" width="16" height="16">
  </button><code id="my-code">{code}</code></pre>
</div>
</main>

<footer class="footer">

<div class="footer-container">

<div class="footer-logo">
<img src="../assets/banner.png">
<p>RCBasic Studio — Create games and applications easily.</p>
</div>

<div class="footer-links">

<div class="footer-section">
<h4>Website</h4>
<a href="home.html">Home</a>
<a href="../rcbasic_docs/docs/build/html/index.html">Docs</a>
<a href="https://rcbasic.freeforums.net/">Community</a>
</div>

<!-- <div class="footer-section">
<h4>Resources</h4>
<a href="#">Tutorials</a>
<a href="#">Examples</a>
<a href="#">Manual</a>
</div> -->

<!-- <div class="footer-section">
<h4>Project</h4>
<a href="#">GitHub</a>
<a href="#">Issues</a>
<a href="#">Contribute</a>
</div> -->

</div>

</div>

<div class="footer-bottom">
<p>© 2026 RCBasic Studio. All rights reserved.</p>
</div>

</footer>
<script src="../js file/copy-code.js"></script>
</body>
</html>'''

				file.write(source_html)

	def load_img(self):
		self.img_path = filedialog.askopenfilename(
			title="Select the image.",
			filetypes=[("Images", "*.png *.jpg *.jpeg *.bmp")]
		)

		if self.img_path:
			self.img = Image.open(self.img_path).convert("RGBA").resize((300, 200))
			img_tk = ImageTk.PhotoImage(self.img)

			self.img_view.config(image=img_tk)
			self.img_view.image = img_tk

	def load_assets(self):
		self.fold_path = filedialog.askdirectory(title="Select the folder.")
		self.fold_name = os.path.basename(self.fold_path)

if __name__ == "__main__":
	window()