// TODO FIX JSON.stringify dependency

(function($) {
  
  $.mite = (function() {
    // Private
    var prepare, get_url_for, set_API_key, get_ajax_options, log,
        _get,
        not_allowed,
        User;
    
    // prepare CORS calls to mite account
    prepare = function(options) {
      if (!options.account || !options.api_key) throw "account & api_key need to be set";
      
      $.mite.protocol = options.protocol || $.mite.defaults.protocol;
      $.mite.domain   = options.domain   || $.mite.defaults.domain;

      $.mite.account  = options.account;
      $.mite.api_key  = options.api_key;
    };
    
    // build URL for API request
    get_url_for = function(path) {
      return $.mite.protocol + '://' + $.mite.account + '.' + $.mite.domain + '/' + path + '.json';
    };
    
    // sets MiteApiKey header before requests gets sent
    set_API_key = function(xhr) {
      xhr.setRequestHeader("X-MiteApiKey", "715f11d946bfe4e");
      xhr.setRequestHeader("Content-Type", "application/json");
    };
    
    // simple logger
    error = function(xhr, textStatus, errorThrown) {
      alert(errorThrown);
    };
    
    // enhance options with callbacks
    get_ajax_options = function(options, callback) {
      options.dataFilter = function(data, type) {
        return (/^\s+$/.test(data)) ? '{}' : data;
      };
      
      if (typeof callback == 'undefined') {
        options.error = error;
        return options;
      }
      if (typeof callback == 'function') {
        options.success = callback;
        options.error = error;
        return options;
      }
      for(event in callback) {
        options[event] = callback;
        return options;
      }
    };
    
    // GET request
    _get = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      $.ajax(get_ajax_options({url: get_url_for(path), data: params, beforeSend: set_API_key}, callback));
    };
    
    // POST request
    _post = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      $.ajax(get_ajax_options({type: 'POST', url: get_url_for(path), data: JSON.stringify(params), beforeSend: set_API_key}, callback));
    };
    
    // PUT request
    _put = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      $.ajax(get_ajax_options({type: 'PUT', url: get_url_for(path), data: JSON.stringify(params), beforeSend: set_API_key}, callback));
    };
    
    // DELETE request
    _delete = function(path, callback) {
      $.ajax(get_ajax_options({type: 'DELETE', url: get_url_for(path), beforeSend: set_API_key}, callback));
    };
    
    // through Errors for operations that are not allowed over the mite.API
    not_allowed = function() {
      throw new Error('not allowed over API');
    };
    
    // http://mite.yo.lk/en/api/users.html
    User = {
      active            : function(params, callback) { _get('users',          params, callback); },
      archived          : function(params, callback) { _get('users/archived', params, callback); },
      find              : function(id, callback)     { _get('users/'+id,      callback); }, 
      time_entries_for  : function(ids, callback)    { _get('time_entries',   {user_id: ids}, callback); },
    
      create            : not_allowed,
      update            : not_allowed,
      delete            : not_allowed
    }
    
    // http://mite.yo.lk/en/api/customers.html
    Customer = {
      active            : function(params, callback)      {    _get('customers',          params, callback); },
      archived          : function(params, callback)      {    _get('customers/archived', params, callback); },
      find              : function(id, callback)          {    _get('customers/'+id,      callback); },
      create            : function(params, callback)      {   _post('customers',          {customer: params}, callback); },
      update            : function(id, params, callback)  {    _put('customers/'+id,      {customer: params}, callback); },
      delete            : function(id, callback)          { _delete('customers/'+id,      callback); },
      projects_for      : function(ids, callback)         {    _get('projects',           {customer_id: ids}, callback); },
      time_entries_for  : function(ids, callback)         {    _get('time_entries',       {customer_id: ids}, callback); }
    }
    
    
    // Public
    return {
      defaults : { protocol : 'http'
                 , domain   : 'mite.yo.lk'  
                 },
      prepare  : prepare,
      User     : User,
      Customer : Customer
    };
  }());
}(jQuery));