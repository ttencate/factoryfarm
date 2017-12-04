#!/usr/bin/python2

import os
import re

indexFile = open('index.html', 'w')


header = """<!DOCTYPE html>
<html>
    <head>
        <title>Happy Chicken Farm</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
        <link rel="stylesheet" type="text/css" href="stylesheet.css" />
        <!-- font -->
    <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.png"> 
    <!-- <link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'> -->
    <!--   <meta name="viewport"   content="user-scalable=yes, initial-scale=1.0" /> -->
    <script src="lib/crafty.js"></script>
"""
footer = """    <script>
      window.addEventListener('load', Game.start);
    </script>
    
    <!--  Thumbnail voor Facebook enzo. ;) -->
    <link rel="image_src" href="scrshot.png"/>  
  </head>
  <body>
    <!--Add your own HTML!-->   
    <div id="cr-stage">
    </div>
    <div id="chickenPopupContainer">
      <div id="chickenPopup" style="visibility: hidden;">
      </div>
    </div>
    <div id="info" style="visibility: hidden;">
      <div id="moneyDiv">
        Cash: <span id="moneyText"></span><br>
        Yearly rent: <span id="rentText"></span>
      </div>
      <div id="hotbar">
      </div>
      <div id="dayDiv">
      <span id="monthText"></span>, Year <span id="yearText"></span><br>
        Chickens: <span id="chickensText"></span>
      </div>
    </div>
    <script type="text/x-vertex-shader" id="vertex-shader">
      %(vertexShader)s
    </script>
    <script type="text/x-fragment-shader" id="fragment-shader">
      %(fragmentShader)s
    </script>
  </body>
</html>"""

def readFile(filename):
    with open(filename, 'rt') as f:
        return f.read()

try:
  jsRegex = re.compile('.*\.js');
  indexFile.write(header)
  for root, dirs, files in os.walk('./src/'):
    dirs.sort()
    files.sort()
    for name in files:
      indexFile.write('    <script src="');
      indexFile.write(os.path.join(root, name));
      indexFile.write('"></script>\n');
  for root, dirs, files in os.walk('./assets/'):
    dirs.sort()
    files.sort()
    for name in files:
      if jsRegex.match(name):
        indexFile.write('    <script src="');
        indexFile.write(os.path.join(root, name));
        indexFile.write('"></script>\n');

  indexFile.write(footer % {
    'vertexShader': readFile('assets/shaders/vertex.glsl'),
    'fragmentShader': readFile('assets/shaders/fragment.glsl'),
  })

finally:
  indexFile.close()
