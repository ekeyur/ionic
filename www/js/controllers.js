angular.module('fabular.controllers', [])

//Controllers

.controller('fabularController', function($scope, $timeout,$stateParams, $rootScope, $state, fabularService) {
	var i_obj = {"name" : "i", "wobble" : "false"};
	var ask_obj = {"name" : "askfor", "wobble" : "false"};
	var want_obj = {"name" : "want", "wobble" : "false"};
	var obj_1 = {"name" : "1", "wobble" : "false"};
	var obj_2 = {"name" : "2", "wobble" : "false"};
	var obj_3 = {"name" : "3", "wobble" : "false"};

	$scope.levels = [1,2,3,4,5];
	$scope.clickedStatement = false;
	$scope.settings = 'noshow';
	var inBasket = [];
	$scope.category = 'fruits';
	$scope.clickedBasket = function() {
		if($scope.clickedStatement === false){
      $scope.clickedStatement = true;
		inBasket.sort();
		var item = null;
		var cnt = 0;
		for (var i = 0; i < inBasket.length + 1; i++) {
		    if (inBasket[i] != item) {
		        if (cnt > 0) {
		            console.log(item + ': ' + cnt + ' times');
		        }
		        item = inBasket[i];
		        cnt = 1;
		    } else {
		        cnt++;
		    }
		  }
		} else if($scope.clickedStatement === true) {
			$scope.clickedStatement = false;
		}
	};

	//Holds current winning rounds
	$scope.countWins = 0;
	//Game wrapped in play again function
	$scope.levelChange = function(value){
		chelevel = parseInt(value);
		$scope.level = value;
		$scope.settings = 'noshow';
		$scope.Again();
	};
	$scope.setCategory = function(value){
		$scope.category = value;
		console.log(value);
	};
	$scope.setSettings = function(){
		$scope.settings = 'show';
	};

  $scope.Again = function(){
		$scope.resultLink = [];
  	fabularService.getThings($scope.category).success(function(data){
			$scope.currentIndex = 0;
			//Selects random number through 3 for levels with counting
	    var r = (Math.floor(Math.random() * 3) + 1).toString();
			//Converts random number into an object
			var r_num = {"name" : r, "wobble" : "false"};
			//Selects single item from data array using random index number
	    $scope.item = data[Math.floor((Math.random() * 3))];
			//Builds question array with 'ask' image and $scope.item
	    $scope.questionArray = [ask_obj,$scope.item];
	    //Sets the values of options arrays and expected result arrays depending on level selected:
	    if(chelevel === 1){
	      $scope.optionsArray = data;
	      $scope.expectedResult = [$scope.item];
	    }else if (chelevel === 2){
	      data.unshift(want_obj);
	      $scope.optionsArray = data;
	      $scope.expectedResult = [want_obj, $scope.item];
	      $scope.expectedResult = [want_obj,$scope.item];
	    }else if (chelevel === 3){
	      data.unshift(i_obj,want_obj);
	      $scope.optionsArray = data;
	      // console.log($scope.optionsArray);
				console.log($scope.resultLink);

	      $scope.expectedResult = [i_obj,want_obj,$scope.item] ;
	    }else if (chelevel === 4){
	      data.unshift(i_obj,want_obj,obj_1,obj_2,obj_3);
	      $scope.questionArray = [ask_obj,r_num,$scope.item];
	      $scope.optionsArray = data;
	      $scope.expectedResult = [i_obj,want_obj,r_num,$scope.item] ;
	    }else if (chelevel === 5){
				please_obj = {"name" : "please", "wobble" : "false"};
	      data.unshift(i_obj,want_obj,obj_1,obj_2,obj_3);
	      data.push(please_obj);
	      $scope.optionsArray = data;
	      $scope.questionArray = [ask_obj,r_num,$scope.item];
	      $scope.expectedResult = [i_obj,want_obj,r_num,$scope.item,please_obj] ;
	    }
			$scope.questionArray.forEach(function(value){
				// textToSpeak(value.name);
			});
		});
	};

	//Click function
	$scope.clicked = function(option) {
		//Handles correct click events
		if (option.name === $scope.expectedResult[$scope.currentIndex].name) {
			$scope.currentIndex += 1;
			// textToSpeak(option.name);
			$scope.resultLink.push(option);
			if(chelevel === 1 && $scope.currentIndex === 1){
        $scope.optionsArray = [];
      }
			if(chelevel === 2 && $scope.currentIndex === 2){
        $scope.optionsArray = [];
      }
      if(chelevel === 3 && $scope.currentIndex === 3){
        $scope.optionsArray = [];
				inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
      }
      if(chelevel === 4 && $scope.currentIndex === 4){
				$scope.optionsArray = [];
      }
			//Split levels because of splice in 153
			if((chelevel === 4 || chelevel === 5) && ($scope.currentIndex === 3 || $scope.currentIndex === 4)){
				$scope.optionsArray.splice(0,3);
			}
      if(chelevel === 5 && $scope.currentIndex === 5){
        $scope.optionsArray.pop();
      }
			if ($scope.currentIndex === 1 || $scope.currentIndex === 2){
			$scope.optionsArray.splice($scope.optionsArray.indexOf(option), 1);
		}
	}
    else {
			//Handles incorrect click events with verbal prompt for correct option
			// textToSpeak("Please press  "+$scope.expectedResult[$scope.currentIndex].name);
			var obj = $scope.optionsArray.filter(function(option){
					return option.name === $scope.expectedResult[$scope.currentIndex].name;
				});
				//Wobbles correct button
				obj[0].wobble = true;
				$timeout(function () {
					$scope.optionsArray.forEach(function(a){
						a.wobble = false;
					});
				}, 1000);
		}
		//When user creates correct sentence
		//When user creates correct sentence
		if($scope.expectedResult.length === $scope.resultLink.length){
			//textToSpeak function reads the sentence
			$scope.resultLink.forEach(function(value){
				// textToSpeak(value.name);
				});
			//Pushes 'x' number of prompt items into reward basket for levels 4 and 5
			if(chelevel === 5){
				for(let j=0;j<r;j++){
					inBasket.push($scope.resultLink[$scope.currentIndex -2].name);
				}
			}else if(chelevel === 4) {
				for(let j=0;j<r;j++){
					inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
				}
		//Pushes prompt item into reward basket
			}else{
				inBasket.push($scope.resultLink[$scope.currentIndex -1].name);
			}
		}
		// textToSpeak("Good Job, Would you like to play again?");
		$scope.basket = inBasket;
	};

	$scope.Again();
	$scope.playAgain = function(){
		$scope.resultLink = [];
		$scope.Again();
	};
});
