(function() {
  
  $.mite = (function() {
    // Private
    var prepare, get_url_for, set_API_key, get_ajax_options, error, json_parse, not_allowed,
        _request, _get, _post, _put, _delete,
        
        account, myself, TimeEntry, Tracker, Bookmark, Customer, Project, Service, User;
    
    // prepare CORS calls to mite account
    prepare = function(options) {
      if (!options.account || !options.api_key) throw "account & api_key need to be set";
      
      $.mite.config          = {};
      $.mite.config.protocol = options.protocol || $.mite.defaults.protocol;
      $.mite.config.domain   = options.domain   || $.mite.defaults.domain;
      
      $.mite.config.async    = (typeof options.async != 'undefined') ? options.async : $.mite.defaults.async;

      $.mite.config.account  = options.account;
      $.mite.config.api_key  = options.api_key;
    };
    
    // build URL for API request
    get_url_for = function(path) {
      return $.mite.config.protocol + '://' + $.mite.config.account + '.' + $.mite.config.domain + '/' + path + '.json';
    };
    
    // simple logger
    error = function(xhr, textStatus, errorThrown) {
      alert(errorThrown);
    };
    
    // parse string to JSON
    parse = function(string) {
      return /^\s*$/.test(string) ? {} : JSON.parse(string)
    }
    
    // ajax call wrapper
    _request = function(options, callback) {
      var data = options.data || null,
          xhr = new XMLHttpRequest();
          
      if (callback instanceof Function) {
        xhr.onreadystatechange = function(){
          if(xhr.readyState==4 && (xhr.status==200 || xhr.status==0)) {
            callback( parse(xhr.responseText) );
          }
        };
      }
      
      xhr.open(options.type,options.url,$.mite.config.async);
      
      if (data instanceof Object) {
        data = JSON.stringify(data)
        xhr.setRequestHeader('Content-Type','application/json');
      }
      xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
      xhr.setRequestHeader("X-MiteApiKey", $.mite.config.api_key);
      xhr.send(data);
      
      if (!$.mite.config.async) return parse(xhr.responseText);
    }
    
    // GET request
    _get = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      return _request({type: 'GET', url: get_url_for(path), data: params}, callback)
    };
    
    // POST request
    _post = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      return _request({type: 'POST', url: get_url_for(path), data: params}, callback);
    };
    
    // PUT request
    _put = function(path, params, callback) {
      if (typeof params == 'function') {
        callback = params;
        params = {};
      }
      return _request({type: 'PUT', url: get_url_for(path), data: params}, callback);
    };
    
    // DELETE request
    _delete = function(path, callback) {
      return _request({type: 'DELETE', url: get_url_for(path)}, callback);
    };
    
    // through Errors for operations that are not allowed over the mite.API
    not_allowed = function() {
      throw new Error('not allowed over API');
    };
    
    // http://mite.yo.lk/en/api/account.html
    account             = function(params, callback)      { return    _get('account',            params, callback); };
    myself              = function(params, callback)      { return    _get('myself',             params, callback); };
        
    // http://mite.yo.lk/en/api/time-entries.html
    // see also: http://mite.yo.lk/en/api/grouped-time-entries.html
    TimeEntry = {
      all               : function(params, callback)      { return    _get('time_entries',       params, callback); },
      find              : function(id, callback)          { return    _get('time_entries/'+id,   callback); },
      create            : function(params, callback)      { return   _post('time_entries',       {time_entry: params}, callback); },
      update            : function(id, params, callback)  { return    _put('time_entries/'+id,   {time_entry: params}, callback); },
      delete            : function(id, callback)          { return _delete('time_entries/'+id,   callback); }
    }
    
    // http://mite.yo.lk/en/api/tracker.html
    Tracker = {
      find              : function(callback)              { return    _get('tracker',            callback); },
      start             : function(id, callback)          { return    _put('tracker/'+id,        callback); },
      stop              : function(id, callback)          { return _delete('tracker/'+id,        callback); }
    }
    
    // http://mite.yo.lk/en/api/bookmarks.html
    Bookmark = {
      all               : function(params, callback)      { return    _get('time_entries/bookmarks',               params, callback); },
      find              : function(id, callback)          { return    _get('time_entries/bookmarks/'+id,           callback); },
      
      // TODO fix me (I guess it relates to the redirect)
      time_entries_for  : function(id, callback)          { return    _get('time_entries/bookmarks/'+id+'/follow', callback); },
      
      create            : not_allowed,
      update            : not_allowed,
      delete            : not_allowed
    }
        
    // http://mite.yo.lk/en/api/customers.html
    Customer = {
      active            : function(params, callback)      { return    _get('customers',          params, callback); },
      archived          : function(params, callback)      { return    _get('customers/archived', params, callback); },
      find              : function(id, callback)          { return    _get('customers/'+id,      callback); },
      create            : function(params, callback)      { return   _post('customers',          {customer: params}, callback); },
      update            : function(id, params, callback)  { return    _put('customers/'+id,      {customer: params}, callback); },
      delete            : function(id, callback)          { return _delete('customers/'+id,      callback); },
      projects_for      : function(ids, callback)         { return    _get('projects',           {customer_id: ids}, callback); },
      time_entries_for  : function(ids, callback)         { return    _get('time_entries',       {customer_id: ids}, callback); }
    }
    
    // http://mite.yo.lk/en/api/projects.html
    Project = {
      active            : function(params, callback)      { return    _get('projects',           params, callback); },
      archived          : function(params, callback)      { return    _get('projects/archived',  params, callback); },
      find              : function(id, callback)          { return    _get('projects/'+id,       callback); },
      create            : function(params, callback)      { return   _post('projects',           {project: params}, callback); },
      update            : function(id, params, callback)  { return    _put('projects/'+id,       {project: params}, callback); },
      delete            : function(id, callback)          { return _delete('projects/'+id,       callback); },
      time_entries_for  : function(ids, callback)         { return    _get('time_entries',       {project_id: ids}, callback); }
    }
    
    // http://mite.yo.lk/en/api/services.html
    Service = {
      active            : function(params, callback)      { return    _get('services',           params, callback); },
      archived          : function(params, callback)      { return    _get('services/archived',  params, callback); },
      find              : function(id, callback)          { return    _get('services/'+id,       callback); },
      create            : function(params, callback)      { return   _post('services',           {service: params}, callback); },
      update            : function(id, params, callback)  { return    _put('services/'+id,       {service: params}, callback); },
      delete            : function(id, callback)          { return _delete('services/'+id,       callback); },
      time_entries_for  : function(ids, callback)         { return    _get('time_entries',       {service_id: ids}, callback); }
    }
    
    // http://mite.yo.lk/en/api/users.html
    User = {
      active            : function(params, callback)      { return    _get('users',              params, callback); },
      archived          : function(params, callback)      { return    _get('users/archived',     params, callback); },
      find              : function(id, callback)          { return    _get('users/'+id,          callback); }, 
      time_entries_for  : function(ids, callback)         { return    _get('time_entries',       {user_id: ids}, callback); },
    
      create            : not_allowed,
      update            : not_allowed,
      delete            : not_allowed
    }
    
    // Public
    return {
      defaults  : { protocol : 'http'
                  , domain   : 'mite.yo.lk'
                  , async    : true
                  },
      prepare   : prepare,
      
      // resources
      account   : account,
      myself    : myself,
      TimeEntry : TimeEntry,
      Tracker   : Tracker,
      Bookmark  : Bookmark,
      Customer  : Customer,
      Project   : Project,
      Service   : Service,
      User      : User
    };
  }());
}());