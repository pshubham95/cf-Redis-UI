
window.addEventListener('WebComponentsReady', function(e) {
	var scope = angular.element(document.getElementById("mainController")).scope();
	scope.$apply(function () {
                scope.initializeNavbar();
            });

});
var app = angular.module('predix_redis', ['angular-terminal']);

app.service('executeCommand',function ($http) {
	this.executeCommand = function (command){
		return $http({
						method : 'POST',
						url : '/executeCommand',
						data : {'command':command}

				}).then(function Success(response) {

					return response;
				},function Error(response) {

						return 'error';

			});

	};
});
app.service('loadNavbarContents',function($http){
	this.loadData = function(){
		return $http({
						method : 'GET',
						url : '/getNavBarData',
						

				}).then(function Success(response) {
					console.log(response);
					return response;
				},function Error(response) {

						return 'error';

			});
	};
});
app.run(function ($rootScope,executeCommand) {


				$rootScope.$on('terminal.main', function (e, input, terminal) {
					console.log(terminal);

					var input_min = input.trim();
					if(input_min == '' || input_min == "")
						return;
					$rootScope.$emit('terminal.main.echo','Loading...');
					var response = executeCommand.executeCommand(input);
					response.then(function(data)
					{
						if(data == 'error')
						{
							$rootScope.$emit('terminal.main.echo', 'Error Something went wrong! Check command and try again.');

						}
						else
						{
							$rootScope.$emit('terminal.main.echo', data['data']['output']);
						}
					});
				});
});
app.controller('mainController', function($scope,loadNavbarContents) {
	$scope.overlay_style = {'display':'none'};
	$scope.initializeNavbar = function () {
			var response = loadNavbarContents.loadData();
			response.then(function(data)
			{	
				$scope.navbarContents = data['data'];
				$scope.selection();	

			});
			/*$scope.navbarContents = 
			[
				{
					"path":"/dashboard",
					"icon":"fa-database",
					"label":"{{dbName}}",
					"href":"/dashboard",
					"id":"dashboard",
					"selected":"true"
				},
				{
					"path":"/executeCommand",
					"icon":"fa-terminal",
					"label":"{{commandExecute}}",
					"href":"/executeCommand",
					"id":"executeCommand"
				},
				{
					"path":"tab3",
					"icon":"fa-sign-out",
					"label":"{{Logout}}",
					"href":"#tab1",
					"class":""
				}

			];*/
			$scope.selection();
			
		};
		$scope.appNavHandler = function(){
			var appNav = document.getElementById('appNav');
			var flex = document.getElementById('flex');
			if(appNav.getAttribute('nav-expanded') == 'true')
			{
				flex.style.paddingLeft = "20%";
			}
			else
			{
				flex.style.paddingLeft = "5%";

			}
		};
	$scope.selection = function () {
			setTimeout(function () {
				var x = document.getElementById(window.location.href.split('/').pop());
				x.className += x.className + ' selected';
			},50);
		};

	//$scope.initializeNavbar();
});

