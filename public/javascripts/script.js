	// create the module and name it app

	function validateForm()
	{
		//console.log(document.getElementById('importAlert').getAttribute('type') = 'Caution');
		if(document.getElementById('fileInput').files[0].name.split('.').pop() != 'redis')
		{
			console.log('here');
			document.getElementById('importAlert').setAttribute('type','Important');

			return false;
		}
		else
		{
			document.getElementById('importAlert').style.display = 'none';
			return true;
		}
	}
	window.addEventListener('WebComponentsReady', function(e) {
                console.log('components ready');
                var jsElm = document.createElement("script");
    			// set the type attribute
    			jsElm.type = "application/javascript";
    			// make the script element load file
    			jsElm.src = "bower_components/angular/angular.min.js";
    			// finally insert the element to the body element in order to load the script
    			document.body.appendChild(jsElm);
    			jsElm.onload = function(){
    				console.log('finished loading');
    				
                var app = angular.module('predix_redis', []);
            	app.service('loadDataService',function($http){
	    this.loadDataFunc = function()
	    {
	        return $http({
	                method : 'GET',
	                url : '/getData',

	            }).then(function Success(response) {

	            return response;
	            },function Error(response) {

	                return 'error';

	            });
	    }
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
	app.service('loadKeyValue',function($http){
			this.loadDataFunc = function(key)
			{
					return $http({
									method : 'GET',
									url : '/getKeyValue',
									headers: {'key':key}

							}).then(function Success(response) {

							return response;
							},function Error(response) {

									return 'error';

							});
			}
	});

app.service('saveKeyValue',function ($http) {
	this.saveDataFunc = function (key,value) {
		return $http({
						method : 'POST',
						url : '/saveKeyValue',
						data: {'key':key,'value':value}

				}).then(function Success(response) {

					return response;
				},function Error(response) {

						return 'error';

				});

	}

});

app.service('deleteKey',function ($http) {
	this.deleteKeyFunc = function (key) {
		return $http({
						method : 'DELETE',
						url : '/deleteKey',
						headers: {'key':key}

				}).then(function Success(response) {

					return response;
				},function Error(response) {

						return 'error';

				});

	}

});

app.service('exportData',function($http){
	this.exportDataFunc = function(export_type){
		return $http({
			method : 'GET',
			url: '/exportData',
			headers: {'export_type':export_type}
		}).then(function Success(response){
			return response;

		},function Error(response){
			return 'Error';

		});
	};
});

	// create the controller and inject Angular's $scope
	app.controller('mainController', function($scope,loadDataService,loadKeyValue,saveKeyValue,deleteKey,loadNavbarContents,exportData,$http) {
		// create a message to display in our view
		$scope.overlay_style = {'display':''};
		$scope.dataImportStyle = {'display':'none'};
		$scope.editable = false;
		$scope.saveEditKey = {'display':'none'};
		$scope.exportDataFormWarningStyle = {'display':'none'};
		$scope.exportStyle = {'display':''};
		$scope.noneStyle = {'display':'none'};
		$scope.expanded = true;
		$scope.initializeNavbar = function () {
			var response = loadNavbarContents.loadData();
			response.then(function(data)
			{	
				if(window.location.href.split('/').pop() == 'importData')
					$scope.dataImportStyle = {'display':''};
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

			];
			$scope.selection();*/
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
				var x = document.getElementById('dashboard');
				x.className += x.className + ' selected';
			},50);
		};

		$scope.loadData = function () {
			var response = loadDataService.loadDataFunc();

			response.then(function(data)
			{
					$scope.exportStyle = {'display':''};

					console.log(data)
					if(data['data'].length != 0)
					{
						console.log('here');
						$scope.redisData = [];
						$scope.redisData = data['data'];
						$scope.redisDataList = [];
						for(var i = 0; i < $scope.redisData.length; i++)
						{
							$scope.redisDataList.push($scope.redisData[i]['keys']);
						}
					}
					else
					{
						$scope.redisData=[];
						$scope.noneStyle = {'display':''};
						$scope.exportStyle = {'display':'none'};


					}
					console.log($scope.redisData);
					$scope.overlay_style = {'display':'none'};

			});

		};
		$scope.showKeys = function (index) {

			Polymer.dom(document).querySelector("#value_display").modalButtonClicked();
			$scope.overlay_style = {'display':''};
			$scope.editable = false;
			$scope.saveEditKey = {'display':'none'};
			$scope.alertEditStyle = {'display':'none'};
			$scope.selectedKey = $scope.redisData[index]['keys'];
			var response = loadKeyValue.loadDataFunc($scope.redisData[index]['keys']);
			response.then(function(data)
			{
					console.log(data)
					$scope.overlay_style = {'display':'none'};
					$scope.redisValue = data['data'];

			});

			$scope.editKeyValue = function () {
				$scope.editable = true;
				setTimeout(function () {
					document.getElementById("keyDisplay").focus();
				},50);
				$scope.saveEditKey = {'display':''};


			}
			console.log(index);
		};

		$scope.saveEditedValue = function () {
			console.log(document.getElementById('keyDisplay').innerHTML.trim());
			var response = saveKeyValue.saveDataFunc ($scope.selectedKey,document.getElementById('keyDisplay').innerHTML.trim());
			response.then(function(data)
			{
				$scope.redisValue = document.getElementById('keyDisplay').innerHTML.trim();
				$scope.alertEditStyle = {'display':''};

			});
		};

		$scope.refreshValue = function () {
			$scope.overlay_style = {'display':''};
			var response = loadKeyValue.loadDataFunc($scope.selectedKey);
			response.then(function(data)
			{
					console.log(data)
					$scope.overlay_style = {'display':'none'};
					$scope.redisValue = data['data'];

			});

		}
		$scope.openModalNewKey = function () {
			$scope.keyvalue = {};
			$scope.alertStyle = {'display':'none'};
			$scope.warningStyle = {'display':'none'};
			Polymer.dom(document).querySelector("#new_key").modalButtonClicked();

		};
		$scope.openModalImport = function(){
			Polymer.dom(document).querySelector("#import").modalButtonClicked();

		};
		$scope.formValidation = function(){
        if($scope.keyvalue['key'] === undefined)
            {
                $scope.key_class = 'validation-error';
								$scope.warningStyle = {'display':'none'};
            }
            else
            {
                $scope.key_class = '';
                if($scope.redisDataList !== undefined){
								if($scope.redisDataList.indexOf($scope.keyvalue['key']) >= 0)
								{
									$scope.warningStyle = {'display':''};

								}
								else {
									$scope.warningStyle = {'display':'none'};

								}
							}

            }

            if($scope.keyvalue['value'] === undefined)
            {
               $scope.value_class = 'validation-error';
            }
            else
            {
                $scope.value_class = '';
            }
    };
		$scope.submitKeyValue = function () {
			if($scope.keyValue_form.$valid)
			{
				$scope.key_class = '';
				$scope.value_class = '';
				$scope.overlay_style = {'display':''};
				var response = saveKeyValue.saveDataFunc ($scope.keyvalue['key'],$scope.keyvalue['value']);
				response.then(function(data)
				{
						if($scope.redisData == undefined)
							$scope.redisData = [];
						console.log(data)
						$scope.redisData.push({'keys':$scope.keyvalue['key']});
						$scope.alertStyle = {'display':''};
						$scope.noneStyle = {'display':'none'};
						$scope.overlay_style = {'display':'none'};
						$scope.exportStyle = {'display':''};




				});


			}
			else {
				$scope.formValidation();
			}
		};
		$scope.reloadKeys = function () {
			$scope.overlay_style = {'display':''};
			//delete $scope.redisData;
			//$scope.redisData = [{'keys':'shubham'}];

			$scope.loadData();
			
			

		};
		$scope.deleteKey = function () {
			var response = deleteKey.deleteKeyFunc($scope.selectedKey);
			$scope.overlay_style = {'display':''};
			response.then(function(data)
			{
				var response_dataKey = loadDataService.loadDataFunc();

				response_dataKey.then(function(data)
				{
					Polymer.dom(document).querySelector("#value_display").modalButtonClicked();
					$scope.loadData();

				});
			});

		};
		$scope.exportData = function(){
			$scope.exportDataFormAlertStyle = {'display':'none'};
			$scope.exportDataFormStyle = {'display':''};
			$scope.exportDataDisplayStyle = {'display':'none'};
			Polymer.dom(document).querySelector("#export_data").modalButtonClicked();

		};
		$scope.exportDataForm = function(){
			var option = document.getElementById('textWrap').innerHTML;
			if(option == 'Select')
			{
				$scope.exportDataFormAlertStyle = {'display':''};
				$scope.exportDataDisplayStyle = {'display':'none'};
				$scope.exportDataFormWarningStyle = {'display':'none'};

				return;
			}
			else
			{	
				$scope.overlay_style = {'display':''};
				var export_option;
				switch(option)
				{
					case 'Redis Commands' : export_option = 'redis';
											break;
					case 'JSON File': 		export_option = 'json'
											break;
				}
				var response = exportData.exportDataFunc(export_option);
				response.then(function(data)
				{
					$scope.exportFileUrl = '/exportDataFile?export_type='+export_option;
					$scope.overlay_style = {'display':'none'};
					$scope.exportDataFormStyle = {'display':'none'};
					$scope.exportDataDisplayStyle = {'display':'inline-block'};

					$scope.exportDisplayData = data['data']['data'].trim();
					
					console.log(data);
				});
				console.log(export_option);
			}
		};
		$scope.warningDropdown = function(){
			var option = document.getElementById('textWrap').innerHTML;
			if(option == 'JSON File')
			{
				$scope.exportDataFormWarningStyle = {'display': ''}
			}
			else
			{
				$scope.exportDataFormWarningStyle = {'display':'none'};

			}
		};
		$scope.submitImport = function(){
			var file = document.getElementById('fileInput').files[0];
			var fd = new FormData(document.getElementById('fileinfo'));
			//fd.append('files',file);
			console.log(fd);
			

			$http({
						method : 'POST',
						url : '/importData',
						data: fd,
						contentType: false,
    					processData: false

				}).then(function Success(response) {

					
				},function Error(response) {

						

				});
			
		};
		$scope.loadData();
		$scope.initializeNavbar();


	});



    			};
    			console.log(jsElm);
    			

                

            

    });