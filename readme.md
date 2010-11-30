mite.query
============

mite.query is a wrapper for the RESTful mite.api

mite allows standard Cross-Origin Resource Sharing (CORS) requests, which means
you can access your mite account from any domain, e.g. using this mite.api wrapper.

Usage
-------

$.mite.prepare({account: 'accountname',api_key: '12345678'})

A callback function can be passed to all queries as last param.
Different callbacks for error, success, complete can be passed as object instead.

$.mite.myself()
$.mite.account()

$.mite.TimeEntry.all()
$.mite.TimeEntry.create({minutes: 10})
$.mite.TimeEntry.find(123)
$.mite.TimeEntry.update(123, {minutes: 20})
$.mite.TimeEntry.delete(123)

$.mite.Tracker.find()
$.mite.Tracker.start(123)
$.mite.Tracker.stop(123)

$.mite.Bookmark.all()
$.mite.Bookmark.find(123)
$.mite.Bookmark.time_entries_for(123)

$.mite.Customer.active()
$.mite.Customer.archived()
$.mite.Customer.create({name: 'my new customer'})
$.mite.Customer.find(123)
$.mite.Customer.update(123, {name: 'new named customer'})
$.mite.Customer.delete(123)
$.mite.Customer.projects_for(123)
$.mite.Customer.time_entries_for(123)

$.mite.Project.active()
$.mite.Project.archived()
$.mite.Project.create({name: 'my new project'})
$.mite.Project.find(123)
$.mite.Project.update(123, {name: 'new named project'})
$.mite.Project.delete(123)
$.mite.Project.time_entries_for(123)

$.mite.Service.active()
$.mite.Service.archived()
$.mite.Service.create({name: 'my new service'})
$.mite.Service.find(123)
$.mite.Service.update(123, {name: 'new named service'})
$.mite.Service.delete(123)
$.mite.Service.time_entries_for(123)

$.mite.User.active()
$.mite.User.archived()
$.mite.User.find(123)
$.mite.User.time_entries_for(123)

License
-------

mite.node is licensed unter the MIT license.