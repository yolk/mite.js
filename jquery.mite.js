(function($) {
  
  $.mite = (function() {
    // Private
    var prepare, get_url_for, set_API_key, get_ajax_options, log,
        _get, _post, _put, _delete,
        not_allowed,
        account, myself, TimeEntry, Tracker, Bookmark, Customer, Project, Service, User;
    
    // prepare CORS calls to mite account
    prepare = function(options) {
      if (!options.account || !options.api_key) throw "account & api_key need to be set";
      
      $.mite.config   = {}
      $.mite.config.protocol = options.protocol || $.mite.defaults.protocol;
      $.mite.config.domain   = options.domain   || $.mite.defaults.domain;

      $.mite.config.account  = options.account;
      $.mite.config.api_key  = options.api_key;
    };
    
    // build URL for API request
    get_url_for = function(path) {
      return $.mite.config.protocol + '://' + $.mite.config.account + '.' + $.mite.config.domain + '/' + path + '.json';
    };
    
    // sets MiteApiKey header before requests gets sent
    set_API_key = function(xhr) {
      xhr.setRequestHeader("X-MiteApiKey", $.mite.config.api_key);
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
    
    // http://mite.yo.lk/en/api/account.html
    account             = function(params, callback)      {    _get('account',            params, callback); };
    myself              = function(params, callback)      {    _get('myself',             params, callback); };
        
    // http://mite.yo.lk/en/api/time-entries.html
    // see also: http://mite.yo.lk/en/api/grouped-time-entries.html
    TimeEntry = {
      all               : function(params, callback)      {    _get('time_entries',       params, callback); },
      find              : function(id, callback)          {    _get('time_entries/'+id,   callback); },
      create            : function(params, callback)      {   _post('time_entries',       {time_entry: params}, callback); },
      update            : function(id, params, callback)  {    _put('time_entries/'+id,   {time_entry: params}, callback); },
      delete            : function(id, callback)          { _delete('time_entries/'+id,   callback); }
    }
    
    // http://mite.yo.lk/en/api/tracker.html
    Tracker = {
      find              : function(callback)              {    _get('tracker',            callback); },
      start             : function(id, callback)          {    _put('tracker/'+id,        callback); },
      stop              : function(id, callback)          { _delete('tracker/'+id,        callback); }
    }
    
    // http://mite.yo.lk/en/api/bookmarks.html
    Bookmark = {
      all               : function(params, callback)      {    _get('time_entries/bookmarks',               params, callback); },
      find              : function(id, callback)          {    _get('time_entries/bookmarks/'+id,           callback); },
      
      // TODO fix me (I guess it relates to the redirect)
      time_entries_for  : function(id, callback)          {    _get('time_entries/bookmarks/'+id+'/follow', callback); },
      
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
    
    // http://mite.yo.lk/en/api/projects.html
    Project = {
      active            : function(params, callback)      {    _get('projects',           params, callback); },
      archived          : function(params, callback)      {    _get('projects/archived',  params, callback); },
      find              : function(id, callback)          {    _get('projects/'+id,       callback); },
      create            : function(params, callback)      {   _post('projects',           {project: params}, callback); },
      update            : function(id, params, callback)  {    _put('projects/'+id,       {project: params}, callback); },
      delete            : function(id, callback)          { _delete('projects/'+id,       callback); },
      time_entries_for  : function(ids, callback)         {    _get('time_entries',       {project_id: ids}, callback); }
    }
    
    // http://mite.yo.lk/en/api/services.html
    Service = {
      active            : function(params, callback)      {    _get('services',           params, callback); },
      archived          : function(params, callback)      {    _get('services/archived',  params, callback); },
      find              : function(id, callback)          {    _get('services/'+id,       callback); },
      create            : function(params, callback)      {   _post('services',           {service: params}, callback); },
      update            : function(id, params, callback)  {    _put('services/'+id,       {service: params}, callback); },
      delete            : function(id, callback)          { _delete('services/'+id,       callback); },
      time_entries_for  : function(ids, callback)         {    _get('time_entries',       {service_id: ids}, callback); }
    }
    
    // http://mite.yo.lk/en/api/users.html
    User = {
      active            : function(params, callback)      {    _get('users',              params, callback); },
      archived          : function(params, callback)      {    _get('users/archived',     params, callback); },
      find              : function(id, callback)          {    _get('users/'+id,          callback); }, 
      time_entries_for  : function(ids, callback)         {    _get('time_entries',       {user_id: ids}, callback); },
    
      create            : not_allowed,
      update            : not_allowed,
      delete            : not_allowed
    }
    
    // Public
    return {
      defaults  : { protocol : 'http'
                  , domain   : 'mite.yo.lk'  
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
}(jQuery));