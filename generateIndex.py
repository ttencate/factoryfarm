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
    <link href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah" rel="stylesheet">
    <!--   <meta name="viewport"   content="user-scalable=yes, initial-scale=1.0" /> -->
    <script src="lib/crafty.js"></script>
"""
footer = """    <script>
      window.addEventListener('load', Game.start);
    </script>
    
    <!--  Thumbnail voor Facebook enzo. ;) -->
    <!-- <link rel="image_src" href="scrshot.png"/> -->
  </head>
  <body>
    <!--Add your own HTML!-->   
    <div id="cr-stage">
    </div>
    <div id="tip" class="hidden">
    </div>
    <div id="chickenPopupContainer">
      <div id="chickenPopup" style="visibility: hidden;">
      </div>
    </div>
    <div id="bottombar">
      <div id="about">
        <span class="contents">
          Happy Chicken Farm was made in 72 hours by Jelle (<a href="http://ludumdare.com/compo/author/diningphilosopher/">Dining Philosopher</a>) and Thomas (<a href="https://twitter.com/frozenfractal">@frozenfractal</a>) for the <a href="https://ldjam.com">Ludum Dare</a> <a href="https://ldjam.com/events/ludum-dare/40">40</a> Jam.
        </span>
        (i)
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
    </div>
    <div id="overlay">
      <div id="intro">
      </div>
      <div id="won">
        <h1>Congratulations!</h1>
        <p>You earned $1000! You can now retire, safe in the knowledge that your children and grandchildren will never have a shortage of funds.</p>
        <p>&nbsp;</p>
        <p>Thank you for playing Happy Chicken Farm!</p>
        <p>&nbsp;</p>
        <p><em>Refresh the page to play again.</em></p>
      </div>
      <div id="lost">
        <h1>Game over</h1>
        <p>You were already in debt when the landlord came to collect the rent. You have been declared bankrupt.</p>
        <p>&nbsp;</p>
        <p>Thank you for playing Happy Chicken Farm!</p>
        <p>&nbsp;</p>
        <p><em>Refresh the page to try again.</em></p>
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
