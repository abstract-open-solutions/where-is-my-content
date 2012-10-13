import os
import fontforge


FLAGS = ("opentype",)


for font_file in os.listdir('.'):
    name, ext = os.path.splitext(font_file)
    if ext in ('.ttf',):
        font = fontforge.open(font_file)
        font.generate(name + '.woff', flags=FLAGS)
