var express = require('express');
var router = express.Router();
const _ = require('lodash');
const map = require('lodash/fp/map');
var _merge = require('lodash/fp/merge');
var _without = require('lodash/without');


const wall = '#'

const path = '.'

const beginning = 'A'

const end = 'B'

const solution = '='

var steps

var beginningValue = {

}

var endValue = {

}

router.post('/', function (req, res, next) {
  var newMaze = req.body
  arrayMaze = makeArray(newMaze.maze);
  beginningValue.value = 0

  var readyArray = doThings(arrayMaze)
  var newStringArray = backToString(readyArray)

  
  return res.json({
    body: ({
      maze: newStringArray,
      steps: steps,
    })
  });
});


function doThings(arrayMaze) {
  surroundSquares(beginningValue, arrayMaze)
  traverseMaze(newArrayMaze, endValue)

  return newArrayMaze
}

var newArrayMaze;

function surroundSquares(current, arrayMaze) {

  var left = arrayMaze.filter(x => x.xcoord === current.xcoord - 1 && x.ycoord === current.ycoord)[0]
  var right = arrayMaze.filter(x => x.xcoord === current.xcoord + 1 && x.ycoord === current.ycoord)[0]
  var bottom = arrayMaze.filter(x => x.xcoord === current.xcoord && x.ycoord === current.ycoord + 1)[0]
  var top = arrayMaze.filter(x => x.xcoord === current.xcoord && x.ycoord === current.ycoord - 1)[0]
  
  if (left != null &&left.element != '#') {
    if (left.value == null) {
      left.value = current.value + 1
      surroundSquares(left, arrayMaze)
    }
    if (left.element == end) {
      newArrayMaze = arrayMaze
      steps = left.value
      return
    }
  }
  if (right != null && right.element != '#') {
    if (right.value == null) {
      right.value = current.value + 1
      surroundSquares(right, arrayMaze)
    }
    if (right.element == end) {
      newArrayMaze = arrayMaze
      steps = right.value
      return
    }
  }
  if (top != null && top.element != '#') {
    if (top.value == null) {
      top.value = current.value + 1
      surroundSquares(top, arrayMaze)
    }
    if (top.element == end) {
      newArrayMaze = arrayMaze
      steps = top.value
      return
    }
  }
  if (bottom != null &&bottom.element != '#') {
    if (bottom.value == null) {
      bottom.value = current.value + 1
      surroundSquares(bottom, arrayMaze)
    }
    if (bottom.element == end) {
      newArrayMaze = arrayMaze
      steps = bottom.value
      return
    }
  }
  
}

function traverseMaze(newArrayMaze, current) {
  var left = newArrayMaze.filter(x => x.xcoord === current.xcoord - 1 && x.ycoord === current.ycoord)[0]
  var right = newArrayMaze.filter(x => x.xcoord === current.xcoord + 1 && x.ycoord === current.ycoord)[0]
  var bottom = newArrayMaze.filter(x => x.xcoord === current.xcoord && x.ycoord === current.ycoord + 1)[0]
  var top = newArrayMaze.filter(x => x.xcoord === current.xcoord && x.ycoord === current.ycoord - 1)[0]

  var list = []

  if (left.value != null) {
    list.push(left)
  }
  if (right.value != null) {
    list.push(right)
  }
  if (top.value != null) {
    list.push(top)
  }
  if (bottom.value != null) {
    list.push(bottom)
  }

  //console.log(list)
  var lowest = _.minBy(list, function (o) { return o.value; });
  var lowestValue = newArrayMaze.filter(x => x.xcoord === lowest.xcoord && x.ycoord === lowest.ycoord)[0]

  if (lowestValue.element != 'A') {
    lowestValue.element = '='
    traverseMaze(newArrayMaze, lowest)
  }
}



function makeArray(maze) {
  var mazeArray = []

  var stringArray = maze.split('');
  var j = 0
  var v = 0
  for (i = 0; i < stringArray.length; i++) {
    if (stringArray[i] == "\n") {
      j++;
      v = 0
    } else {
      if (stringArray[i] == beginning) {
        beginningValue.xcoord = v;
        beginningValue.ycoord = j;

      }
      if (stringArray[i] == end) {
        endValue.xcoord = v;
        endValue.ycoord = j;
      }
      v++;
      coordJSON = {}
      coordJSON.xcoord = v - 1;
      coordJSON.ycoord = j;
      coordJSON.element = stringArray[i]
      if (coordJSON.element == beginning) {
        coordJSON.value = 0
      }

      mazeArray.push(coordJSON);
    }
  }
  return mazeArray;
}

function makeArrayOfArrays(maze) {
  var mazeArray = [[]]
  var stringArray = maze.split('');
  var j = 0
  for (i = 0; i < stringArray.length; i++) {
    if (stringArray[i] == "\n") {
      mazeArray.push([]);
      j++
    } else {
      if (stringArray[i] == beginning) {
        beginningValue = [j, mazeArray[j].length]
      }
      mazeArray[j].push(stringArray[i])
    }
  }
  return mazeArray
}
function backToString(anotherMazeArray) {
  var mazeString = ""
  var currentPosition = 0
  for (i = 0; i < anotherMazeArray.length; i++) {
    if (anotherMazeArray[i].ycoord != currentPosition) {
      mazeString = mazeString + '\n'
      currentPosition++
    }
    mazeString = mazeString + anotherMazeArray[i].element;

  }
  return mazeString;
}

module.exports = router;