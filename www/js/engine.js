	//Define global variables
		
		//Settings
		var labyrinthSize = "small";
		var labyrinthMode = "visible";
		
		//Maze definitions
		var canvas;
		var context;
		var mazeName = "small.jpg";
		
		//Ball movement definitions
		var speedX = 0;
		var speedY = 0;
		var speedUnit = 0.2;
		var maxSpeed = 3;
		var bounceSensitivity = 0.3;
		var bounceSpeedDimish = -0.8;
		
		//Ball definitions
		var ball = null;
		var ballPosition = null;
		var ballLeft = 0;
		var ballRight = 0;
		var ballTop = 0;
		var ballBottom = 0;
		var ballRadius = 0;
		var ballSize = 0;
		
		//Acceleration definitions
		var accX = 0;
		var accY = 0;
		
		//Window size definitions
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		

	
    // The watch id references the current `watchAcceleration`
    var watchID = null;

    // Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
		//Set up the canvas
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		
		//BALL DEFINITIONS
		var ballSetup = document.getElementById('ball');
		var size = "15px";
		var startLeft = ((windowWidth/2)-(windowHeight/2)) + 10;
		var startTop = 10;
		
		//BALL SETUP
		ballSetup.style.left = startLeft + 'px';
		ballSetup.style.Top = startTop + 'px';
		ballSetup.style.width = size;
		ballSetup.style.height = size;
		
		//Draw the maze background
		drawMaze(mazeName);
				
        startWatch();
    }

	//Drawing the maze
	function drawMaze(mazeFile){
		var imgMaze = new Image();
		imgMaze.onload = function() {
			//Resize the canvas to match the mace picture
			canvas.width = windowWidth;
			canvas.height = windowHeight;
			
			//Draw the maze
			context.drawImage(imgMaze, ((windowWidth/2)-(windowHeight/2)),0, windowHeight, windowHeight);		
		}
		imgMaze.src = mazeFile;
	}
    // Start watching the acceleration
    //
    function startWatch() {

        // Update acceleration every 0,003 seconds
        var options = { frequency: 30 };

        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    // Stop watching the acceleration
    //
    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }

    // onSuccess: Get a snapshot of the current acceleration
    // BALL MOVEMENT
    function onSuccess(acceleration) {    
       	
		//Fetch BALL object
		ball = $("#ball");
		
		//Fetch BALL POSITION
		ballPosition = ball.position();
		ballLeft = ballPosition.left;
		ballRight = ballPosition.left + ball.width();
		ballTop = ballPosition.top;
		ballBottom = ballPosition.top + ball.height();
		ballRadius = ball.height()/2;
		ballSize = ball.height();
		
		//Fetch ACCELERATION values
		accX = acceleration.y;
		accY = acceleration.x;
		
		//MOVE TO RIGHT, accX is POSITIVE
		if(accX > 1){
			if(speedX <= maxSpeed){
			//	if(speedX <= 0){
			//		speedX += speedUnit*2;
			//	}
			//	else{
					speedX += speedUnit;
			//	}
			}			
		}
		//MOVE TO LEFT, accX is NEGATIVE
		else if(accX < -1){
			if(speedX >= -maxSpeed){
			//	if(speedX >= 0){
			//		speedX += -speedUnit*2;
			//	}
			//	else{
					speedX += -speedUnit;
			//	}
			}
		}
		//SLOW DOWN, accX is NEUTRAL
		else{
			if(speedX > 0){
				speedX += -speedUnit/2;
			}
			else if(speedX < 0){
				speedX += speedUnit/2;
			}
		}
		//MOVE DOWNWARDS, accY is POSITIVE
		if(accY > 1){
			if(speedY <= maxSpeed){
				//if(speedY <= 0){
				//	speedY += speedUnit*2;
				//}
				//else{
					speedY += speedUnit;
				//}
			}
		}
		//MOVE UPWARDS, accY is NEGATIVE
		else if(accY < -1){
			if(speedY >= -maxSpeed){
				//if(speedY >= 0){
				//	speedY += -speedUnit*2;
				//}
				//else{
					speedY += -speedUnit;
				//}
			}
		}
		//SLOW DOWN, accY is NEUTRAL
		else{
			if(speedY > 0){
				speedY += -speedUnit/2;
			}
			else if(speedY < 0){
				speedY += speedUnit/2;
			}
		}
		
		//Check collision
		checkCollision();		
		//MOVE BALL
		ball.velocity({top:"+="+speedY, left:"+="+speedX}, {duration: 0.1});
    }
	
	
	function checkCollision(){		
		
		//LEFT
		if(speedX < 0){
			if(checkColor(ballLeft-(speedX*-1), ballTop+(ballRadius/2), (speedX*-1), ballRadius)){
				if(speedX < (bounceSensitivity*-1)){
					speedX = speedX * bounceSpeedDimish;
				}
				else{
					speedX = 0;
				}
			}
		}
		//RIGHT
		else if(speedX > 0){
			if(checkColor(ballRight, ballTop+(ballRadius/2), speedX, ballRadius)){
				if(speedX > bounceSensitivity){
					speedX = speedX * bounceSpeedDimish;
				}
				else{
					speedX = 0;
				}
			}
		}
		//TOP
		if(speedY < 0){
			if(checkColor(ballLeft+(ballRadius/2), ballTop-(speedY*-1), ballRadius, (speedY*-1))){
				if(speedY < (bounceSensitivity*-1)){
					speedY = speedY * bounceSpeedDimish;
				}
				else{
					speedY = 0;
				}
			}
		}
		//BOTTOM
		else if(speedY > 0){
			if(checkColor(ballLeft+(ballRadius/2), ballBottom, ballRadius, speedY)){
				if(speedY > bounceSensitivity){
					speedY = speedY * bounceSpeedDimish;
				}
				else{
					speedY = 0;
				}
			}
		}	
		
		//TOP-LEFT
		if(speedX <= 0 && speedY <= 0){
			if(checkColor(ballLeft-(speedX*-1), ballTop-(speedY*-1), (speedX*-1)+(ballRadius/2), (speedY*-1)+(ballRadius/2))){
				window.alert("TOP-LEFT");
				speedY = speedY * -1;
				speedX = speedX * -1;
			}
		}
		//BOTTOM-LEFT
		else if(speedX <= 0 && speedY >= 0){
			if(checkColor(ballLeft-(speedX*-1), ballBottom-(ballRadius/2), (speedX*-1)+(ballRadius/2), speedY+(ballRadius/2))){
				window.alert("BOTTOM-LEFT");
				speedY = speedY * -1;
				speedX = speedX * -1;
			}		
		}
		//TOP-RIGHT
		else if(speedX >= 0 && speedY <= 0){
			if(checkColor(ballRight-(ballRadius/2), ballTop-(speedY*-1), speedX+(ballRadius/2), (speedY*-1)+(ballRadius/2))){
				window.alert("TOP-RIGHT");
				speedY = speedY * -1;
				speedX = speedX * -1;
			}
		}
		//BOTTOM-RIGHT
		else if(speedX >= 0 && speedY >= 0){
			if(checkColor(ballRight-(ballRadius/2), ballBottom-(ballRadius/2), speedX+(ballRadius/2), speedY+(ballRadius/2))){
				window.alert("BOTTOM-RIGHT");
				speedY = speedY * -1;
				speedX = speedX * -1;
			}
		}
		
	}
	
	function checkColor(x, y, width, height) {
	//Grab the pixels from the ball
		var imgData = context.getImageData(x,y,width,height);
		var pixels = imgData.data;
		
		//check these pixels
		for (var i = 0; n = pixels.length, i < n; i += 4) {
			var red = pixels[i];
			var green = pixels[i+1];
			var blue = pixels[i+2];
			var alpha = pixels[i+3];
			
			//Look for black
			if (red == 0 && green == 0 && blue == 0){
			//Play SoundCollision when colliding with black pixels
				SoundCollision();
				return true;
			}
			
			//Look for Red
			if (red > 200 && green == 0 && blue == 0){
				window.alert("Red!");
				Goal();
				return;
			}
			//Look for Green
			if (red == 0 && green > 180 && blue == 0){
				window.alert("green!");
				return;
			}
		}		
		return false;
	}
    // onError: Failed to get the acceleration
    //
    function onError() {
        alert('onError!');
    }
    
    //what happens in goal
    function Goal(){
    	//just a reload :P
    	window.location.reload();
    }
	
	//Play mp3 file
	function SoundCollision() {
	var audio = new Audio('punch.mp3');
	// punch.mp3 was downloaded from: http://soundbible.com/2069-Realistic-Punch.html made by Mark DiAngelo
	audio.play();
	}

	//Testbutton in game.html
	function buttonClicked()
	{
	SoundCollision();
	}
