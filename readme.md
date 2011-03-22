mite.js
============

mite.js is a wrapper for the RESTful mite.api

mite allows standard Cross-Origin Resource Sharing (CORS) requests, which means
you can access your mite account from any domain, e.g. using this mite.api wrapper.

Usage
-------

Setup Mite using your mite.account & mite.api_key.

    mite = new Mite({account: 'accountname',api_key: '12345678'})

    mite.myself()
    mite.account()

    mite.TimeEntry.all()
    mite.TimeEntry.all({group_by: 'customer,project'})
    mite.TimeEntry.create({minutes: 10})
    mite.TimeEntry.find(123)
    mite.TimeEntry.update(123, {minutes: 20})
    mite.TimeEntry.destroy(123)

    mite.Tracker.find()
    mite.Tracker.start(123)
    mite.Tracker.stop(123)

    mite.Bookmark.all()
    mite.Bookmark.find(123)
    mite.Bookmark.time_entries_for(123)

    mite.Customer.active()
    mite.Customer.archived()
    mite.Customer.create({name: 'my new customer'})
    mite.Customer.find(123)
    mite.Customer.update(123, {name: 'new named customer'})
    mite.Customer.destroy(123)
    mite.Customer.projects_for(123)
    mite.Customer.time_entries_for(123)

    mite.Project.active()
    mite.Project.archived()
    mite.Project.create({name: 'my new project'})
    mite.Project.find(123)
    mite.Project.update(123, {name: 'new named project'})
    mite.Project.destroy(123)
    mite.Project.time_entries_for(123)

    mite.Service.active()
    mite.Service.archived()
    mite.Service.create({name: 'my new service'})
    mite.Service.find(123)
    mite.Service.update(123, {name: 'new named service'})
    mite.Service.destroy(123)
    mite.Service.time_entries_for(123)

    mite.User.active()
    mite.User.archived()
    mite.User.find(123)
    mite.User.time_entries_for(123)
    
A callback function can be passed to all queries as last param.

    mite.myself(function(data) {
      alert('Hello, ' + data.user.name + '!')
    });

Pass differnt callbacks as an associative Array

    mite.Customer.find(1234, {
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