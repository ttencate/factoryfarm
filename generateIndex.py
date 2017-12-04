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
      <div id="hotbar" onclick="Crafty('KeyControls').select(parseInt(event.target.id.substr(12, 1)))">
        <div class="hotbar-item" id="hotbar-item-1" title="Chicken"><span class="key">1</span><span class="cost">chicken</span></div>
        <div class="hotbar-item" id="hotbar-item-2" title="Fence"><span class="key">2</span><span class="cost">fence</span></div>
        <div class="hotbar-item" id="hotbar-item-3" title="Feeder"><span class="key">3</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-4" title="Feeder"><span class="key">4</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-5" title="Feeder"><span class="key">5</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-6" title="Feeder"><span class="key">6</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-7" title="Feeder"><span class="key">7</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-8" title="Feeder"><span class="key">8</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-9" title="Feeder"><span class="key">9</span><span class="cost">feeder</span></div>
        <div class="hotbar-item" id="hotbar-item-0" title="Feeder"><span class="key">0</span><span class="cost">feeder</span></div>
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
