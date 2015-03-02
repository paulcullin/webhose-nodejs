webhose.io client for Python
============================

A simple way to access the `webhose.io <https://webhose.io>`_ API from your Python code

.. code-block:: python

    import webhose

    webhose.config(token=YOUR_API_KEY)
    for post in webhose.search("github"):
        print(post.title)


API Key
-------

To make use of the webhose.io API, you need to obtain a token that would be
used on every request. To obtain an API key, create an account at
https://webhose.io/auth/signup, and then go into
https://webhose.io/dashboard to see your token.

Installing
----------
Available through pip:

.. code-block:: bash

    $ pip install webhose

Alternatively, you can install from source:

.. code-block:: bash

    $ git clone https://github.com/Buzzilla/webhose-python
    $ cd webhose-python
    $ python setup.py install

Use the API
-----------

To get started, you need to import the library, and set your access token.
(Replace YOUR_API_KEY with your actual API key).

.. code-block:: python

    >>> import webhose
    >>> webhose.config(token=YOUR_API_KEY)

Now you can make a request and inspect the results:

.. code-block:: python

    >>> r = webhose.search("foobar")
    >>> r.total
    62
    >>> len(r.posts)
    62
    >>> r.posts[0].language
    'english'
    >>> r.posts[0].title
    'Putting quotes around dictionary keys in JS'

For your convenience, the Response object is iterable, so you can loop over it
and get all the results. The iterator will create additional API requests to
fetch additional pages.

.. code-block:: python

    >>> total_words = 0
    >>> for post in r:
    ...     total_words += len(post.text.split(" "))
    ...
    >>> print(total_words)
    56006

**Warning**: This method can use up your credits if your search has lots of
results.

Full documentation
------------------

* config(token)

  * token - your API key

* search(query, token=None)

  * query - the search query, either as a search string, or as a Query object
  * token - you can provide the API key directly to the search function if you want

Query objects
^^^^^^^^^^^^^

Query object correspond to the advanced search options that appear on https://webhose.io/use

Query object have the following members:

* ``all_terms`` - a list of strings, all of which must appear in the results
* ``some_terms`` - a list of strings, some of which must appear in the results
* ``phrase`` - a phrase that must appear verbatim in the results
* ``exclude`` - terms that should not appear in the results
* ``site_type`` - one or more of ``discussions``, ``news``, ``blogs``
* ``language`` - one or more of language names, in lowercase english
* ``site`` - one or more of site names, top level only (i.e., yahoo.com and not news.yahoo.com)
* ``title`` - terms that must appear in the title
* ``body_text`` - term that must appear in the body text

Query objects implement the ``__str__()`` method, which shows the resulting search string.

Response objects
^^^^^^^^^^^^^^^^

Response objects have the following members:

* ``total`` - the total number of posts which match this search
* ``more`` - the number of posts not included in this response
* ``posts`` - a list os Post objects
* ``next`` - a URL for the next results page for this search
* ``response`` - the original ``requests`` response
* ``get_next()`` - a method to fetch the next page of results. Returns a new Response object

Response objects implement the ``__iter__()`` method, which can be used to loop
over all posts matching the query. (Automatic page fetching)

Post and Thread objects
^^^^^^^^^^^^^^^^^^^^^^^

Post and Thread object contain the actual data returned from the API.
Consult https://webhose.io/documentation to find out about their structure.

Polling
-------

If you want to make repeated searches, performing an action whenever there are
new results, use code like this:

.. code-block:: python

    r = webhose.search("skyrim")
    while True:
        for post in r:
            perform_action(post)
        time.sleep(300)
        r = r.get_next()
