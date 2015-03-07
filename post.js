'use strict'

var thread = {
    url: '',
    site_full: '',
    site: '',
    site_section: '',
    section_title: '',
    title: '',
    title_full: '',
    published: '',
    replies_count: 0,
    participants_count: 0,
    size_type: '',
    country: ''
};

var Post = {
    thread: thread,
    url: '',
    ord_in_thread: 0,
    author: '',
    published: '',
    title: '',
    text: '',
    language: '',
    crawled: ''
};

module.exports = Post;