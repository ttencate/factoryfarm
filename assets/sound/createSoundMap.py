#!/usr/bin/python2

import os
import re
from sets import Set
# Create/update a javascript file containing a map of image IDs and the associated files.

imageMapFile = open("soundMap.js", 'w')
try:
	imageMapFile.write("var soundMap = {\n")

	soundNames = Set()
	files = [f for f in os.listdir('.') if os.path.isfile(f)]
	for f in sorted(files):
		if f != "createSoundMap.py" and f != "soundMap.js" and f != "audacity":
			match = re.search(r'(.*)\.([^\.]*)', f)
			fileName = match.group(1)
			# Each sound has mp3, ogg and wav versions.
			# Use a set to not get duplicate names.
			soundNames.add(fileName)

	exts = ['mp3', 'ogg', 'wav']
	soundpath = 'assets/sound/'
	for sn in soundNames:
		imageMapFile.write('\t' + sn + ': [')
		lastExt = None
		for ext in exts:
			if lastExt != None: # hack to ensure last extension does not get a comma
				imageMapFile.write('\'' + soundpath + sn + '.' + lastExt + '\', ')
			lastExt = ext
		
		imageMapFile.write('\'' + soundpath + sn + '.' + lastExt + '\'],\n')
	imageMapFile.write('};')
finally:
	imageMapFile.close()
