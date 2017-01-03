var app = angular.module('predix_redis_login',[]);

app.service('loginFormSubmit',function($http){
    this.loginHandler = function(serv_instance_name,password)
    {
        return $http({
                method : 'POST',
                url : '/login',
                data: {'serv_instance_name':serv_instance_name,'password':password}
            }).then(function Success(response) {
            console.log(JSON.stringify(response));
            return 'success';
            },function Error(response) {

                return 'error';

            });
    }
});
app.controller('login', function($scope,$http,loginFormSubmit)
{
    $scope.user = {};
    $scope.loginAlert = {'display':'none'};
    $scope.spinner_state = true;
    $scope.overlay_style = {'display':'none'};
    $scope.formValidation = function(){
        if($scope.user['serv_instance_name'] === undefined)
            {
                $scope.serv_instance_name_validation = 'validation-error';
            }
            else
            {
                $scope.serv_instance_name_validation = '';
            }

            if($scope.user['password'] === undefined)
            {
               $scope.password_validation = 'validation-error';
            }
            else
            {
                $scope.password_validation = '';
            }
    };
    $scope.formSubmit = function(){
        if($scope.loginForm.$valid)
        {
            $scope.overlay_style = {'display':''};
            $scope.spinner_state = false;
            var response = loginFormSubmit.loginHandler($scope.user['serv_instance_name'],$scope.user['password']);

            response.then(function(data)
            {
                $scope.overlay_style = {'display':'none'};
                switch(data)
                {
                    case 'success' :console.log('logged in');
                                    window.location.href = '/dashboard';
                                    break;
                    case 'error':   $scope.loginAlert = {'display':''};
                                    $scope.serv_instance_name_validation = 'validation-error';
                                    $scope.password_validation = 'validation-error';
                                    break;

                }
            });

        }
        else
        {
            $scope.formValidation();
        }

    }
});
