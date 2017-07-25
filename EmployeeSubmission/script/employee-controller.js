
var mainApp = angular.module("mainApp", []);

angular.module('mainApp').controller('employeeController', ['$scope', '$http',
    function ($scope, $http) {

        $http.get('/data/genders.json').
          success(function (data, status, headers, config) {
              $scope.genders = data;
          }).
          error(function (data, status, headers, config) {
              $scope.genders = [];
          });

        $http.get('/data/countries.json').
          success(function (data, status, headers, config) {
              $scope.countries = data;
          }).
          error(function (data, status, headers, config) {
              $scope.countries = [];
          });

        $scope.toggleAll = function (toggle) {
            angular.forEach($scope.employees, function (emp) { emp.isSelected = toggle; });
        }

        $scope.reset = function () {
            $scope.NewID = "";
            $scope.NewFirstName = "";
            $scope.NewLastName = "";
            $scope.NewGender = "";
            $scope.NewAge = "";
            $scope.NewNationality = "";
            $scope.NewResidenceCountry = "";
            $scope.NewPosition = "";
            $scope.NewCompany = "";
        }

        $scope.updateEmployee = function(index, data) {
            $scope.employees[index] = data;
        };

        $scope.submitEmployee = function () {
            var submitted = false;
            var index = $scope.searchEmployee($scope.NewID);
            var newData = {
                "id": $scope.NewID,
                "firstname": $scope.NewFirstName,
                "lastname": $scope.NewLastName,
                "gender": $scope.NewGender,
                "age": $scope.NewAge,
                "nationality": $scope.NewNationality,
                "residencecountry": $scope.NewResidenceCountry,
                "position": $scope.NewPosition,
                "company": $scope.NewCompany
            }
            if ($scope.editMode) {
                if (index) {
                    $scope.updateEmployee(index, newData);
                    submitted = true;
                } else {
                    alert('The employee with ID \'' + $scope.NewID + '\' does not exist. The update failed to proceed.');
                }
                $scope.editMode = false;
                $("input[name='NewID']").prop('disabled', false);
            } else {
                if (index) {
                    alert('The employee with ID \'' + $scope.NewID + '\' already exists. The submission failed to proceed.');
                } else {
                    if (!$scope.employees) {
                        $scope.employees = []
                    }
                    $scope.employees.push(newData);
                    submitted = true;
                }
            }
            if (submitted)
                $scope.reset();
        }

        $scope.searchEmployee = function (id) {
            var found = false;
            var index = 0;
            var foundIndex = 0;
            angular.forEach($scope.employees, function (emp) {
                if (!found && emp.id == id) {
                    found = true;
                    foundIndex = index;
                }
                index++;
            });
            return foundIndex;
        }

        $scope.editEmployee = function () {
            var isChecked = $("input[type=checkbox]").is(":checked");
            if (!isChecked) {
                alert('You need to select at least 1 item to edit');
            } else {
                var found = false;
                angular.forEach($scope.employees, function (emp) {
                    if (!found && emp.isSelected) {
                        $scope.NewID = emp.id;
                        $scope.NewFirstName = emp.firstname;
                        $scope.NewLastName = emp.lastname;
                        $scope.NewGender = emp.gender;
                        $scope.NewAge = emp.age;
                        $scope.NewNationality = emp.nationality;
                        $scope.NewResidenceCountry = emp.residencecountry;
                        $scope.NewPosition = emp.position;
                        $scope.NewCompany = emp.company;
                        found = true;
                        $scope.editMode = true;
                        $("input[name='NewID']").prop('disabled', true);
                    }
                });
                $scope.toggleAll(false);
            }
        };

        $scope.removeEmployee = function () {
            var isChecked = $("input[type=checkbox]").is(":checked");
            if (!isChecked) {
                alert('You need to select at least 1 item to delete');
            } else {
                if (confirm('Are you sure want to delete the selected employees?')) {
                    var newDataList = [];
                    angular.forEach($scope.employees, function (emp) {
                        if (!emp.isSelected) {
                            newDataList.push(emp);
                        }
                    });
                    $scope.employees = newDataList;
                }
            }
        };

        $scope.HandleBrowseClick = function () {
            if (confirm('Load the data from external file will erase your current data. Are you sure want to continue?')) {
                var fileinput = document.getElementById("browse");
                fileinput.click();
            }
        }

        $scope.loadFile = function (element) {
            var reader = new FileReader();
            reader.onload = function () {
                $scope.employees = angular.fromJson(reader.result);
                $scope.$apply();
            }
            reader.readAsText(element.files[0]);
        }

        $scope.saveFile = function () {

            var data = $scope.employees;
            var filename = 'file.json';
            data = JSON.stringify(data, undefined, 2);
            $http.post(filename, data);

            if (typeof data === 'object') {
                data = angular.toJson(data, undefined, 2);
            }

            var blob = new Blob([data], { type: 'text/json' });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
            }
            else {
                var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            }
        };
}]);

$scope.reset();
$scope.editMode = false;
