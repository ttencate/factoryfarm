#!/usr/bin/python

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
    <div id="cr-stage"></div>
  </body>
</html>"""

try:
  jsRegex = re.compile('.*\.js');
  indexFile.write(header)
  for root, dirs, files in os.walk('./src/'):
    for name in files:
      indexFile.write('    <script src="');
      indexFile.write(os.path.join(root, name));
      indexFile.write('"></script>\n');
  for root, dirs, files in os.walk('./assets/'):
    for name in files:
      if jsRegex.match(name):
        indexFile.write('    <script src="');
        indexFile.write(os.path.join(root, name));
        indexFile.write('"></script>\n');

  indexFile.write(footer)

finally:
  indexFile.close()