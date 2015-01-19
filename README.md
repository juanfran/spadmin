#SpAdmin

SpAdmin is an admin interface built with angular for interacting with your API backend.

## Intallation

Clone the repon and then:

```shell
npm install
bower install
gulp
```

This start the webserver in `http://localhost:8080`, now you have to configure the admin.

## Configuration

Create `conf.js` file in the spadmin `dist` directory and and add the configuration described below.

### Entity configuration

```js
angular.module('spAdmin').service('users', ['Entity', 'Entities', function (Entity, Entities) {
   var user = new Entity({
     'identifier': 'id',
     'name': 'users',
     'title': 'User'
   });

   Entities.add(user);
}]);
```

* `indentifier` Is the field that will be used to perform actions or navigation.
* `name` Name of the entity, needed for navigation.
* `title` The name that will be visible in the app.


### Entity list configuration
```js
  var userList = {
    actions: [{
      label: 'Archive',
      httpConfig: {
        url: '/users/archive',
      },
      params: function (ids) {
        return {'real_ids': ids}
      },
      successMsg: 'Success'
    }],
    httpConfig: {},
    pagination: {
      itemsPerPage: 20,
      totalPages: function(response, status, headers) {
        return headers('total');
      }
    },
    overrideResponse: function (data){
      return data.list;
    },
    include: [
      'lastname',
      {'key': 'name', 'label': 'Nombre', link: true},
      {'key': 'age', 'label': 'Añitos', override: function (item) {
        return item.age + " years";
      }},
      {'label': 'Full Name', override: function(item) {
        return item.name + " " + item.lastname;
      }},
      {'key': 'enabled', 'label': 'active', template: '<span>{{::field.value}}</span>'},
      'list'
    ],
    sort: {
      defaultField: 'lastname',
      defaultOrder: 'asc',
      fields: ['lastname', 'name', 'age']
    }
  };

  user.setList(userList);
```

* `actions` You can add custom action to the list

  - `label` The action name.
  - `httpConfig` Same as the angular httpConfig.
  - `params` By default spadmin send a param `ids` with and array of identifiers, if you need another name, you could use this function.
  - `successMsg` The message when the action is finished.

* `pagination` Config the list pagination.

  - `itemsPerPage` The namber of items per page. The server should return this number of items.
  - `totalPages` Specify the total number of pages. For example you can set the total pages in the response header of the server.

* `overrideResponse` Override the response list.

* `include` choose the elements of the list with these options.

  - `key` The field name in the api response.
  - `label` The visible name.
  - `link` if it's set to true then this field link to the detail.
  - `override` Override the api response of the field.
  - `template` Set a html template.

* `exclude` Set with an array of the elements that must be deleted from the api response. Don't fill it if you fill `include`.

* `httpConfig` Same as the angular httpConfig.

* `sort` Config the list order
  - `defaultField` Set the default sort field.
  - `defaultField` Set the default order field (asc, desc).
  - `fields` List of available fields to order
  - `transform` By default spadmin send this params to the api `order_by` and `order`. You can overwrite it.

````
    sort: {
        transform: function(order_by, order) {
            return {
              'orderby': orderby + ":" + order
            }
        }
    }
```

### New/Edit form
```js
  var userForm = {
    title: 'Add new user',
    httpConfig: {
      params: {
        ee: 22
      }
    },
    fields: [
      {'fieldset': {
        'title': 'Address',
        'fields': [
          {'key': 'name', 'label': 'Name'},
          {'key': 'lastname', 'label': 'Lastname', validation: {'required': true}},
          {'key': 'genre', 'label': 'Genere', type: 'choice-radio', choices: [
            {'label': 'Man', 'value': 'man'},
            {'label': 'Woman', 'value': 'woman'},
          ], validation: {'required': true}}
        ]
      }}
    ]
  };

  user.setAdd(userForm);
  user.setEdit(userForm);
```

* `title` Form page title.

* `httpConfig` Same as the angular httpConfig.

* `fields` Form fields.
  - `fieldset` Group fields.
  - `key` The field name in the api response.
  - `label` The visible name.
  - `type` Field type.
  - `validation` Field validation options.
  - `defaulValue` The value when is empty.
  - `disabled` true or false
  - `readonly` true or false
  - `template` set a custom html.

### Fields

* `choice-radio`

  - `choices` Array options.

* choice-select
  - `choices` Array options.
  - `validation`
    - `required` true or false

* `choice-select-remote`
  - `httpConfig` Same as the angular httpConfig.
  - `transformResponse` override api response.
  - `map` apply map over the api response array
  - `validation`
    - `required` true or false

```js
  {'key': 'country', 'label': 'Country', type: 'choice-select-remote',  remoteChoices: {
    httpConfig: {
      'url': '/countries'
    },
    transformResponse: function(response) {
      return response.countries;
    },
    map: function (country) {
      return {'label': country.title, value: country.value}
    }
  }},
```

* `choices-select-remote`
  - `httpConfig` Same as the angular httpConfig.
  - `transformResponse` override api response.
  - `map` apply map over the api response array
  - `validation`
    - `required` true or false

* `date`
  - `placeholder`
  - `validation`
    - `required` true or false
    - `change` on change function

* `email`
  - `placeholder`
  - `validation`
    - `required` true or false
    - `change` on change function
    - `minlength`
    - `maxlength`
    - `pattern` RegExp pattern expression

* `number`
  - `placeholder`
  - `validation`
    - `required` true or false
    - `change` on change function
    - `minlength`
    - `maxlength`
    - `pattern` RegExp pattern expression

* `string`
  - `placeholder`
  - `validation`
    - `required` true or false
    - `change` on change function
    - `minlength`
    - `maxlength`
    - `pattern` RegExp pattern expression

* `text`
  - `placeholder`
  - `validation`
    - `required` true or false
    - `change` on change function
    - `minlength`
    - `maxlength`
    - `pattern` RegExp pattern expression

### Global configuration

```js
angular.module('spAdmin').config(['spAdminConfigProvider', function (spAdminConfigProvider) {
  # Set the api base url
  spAdminConfigProvider.setBaseUrl('http://localhost:3000');

  # Add the name service configuration
  spAdminConfigProvider.add('users', 'books');

  # Enable Auth
  spAdminConfigProvider.auth(true, '/login');

  # Override the auth response, the response will be saved locally
  spAdminConfigProvider.overrideAuthResponseData(function(response) {
    return {user: response.id};
  });

  # Override all httpConfig, this is useful to send user credentials.
  spAdminConfigProvider.overrideGlobalHttpConfig(function (httpConfig, auth) {
    if (auth) {
      httpConfig.params = {'login': auth.user};
    }

    return httpConfig;
  });
}]);
```
