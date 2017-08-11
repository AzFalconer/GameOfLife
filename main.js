$(document).ready(function() {
  //Variables
  var grid = [],
      highScore = 0,
      pop = 0,
      oldPop = 0,
      stagnant = 0,
      stagnation = false,
      timerId = null,
      delay = 1000,
      speed = 5,
      generation = 0;

  //Listen
  $("#board").on("click", "td", function(e){tdClicked(e.target.id);});
  $("#speed").on("change", function(){speed = $("#speed").val();$("#btnPause").click();$("#btnStart").click();});
  $("#btnStep").click(function(){if(timerId) {clearInterval(timerId);} nextGen();}); //works
  $("#btnStart").click(function(){running();});
  $("#btnPause").click(function(){if(timerId) {clearInterval(timerId);}});
  $("#btnRandom").click(function(){
    if(timerId) {clearInterval(timerId);}
    generation = 0;
    seed();
    redrawBoard();
  }); //works
  $("#btnClear").click(function(){if(timerId) {clearInterval(timerId);} generation = 0; clearBoard(); redrawBoard();}); //works

  //Execute
  setupBoard();
  $("#btnStart").click();

  //Functions
  function tdClicked(cell){ //works
    var res = cell.match(/([0-9]+)/g);
    var row = res[0], col = res[1];
    if(grid[row][col] == 0) {grid[row][col] = 1} else {grid[row][col] = 0}
    redrawBoard();
  }

  function clearBoard() { //works
    $("#results").text('Simulation Results');
      for (i=0;i<grid.length;i++) {
      for (n=0;n<grid[i].length;n++) {
        grid[i][n] = 0;
      }
    }
  }

  function running() { //works
    timerId = setInterval(function(){nextGen();}, (delay/speed));
  }

  function nextGen() { //works
    generation = generation + 1;
    $("#generation").text("Generation: " + generation); //Debug
    var nextGrid = [],
        count = 0;
    for (i=0;i<10;i++) {nextGrid[i]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];}
    for (row=0;row<grid.length;row++) {
      for (col=0;col<grid[row].length;col++) {
        count = countNeighbors(row,col);
        if (count < 2) {nextGrid[row][col] = 0} //Dies
        if (grid[row][col] == 1 && count >= 2 && count <=3) {nextGrid[row][col] = 1} //Lives
        if (grid[row][col] == 1 && count > 3) {nextGrid[row][col] = 0} //Dies
        if (grid[row][col] == 0 && count == 3) {nextGrid[row][col] = 1} //Lives
      }
    }
    if (checkStagnant(nextGrid)) { //works
      $("#btnPause").click();
      $("#results").text('Population stagnant in ' + generation + ' generations');
    }
    grid = nextGrid;
    redrawBoard();
  }

   function isAlive(row,col) { //Works
    try {if (grid[row][col] > 0) {return true;} else {return false;}}
    catch(err) {return false;}
   }

  function countNeighbors(row, col) { //works
    var count = 0;
    if (isAlive(row-1,col-1)) {count = count + 1;}; //NW
    if (isAlive(row-1,col)) {count = count + 1;}; //N
    if (isAlive(row-1,col+1)) {count = count + 1;}; //NE
    if (isAlive(row,col-1)) {count = count + 1;}; //W
    if (isAlive(row,col+1)) {count = count + 1;}; //E
    if (isAlive(row+1,col-1)) {count = count + 1;}; //SW
    if (isAlive(row+1,col)) {count = count + 1;}; //S
    if (isAlive(row+1,col+1)) {count = count + 1;}; //SE
    return count;
  }

  function setupBoard() { //works
    for (i=0;i<10;i++) { //build grid array, will be 10x20 for testing.
      grid.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    }
    seed(); //Generate random starting population
    //build table
    var state = 'empty';
    for (i=0;i<grid.length;i++) {
      $("table").append('<tr id="row' + i +'" class="game"></tr>');
      for (n=0;n<grid[i].length;n++) {
        if (grid[i][n] == 1) {state = 'live'} else {state = 'empty'}
        $("#row"+i).append('<td id="cell' + i + '-' + n +'"></td>')
        $("#cell"+ i + "-" + n).addClass(state);
      }
    }
    census();
  }

  function redrawBoard() { //works
    $("tr").remove(".game"); //Delete existing board
    var state = 'empty';
    for (i=0;i<grid.length;i++) {
      $("table").append('<tr id="row' + i +'" class="game"></tr>');
      for (n=0;n<grid[i].length;n++) {
        if (grid[i][n] == 1) {state = 'live'} else {state = 'empty'}
        $("#row"+i).append('<td id="cell' + i + '-' + n +'"></td>')
        $("#cell"+ i + "-" + n).addClass(state);
      }
    }
    census();
  }

  function census () { //works
    pop = 0;
    for (row=0;row<grid.length;row++) {
      for (col=0;col<grid[row].length;col++) {
        if(isAlive(row,col)) {pop = pop + 1;};
      }
    }
    $("#generation").text("Generation: " + generation);
    $("#population").text("Population: " + pop);
    if (generation > 1 && pop < 1) { //Test for extinction //works
      $("#btnPause").click();
      $("#results").text('Extinction in ' + generation + ' generations');
      if (generation > highScore) {highScore = generation;}
      $("#highScore").text('Greatest number of generations before extinction event: ' + highScore);
    }
  }

  function checkStagnant(nextGrid) { //works
    stagnation = false
    for (row=0;row<grid.length;row++) {
      for (col=0;col<grid[row].length;col++) {
        if (grid[row][col] !== nextGrid[row][col]) {
          stagnation = false; return false;
        }
      }
    }
    return true;
  }

  function seed() { //works
    $("#results").text('Simulation Results');
    for (row=0;row<grid.length;row++) {
      for (col=0;col<grid[row].length;col++) {
        grid[row][col] = Math.floor((Math.random())+.5);
      }
    }
  }
  });
