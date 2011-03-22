mite.js
============

mite.js is a wrapper for the RESTful mite.api

mite allows standard Cross-Origin Resource Sharing (CORS) requests, which means
you can access your mite account from any domain, e.g. using this mite.api wrapper.

Usage
-------

Setup miteQuery using your mite.account & mite.api_key.

    Mite = new miteQuery({account: 'accountname',api_key: '12345678'})

    Mite.myself()
    Mite.account()

    Mite.TimeEntry.all()
    Mite.TimeEntry.all({group_by: 'customer,project'})
    Mite.TimeEntry.create({minutes: 10})
    Mite.TimeEntry.find(123)
    Mite.TimeEntry.update(123, {minutes: 20})
    Mite.TimeEntry.destroy(123)

    Mite.Tracker.find()
    Mite.Tracker.start(123)
    Mite.Tracker.stop(123)

    Mite.Bookmark.all()
    Mite.Bookmark.find(123)
    Mite.Bookmark.time_entries_for(123)

    Mite.Customer.active()
    Mite.Customer.archived()
    Mite.Customer.create({name: 'my new customer'})
    Mite.Customer.find(123)
    Mite.Customer.update(123, {name: 'new named customer'})
    Mite.Customer.destroy(123)
    Mite.Customer.projects_for(123)
    Mite.Customer.time_entries_for(123)

    Mite.Project.active()
    Mite.Project.archived()
    Mite.Project.create({name: 'my new project'})
    Mite.Project.find(123)
    Mite.Project.update(123, {name: 'new named project'})
    Mite.Project.destroy(123)
    Mite.Project.time_entries_for(123)

    Mite.Service.active()
    Mite.Service.archived()
    Mite.Service.create({name: 'my new service'})
    Mite.Service.find(123)
    Mite.Service.update(123, {name: 'new named service'})
    Mite.Service.destroy(123)
    Mite.Service.time_entries_for(123)

    Mite.User.active()
    Mite.User.archived()
    Mite.User.find(123)
    Mite.User.time_entries_for(123)
    
A callback function can be passed to all queries as last param.

    Mite.myself(function(data) {
      alert('Hello, ' + data.user.name + '!')
    });

Pass differnt callbacks as an associative Array

    Mite.Customer.find(1234, {
      success  : function(data) {},
      error    : function(xhr, msg) {},
      complete : function(xhr) {}
    });
    
Additional opptions that can be passed when initializing or for each
requst are

* async:   set to false if you need to make a synchronous request. Default is true. 
* timeout: set the timeout for a request. Default is 60 (= 1 Minute)

License
-------

mite.js is licensed unter the MIT license.