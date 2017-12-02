#!/usr/bin/python2

import os

# Create assetsObject for loading
assetsObjectFile = open('assetsObject.js', 'w')
try:
	assetsObjectFile.write('var assetsObject = {\n')
	#write audio files
	assetsObjectFile.write('\"audio\": {\n')
	soundfiles = filter(lambda x: x != "soundMap.js" and x != "createSoundMap.py" and x != "audacity", os.listdir('./sound/'))
	soundnames = list(set(map(lambda x: x[0:x.find('.')], soundfiles)))
	for sn in soundnames:
		assetsObjectFile.write('\t\"' + sn + '\": [')
		prevSF = None
		goodFiles = filter(lambda x: x[0:x.find('.')] == sn, soundfiles)
		assetsObjectFile.write('\"' + '\", \"'.join(goodFiles) + '\"],\n')
	assetsObjectFile.write('},\n')
	#write image files
	assetsObjectFile.write('\"images\": [\n')
	imagefiles = filter(lambda x: x != "imageMap.js" and x != "createImageMap.py" and x != "Inkscape" and not x.endswith('~'), os.listdir('./images/'))
#	for f in imagefiles:
#		assetsObjectFile.write('\"' + f + '\"')
	assetsObjectFile.write('\t\"' + '\",\n\t\"'.join(imagefiles))
	assetsObjectFile.write('\"],\n')
	assetsObjectFile.write('};')

finally:
	assetsObjectFile.close()
