#!/usr/bin/python2

import os
import re

indexFile = open('index.html', 'w')


header = """<!DOCTYPE html>
<html>
    <head>
        <title>Factory Farm</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
        <link rel="stylesheet" type="text/css" href="stylesheet.css" />
        <!-- font -->
    <link rel="shortcut icon" type="image/x-icon" href="assets/images/favoicon.png"> 
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
    <div id="info" style="visibility: hidden;">
      <div id="moneyText"></div>
      <div id="chickensText"></div>
      <div id="hotbar" onclick="Crafty('KeyControls').select(parseInt(event.target.id.substr(12, 1)))">
        <div class="hotbar-item" id="hotbar-item-1" title="Chicken">1</div>
        <div class="hotbar-item" id="hotbar-item-2" title="Fence">2</div>
        <div class="hotbar-item" id="hotbar-item-3" title="Feeder">3</div>
      </div>
      <div id="dayText">Day 1</div>
      <div id="timeText">06:00</div>
    </div>
  </body>
</html>"""

try:
  jsRegex = re.compile('.*\.js');
  indexFile.write(header)
  for root, dirs, files in os.walk('./src/'):
    dirs.sort()
    for name in files:
      indexFile.write('    <script src="');
      indexFile.write(os.path.join(root, name));
      indexFile.write('"></script>\n');
  for root, dirs, files in os.walk('./assets/'):
    dirs.sort()
    for name in files:
      if jsRegex.match(name):
        indexFile.write('    <script src="');
        indexFile.write(os.path.join(root, name));
        indexFile.write('"></script>\n');

  indexFile.write(footer)

finally:
  indexFile.close()
