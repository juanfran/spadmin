function ListController($scope, Entities, spAdminConfig, $stateParams, apiService, $state, listResponse) {
  var entityName = $stateParams.entityName;
  var entity = Entities.get(entityName);
  var entityList = entity.list;

  var currentPage = $stateParams.page;

  var sort = {};
  sort.order_by = $stateParams.order_by || entityList.sort.defaultField;
  sort.order = $stateParams.order  || entityList.sort.defaultOrder;

  $scope.entity = entity;

  $scope.pagination = {};
  $scope.pagination.currentPage = currentPage;
  $scope.pagination.itemsPerPage = entityList.pagination.itemsPerPage;
  $scope.pagination.total = currentPage * entityList.pagination.itemsPerPage;

  $scope.selected = [];

  $scope.title = entity.title;

  spAdminConfig.updateTitle($scope.title);

  $scope.$watch('pagination.currentPage', function(newPage, oldPage) {
    if (newPage !== oldPage) {
      $state.go('list', {entityName: entityName, page: newPage});
    }
  });

  var params = {
    page: currentPage
  };

  if (entityList.sort && entityList.sort.transform) {
    _.assign(params, entityList.sort.transform(sort.order_by, sort.order));
  } else {
    _.assign(params, {
      order_by: sort.order_by,
      order: sort.order
    });
  }

  apiService.httpEntity(entity.name, entityList.httpConfig, params)
    .success(function(response, status, headers) {
      var listResponseObj = listResponse.parseListResponse(response, status, headers, entity, sort);

      $scope.pagination.total = listResponseObj.getTotalItems();
      $scope.list = listResponseObj.getList();
      $scope.listHead = listResponseObj.getHead();
    });
}

angular.module('spAdmin').controller('ListController', ListController);
