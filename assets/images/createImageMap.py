#!/usr/bin/python2

import os
import re
# Create/update a javascript file containing a map of image IDs and the associated files.

imageMapFile = open("imageMap.js", 'w')
try:
	imageMapFile.write("var imageMap = {\n")
	imagepath = 'assets/images/'
	files = [f for f in os.listdir('.') if os.path.isfile(f)]
	for f in sorted(files):
		if f != "createImageMap.py" and f != "imageMap.js" and not f.endswith('~'):
			match = re.search(r'(.*)\.([^\.]*)', f)
			fileName = match.group(1)
			imageMapFile.write('\t' + fileName + ': \'' + imagepath + f + '\',\n')
	imageMapFile.write('};')
finally:
	imageMapFile.close()
