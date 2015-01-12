App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter;

// App.ApplicationAdapter = DS.FirebaseAdapter.extend({
//   firebase: new Firebase('https://resplendent-torch-2368.firebaseIO.com/web/bindings/ember/')
// })

App.Router.reopen({
  location: 'history'
});

App.Router.map(function() {
  this.resource('issues', { path: '/' }, function() {});
});

App.IssuesIndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      issues: this.store.find('issue'),
      issueRatings: this.store.find('issueRating')
    }).then(function(data) {
      data.issueRatings.forEach(function(issueRating) { 
        var githubIssueID = issueRating.get('githubIssueID');
        var issue = this.issues.findBy('id', githubIssueID);
        issue.setProperties(issueRating.toJSON());
      }, data);
      return data.issues;
    }).catch(function(error) {
      console.assert(false, error);
    })
  }
});

// try managing a collection myself. use SortableMixin.sortBy to sort it.
App.IssuesIndexController = Ember.ArrayController.extend({
  sorting: ['score:desc'],
  sortedContent: Em.computed.sort('@this', 'sorting'),
  itemController: 'issueIndex'
});

App.IssueIndexController = Ember.ObjectController.extend({
  category: function() {
    return this.model.get('category') || ''
  }.property(),

  categoryClass: function() {
    return this.get('category').toLowerCase();
  }.property('category'),

  score: function() {
    var score = this.get('benefit') - this.get('cost');
    return isNaN(score) ? undefined : score;
  }.property('benefit', 'cost')
});

App.IssueView = Ember.View.extend({
  templateName: 'issue',
  focusOut: function(e) {
    // save the model, trigger a sort.
  }
})

App.IssueRating = DS.Model.extend({
  "githubIssueID": DS.attr('string'),
  "category": DS.attr('string'),
  "cost": DS.attr('number'),
  "benefit": DS.attr('number')
})

App.IssueRating.FIXTURES = [
  {
    "id": 1,
    "githubIssueID": "53222029",
    "category": "WWW",
    "cost": 1,
    "benefit": 4
  },
  {
    "id": 2,
    "githubIssueID": "51787032",
    "category": "Support",
    "cost": 1,
    "benefit": 4
  }
]

App.Issue = DS.Model.extend({
  "cost": DS.attr(),
  "benefit": DS.attr(),
  "category": DS.attr(),

  "url": DS.attr(),
  "labels_url": DS.attr(),
  "comments_url": DS.attr(),
  "events_url": DS.attr(),
  "html_url": DS.attr(),
  "githubIssueID": DS.attr(),
  "number": DS.attr(),
  "title": DS.attr(),
  "user": DS.attr(),
  "labels": DS.attr(),
  "state": DS.attr(),
  "locked": DS.attr(),
  "assignee": DS.attr(),
  "milestone": DS.attr(),
  "comments": DS.attr(),
  "created_at": DS.attr(),
  "updated_at": DS.attr(),
  "closed_at": DS.attr(),
  "body": DS.attr()
});

App.Issue.FIXTURES = [
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/448",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/448/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/448/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/448/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/448",
    "issueRating": 1,
    "id": 53222029,
    "number": 448,
    "title": "Converting double-enter to paragraph",
    "user": {
      "login": "firedev",
      "id": 115612,
      "avatar_url": "https://avatars.githubusercontent.com/u/115612?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/firedev",
      "html_url": "https://github.com/firedev",
      "followers_url": "https://api.github.com/users/firedev/followers",
      "following_url": "https://api.github.com/users/firedev/following{/other_user}",
      "gists_url": "https://api.github.com/users/firedev/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/firedev/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/firedev/subscriptions",
      "organizations_url": "https://api.github.com/users/firedev/orgs",
      "repos_url": "https://api.github.com/users/firedev/repos",
      "events_url": "https://api.github.com/users/firedev/events{/privacy}",
      "received_events_url": "https://api.github.com/users/firedev/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2015-01-01T15:34:25Z",
    "updated_at": "2015-01-01T16:01:45Z",
    "closed_at": null,
    "body": "Hi, \r\n\r\nIs there a way to do parse Markdown with Redcarpet the same way say GitHub does:\r\n```\r\nLong\r\nline\r\n\r\nNew paragraph\r\nstill paragraph\r\n```\r\nExpected HTML:\r\n```\r\n<p>Long line</p>\r\n<p>New paragraph still paragraph</p>\r\n```\r\nActual HTML:\r\n```\r\n<p>Long line New paragraph still paragraph</p>\r\n```\r\n\r\nWith `hard_wrap` it adds `<br/>` everywhere, and without it, it ignores double-enter and glues paragraphs together. My users are getting pretty nervous about that. I can't explain them that only triple enter counts as the new paragraph.\r\n\r\nShoulnd't this be the default behaviour?  "
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/447",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/447/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/447/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/447/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/447",
    "id": 53110182,
    "number": 447,
    "title": "Escaped pound signs are not rendered in headers that open with pound",
    "user": {
      "login": "vincentwoo",
      "id": 613320,
      "avatar_url": "https://avatars.githubusercontent.com/u/613320?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/vincentwoo",
      "html_url": "https://github.com/vincentwoo",
      "followers_url": "https://api.github.com/users/vincentwoo/followers",
      "following_url": "https://api.github.com/users/vincentwoo/following{/other_user}",
      "gists_url": "https://api.github.com/users/vincentwoo/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/vincentwoo/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/vincentwoo/subscriptions",
      "organizations_url": "https://api.github.com/users/vincentwoo/orgs",
      "repos_url": "https://api.github.com/users/vincentwoo/repos",
      "events_url": "https://api.github.com/users/vincentwoo/events{/privacy}",
      "received_events_url": "https://api.github.com/users/vincentwoo/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-12-30T11:37:29Z",
    "updated_at": "2014-12-30T11:37:29Z",
    "closed_at": null,
    "body": "```\r\npry(main)> markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true, tables: true)\r\n#<Redcarpet::Markdown:0x007fb36c7b06c0 @renderer=#<Redcarpet::Render::HTML:0x007fb36c7b0738>>\r\n\r\npry(main)> markdown.render(\"\\\\#\")\r\n\"<p>#</p>\\n\"\r\npry(main)> markdown.render(\"#\\\\#\")\r\n\"<h1>\\\\</h1>\\n\"\r\npry(main)> markdown.render(\"\\\\#\\n---\")\r\n\"<h2>#</h2>\\n\"\r\n```\r\nIn the first example, redcarpet properly turns `\\#` into a `#`, but `#\\#`, a header which should have just a pound sign as its contents, turns into a header with just a slash in it. Using the newline-with-dashes to denote a header seems to work, though."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/444",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/444/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/444/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/444/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/444",
    "id": 52146349,
    "number": 444,
    "title": "`block_code` gets after `paragraph` in `Redcarpet::Render::HTML`",
    "user": {
      "login": "exalted",
      "id": 314398,
      "avatar_url": "https://avatars.githubusercontent.com/u/314398?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/exalted",
      "html_url": "https://github.com/exalted",
      "followers_url": "https://api.github.com/users/exalted/followers",
      "following_url": "https://api.github.com/users/exalted/following{/other_user}",
      "gists_url": "https://api.github.com/users/exalted/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/exalted/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/exalted/subscriptions",
      "organizations_url": "https://api.github.com/users/exalted/orgs",
      "repos_url": "https://api.github.com/users/exalted/repos",
      "events_url": "https://api.github.com/users/exalted/events{/privacy}",
      "received_events_url": "https://api.github.com/users/exalted/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-12-16T18:05:59Z",
    "updated_at": "2014-12-16T18:07:16Z",
    "closed_at": null,
    "body": "Hi,\r\n\r\n`block_code` gets after `paragraph` in `Redcarpet::Render::HTML`, which is incoherent to how, for instance, `list` and `list_item` work.\r\n\r\nWhen you override `list`, then you get the chance to internally call `list_item` passing it raw contents, whereas the same logic doesn't apply to `block_code` and `paragraph`.\r\n\r\nThis is biting me, because I am rendering custom markup for in `paragraph` that I would rather not have inside a `<blockquote>`, unfortunately that doesn't seem to be possibile right now.\r\n\r\n```ruby\r\nclass CustomRenderer < Redcarpet::Render::HTML\r\n  def paragraph(text)\r\n    custom_paragraph(text)\r\n  end\r\n\r\n  def block_quote(quote)\r\n    \"<blockquote>#{standard_paragraph(quote)}</blockquote>\"\r\n  end\r\n\r\n  private\r\n\r\n  def standard_paragraph(text)\r\n    \"<p>#{text}</p>\"\r\n  end\r\n\r\n  def custom_paragraph(text)\r\n    \"<p class=\\\"whatever\\\">#{text}</p>\"\r\n  end\r\nend\r\n```\r\n\r\nAny ideas?\r\n\r\nThanks."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/443",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/443/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/443/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/443/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/443",
    "id": 51787032,
    "number": 443,
    "title": "link names got lost in deeply nested lists",
    "user": {
      "login": "rjoberon",
      "id": 3540044,
      "avatar_url": "https://avatars.githubusercontent.com/u/3540044?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/rjoberon",
      "html_url": "https://github.com/rjoberon",
      "followers_url": "https://api.github.com/users/rjoberon/followers",
      "following_url": "https://api.github.com/users/rjoberon/following{/other_user}",
      "gists_url": "https://api.github.com/users/rjoberon/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/rjoberon/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/rjoberon/subscriptions",
      "organizations_url": "https://api.github.com/users/rjoberon/orgs",
      "repos_url": "https://api.github.com/users/rjoberon/repos",
      "events_url": "https://api.github.com/users/rjoberon/events{/privacy}",
      "received_events_url": "https://api.github.com/users/rjoberon/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-12-12T09:43:04Z",
    "updated_at": "2014-12-12T09:43:04Z",
    "closed_at": null,
    "body": "Consider the following Markdown:\r\n```markdown\r\n- a\r\n    - b\r\n        - c\r\n            - d - this link: [link](link.md) does appear\r\n                - e - this link: [link](link.md) does not appear\r\n```\r\nwhich is currently rendered as\r\n\r\n```html\r\n<ul>\r\n<li>a\r\n\r\n<ul>\r\n<li>b\r\n\r\n<ul>\r\n<li>c\r\n\r\n<ul>\r\n<li>d - this link: <a href=\"link.md\">link</a> does appear\r\n\r\n<ul>\r\n<li>e - this link: <a href=\"link.md\"></a> does not appear</li>\r\n</ul></li>\r\n</ul></li>\r\n</ul></li>\r\n</ul></li>\r\n</ul>\r\n```\r\n\r\ni.e., the link text for the link at the bullet point e is missing.\r\n\r\nHow to repeat: store the above Markdown into `test.md` and call `redcarpet test.md`. Tested with Redcarpet 3.2.2."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/430",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/430/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/430/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/430/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/430",
    "id": 47084103,
    "number": 430,
    "title": "no_intra_emphasis with @ symbol",
    "user": {
      "login": "DemitriyDN",
      "id": 1914001,
      "avatar_url": "https://avatars.githubusercontent.com/u/1914001?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/DemitriyDN",
      "html_url": "https://github.com/DemitriyDN",
      "followers_url": "https://api.github.com/users/DemitriyDN/followers",
      "following_url": "https://api.github.com/users/DemitriyDN/following{/other_user}",
      "gists_url": "https://api.github.com/users/DemitriyDN/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/DemitriyDN/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/DemitriyDN/subscriptions",
      "organizations_url": "https://api.github.com/users/DemitriyDN/orgs",
      "repos_url": "https://api.github.com/users/DemitriyDN/repos",
      "events_url": "https://api.github.com/users/DemitriyDN/events{/privacy}",
      "received_events_url": "https://api.github.com/users/DemitriyDN/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-10-28T21:30:41Z",
    "updated_at": "2014-10-28T21:30:41Z",
    "closed_at": null,
    "body": "```ruby\r\ndef render_with(flags, text)\r\n  Redcarpet::Markdown.new(Redcarpet::Render::HTML, flags).render(text)\r\nend\r\n\r\nmarkdown = render_with({:no_intra_emphasis => true}, '@_dependencies of some_method')\r\n```\r\nwill produce: \r\n`<p>@<em>dependencies of some</em>method</p>`\r\n\r\ninstead of simple:\r\n`<p>@_dependencies of some_method</p>`"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/429",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/429/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/429/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/429/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/429",
    "id": 47065203,
    "number": 429,
    "title": "CommonMark conformance",
    "user": {
      "login": "Envek",
      "id": 264400,
      "avatar_url": "https://avatars.githubusercontent.com/u/264400?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Envek",
      "html_url": "https://github.com/Envek",
      "followers_url": "https://api.github.com/users/Envek/followers",
      "following_url": "https://api.github.com/users/Envek/following{/other_user}",
      "gists_url": "https://api.github.com/users/Envek/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Envek/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Envek/subscriptions",
      "organizations_url": "https://api.github.com/users/Envek/orgs",
      "repos_url": "https://api.github.com/users/Envek/repos",
      "events_url": "https://api.github.com/users/Envek/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Envek/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 2,
    "created_at": "2014-10-28T18:44:09Z",
    "updated_at": "2014-10-31T09:00:12Z",
    "closed_at": null,
    "body": "What do project maintainers think about [CommonMark] initiative to create full and unambigous specification for basic Markdown (without extensions). Is (or will be) it planned for a some point of time?\r\n\r\nThe current specification is there: http://spec.commonmark.org/\r\nRepository with reference implementation and conformance tests is there: https://github.com/jgm/CommonMark\r\n\r\nConformance to CommonMark will fix bugs such as #230 and will help to avoid them in future. And, that is more important, will reduce the inconsistencies between implementations.\r\n\r\nResult of Redcarpet 3.2.0 (command line utility) on CommonMark 0.6 conformance tests is: `213 tests passed, 256 failed, 0 skipped.`\r\n\r\nThe testing was done like so:\r\n```bash\r\ngit clone https://github.com/jgm/CommonMark.git\r\ncd CommonMark\r\n# install re2c like: brew install re2c\r\nmake\r\nmake test # Testing of reference implementation: 469 tests passed, 0 failed, 0 skipped.\r\ngem install redcarpet\r\nPROG=redcarpet make test # 213 tests passed, 256 failed, 0 skipped.\r\n```\r\n[CommonMark]: http://commonmark.org/"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/427",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/427/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/427/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/427/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/427",
    "id": 46886754,
    "number": 427,
    "title": "Autolink breaks on underscores",
    "user": {
      "login": "jacobat",
      "id": 5836,
      "avatar_url": "https://avatars.githubusercontent.com/u/5836?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/jacobat",
      "html_url": "https://github.com/jacobat",
      "followers_url": "https://api.github.com/users/jacobat/followers",
      "following_url": "https://api.github.com/users/jacobat/following{/other_user}",
      "gists_url": "https://api.github.com/users/jacobat/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/jacobat/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/jacobat/subscriptions",
      "organizations_url": "https://api.github.com/users/jacobat/orgs",
      "repos_url": "https://api.github.com/users/jacobat/repos",
      "events_url": "https://api.github.com/users/jacobat/events{/privacy}",
      "received_events_url": "https://api.github.com/users/jacobat/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-10-27T09:52:39Z",
    "updated_at": "2014-10-27T09:52:56Z",
    "closed_at": null,
    "body": "When converting markdown with urls containing underscores they need to be escaped, unless using autolinking in which case they must not be escaped:\r\n\r\n```ruby\r\nirb(main):001:0> Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: false).render(\"http://google.com/foo\\\\_bar\\\\_baz\")\r\n=> \"<p>http://google.com/foo_bar_baz</p>\\n\"\r\nirb(main):002:0> Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(\"http://google.com/foo\\\\_bar\\\\_baz\")\r\n=> \"<p><a href=\\\"http://google.com/foo%5C_bar%5C_baz\\\">http://google.com/foo\\\\_bar\\\\_baz</a></p>\\n\"\r\n```\r\nIf one avoids escaping underscores in URL's it works with autolinking, but not without:\r\n```ruby\r\nirb(main):003:0> Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: false).render(\"http://google.com/foo_bar_baz\")\r\n=> \"<p>http://google.com/foo<em>bar</em>baz</p>\\n\"\r\nirb(main):004:0> Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render(\"http://google.com/foo_bar_baz\")\r\n=> \"<p><a href=\\\"http://google.com/foo_bar_baz\\\">http://google.com/foo_bar_baz</a></p>\\n\"\r\n```\r\nI believe the right solution is to escape underscores in URL's and change the autolinking to work with this."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/425",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/425/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/425/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/425/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/425",
    "id": 46576562,
    "number": 425,
    "title": "Empty headings",
    "user": {
      "login": "danschultzer",
      "id": 1254724,
      "avatar_url": "https://avatars.githubusercontent.com/u/1254724?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/danschultzer",
      "html_url": "https://github.com/danschultzer",
      "followers_url": "https://api.github.com/users/danschultzer/followers",
      "following_url": "https://api.github.com/users/danschultzer/following{/other_user}",
      "gists_url": "https://api.github.com/users/danschultzer/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/danschultzer/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/danschultzer/subscriptions",
      "organizations_url": "https://api.github.com/users/danschultzer/orgs",
      "repos_url": "https://api.github.com/users/danschultzer/repos",
      "events_url": "https://api.github.com/users/danschultzer/events{/privacy}",
      "received_events_url": "https://api.github.com/users/danschultzer/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-10-23T00:25:55Z",
    "updated_at": "2014-10-23T00:25:55Z",
    "closed_at": null,
    "body": "This is inconsistent:\r\n\r\n```\r\n2.1.1 :043 > parser.render \"=\"\r\n => \"<h1></h1>\\n\" \r\n2.1.1 :044 > parser.render \"# \"\r\n => \"\" \r\n```\r\n\r\nShouldn't it deliver the same result?\r\n\r\nI'm parsing HTML to markdown, and back. Sometimes there is empty headings in the HTML. I'm using the atx style headings, and I would've guessed it to be a valid heading? Even multiple spaces gives nothing:\r\n\r\n```\r\n2.1.1 :048 > parser.render \"#  \"\r\n => \"\" \r\n```\r\n\r\nCouldn't find any information on this in any documentation, so not sure if this is valid or not. Seems to be in javascript markdown parsers."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/423",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/423/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/423/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/423/events",
    "html_url": "https://github.com/vmg/redcarpet/pull/423",
    "id": 45078704,
    "number": 423,
    "title": "Don't autolink text if it's part of a previous inline",
    "user": {
      "login": "JordanMilne",
      "id": 278982,
      "avatar_url": "https://avatars.githubusercontent.com/u/278982?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/JordanMilne",
      "html_url": "https://github.com/JordanMilne",
      "followers_url": "https://api.github.com/users/JordanMilne/followers",
      "following_url": "https://api.github.com/users/JordanMilne/following{/other_user}",
      "gists_url": "https://api.github.com/users/JordanMilne/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/JordanMilne/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/JordanMilne/subscriptions",
      "organizations_url": "https://api.github.com/users/JordanMilne/orgs",
      "repos_url": "https://api.github.com/users/JordanMilne/repos",
      "events_url": "https://api.github.com/users/JordanMilne/events{/privacy}",
      "received_events_url": "https://api.github.com/users/JordanMilne/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-10-07T07:55:23Z",
    "updated_at": "2014-10-12T18:20:27Z",
    "closed_at": null,
    "pull_request": {
      "url": "https://api.github.com/repos/vmg/redcarpet/pulls/423",
      "html_url": "https://github.com/vmg/redcarpet/pull/423",
      "diff_url": "https://github.com/vmg/redcarpet/pull/423.diff",
      "patch_url": "https://github.com/vmg/redcarpet/pull/423.patch"
    },
    "body": "Previously it was possible to get the renderer to truncate the\r\noutput at a point that would cause it to output unbalanced tags,\r\nfor ex.:\r\n\r\n`__o__@bar.com` -> `<strong>o</st<a href=\"mailto:__o__@bar.com[…]`\r\n\r\nNot great. This commit attempts to mitigate that by tracking the end\r\nof the last inline and making sure rewinds don't run past it. This is\r\nbasically the approach taken by @vmg in vmg/rinku@dc685c1\r\n\r\nThe only issue with this approach I can think of is that we still can't autolink\r\nbare emails like `foo_bar_baz@example.com` (issue #402), but that'd be difficult to handle\r\nwithout a proper way to rewind over inlines in the output buffer."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/422",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/422/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/422/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/422/events",
    "html_url": "https://github.com/vmg/redcarpet/pull/422",
    "id": 44879547,
    "number": 422,
    "title": "Update StripDown for tables",
    "user": {
      "login": "amnesia7",
      "id": 1161448,
      "avatar_url": "https://avatars.githubusercontent.com/u/1161448?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/amnesia7",
      "html_url": "https://github.com/amnesia7",
      "followers_url": "https://api.github.com/users/amnesia7/followers",
      "following_url": "https://api.github.com/users/amnesia7/following{/other_user}",
      "gists_url": "https://api.github.com/users/amnesia7/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/amnesia7/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/amnesia7/subscriptions",
      "organizations_url": "https://api.github.com/users/amnesia7/orgs",
      "repos_url": "https://api.github.com/users/amnesia7/repos",
      "events_url": "https://api.github.com/users/amnesia7/events{/privacy}",
      "received_events_url": "https://api.github.com/users/amnesia7/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-10-04T11:08:35Z",
    "updated_at": "2014-10-04T11:09:26Z",
    "closed_at": null,
    "pull_request": {
      "url": "https://api.github.com/repos/vmg/redcarpet/pulls/422",
      "html_url": "https://github.com/vmg/redcarpet/pull/422",
      "diff_url": "https://github.com/vmg/redcarpet/pull/422.diff",
      "patch_url": "https://github.com/vmg/redcarpet/pull/422.patch"
    },
    "body": "The StripDown renderer handles tables now if tables extension set to true."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/411",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/411/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/411/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/411/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/411",
    "id": 40471792,
    "number": 411,
    "title": "Is markdown table must have header to rendering right",
    "user": {
      "login": "vince-styling",
      "id": 3348207,
      "avatar_url": "https://avatars.githubusercontent.com/u/3348207?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/vince-styling",
      "html_url": "https://github.com/vince-styling",
      "followers_url": "https://api.github.com/users/vince-styling/followers",
      "following_url": "https://api.github.com/users/vince-styling/following{/other_user}",
      "gists_url": "https://api.github.com/users/vince-styling/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/vince-styling/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/vince-styling/subscriptions",
      "organizations_url": "https://api.github.com/users/vince-styling/orgs",
      "repos_url": "https://api.github.com/users/vince-styling/repos",
      "events_url": "https://api.github.com/users/vince-styling/events{/privacy}",
      "received_events_url": "https://api.github.com/users/vince-styling/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/enhancement",
        "name": "enhancement",
        "color": "c7def8"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-08-18T09:59:58Z",
    "updated_at": "2014-08-20T10:16:11Z",
    "closed_at": null,
    "body": "before i use MultiMarkdown to parse below table : \r\n\r\n    | ------------- | ------------- |\r\n    | Content Cell  | Content Cell  |\r\n    | Content Cell  | Content Cell  |\r\n\r\nit's correct, but with Redcarpet didn't, i must add headers to make it right :\r\n\r\n    | First Header  | Second Header |\r\n    | ------------- | ------------- |\r\n    | Content Cell  | Content Cell  |\r\n    | Content Cell  | Content Cell  |\r\n\r\nthe problem is something i needn't table headers, it's trouble to make page always show some empty rows on table top, any way can avoid that?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/408",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/408/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/408/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/408/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/408",
    "id": 39348923,
    "number": 408,
    "title": "IDN links",
    "user": {
      "login": "nono",
      "id": 2767,
      "avatar_url": "https://avatars.githubusercontent.com/u/2767?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/nono",
      "html_url": "https://github.com/nono",
      "followers_url": "https://api.github.com/users/nono/followers",
      "following_url": "https://api.github.com/users/nono/following{/other_user}",
      "gists_url": "https://api.github.com/users/nono/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/nono/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/nono/subscriptions",
      "organizations_url": "https://api.github.com/users/nono/orgs",
      "repos_url": "https://api.github.com/users/nono/repos",
      "events_url": "https://api.github.com/users/nono/events{/privacy}",
      "received_events_url": "https://api.github.com/users/nono/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-08-02T13:24:35Z",
    "updated_at": "2014-11-15T13:46:19Z",
    "closed_at": null,
    "body": "Hi,\r\n\r\nit seems that redcarpet doesn't handle links with IDN hostnames. For example:\r\n\r\n```ruby\r\nr = Redcarpet::Markdown.new Redcarpet::Render::HTML, autolink: true\r\nr.render \"http://nantes.café-vie-privée.fr/\"\r\n# => \"<p><a href=\\\"http://nantes.caf%C3%A9-vie-priv%C3%A9e.fr/\\\">http://nantes.café-vie-privée.fr/</a></p>\\n\"\r\n```\r\n\r\n`nantes.café-vie-privée.fr` is URL-encoded instead of being XN-encoded."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/402",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/402/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/402/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/402/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/402",
    "id": 37760945,
    "number": 402,
    "title": "autolink for email doesn't work with underscores",
    "user": {
      "login": "joelr",
      "id": 17657,
      "avatar_url": "https://avatars.githubusercontent.com/u/17657?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/joelr",
      "html_url": "https://github.com/joelr",
      "followers_url": "https://api.github.com/users/joelr/followers",
      "following_url": "https://api.github.com/users/joelr/following{/other_user}",
      "gists_url": "https://api.github.com/users/joelr/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/joelr/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/joelr/subscriptions",
      "organizations_url": "https://api.github.com/users/joelr/orgs",
      "repos_url": "https://api.github.com/users/joelr/repos",
      "events_url": "https://api.github.com/users/joelr/events{/privacy}",
      "received_events_url": "https://api.github.com/users/joelr/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 2,
    "created_at": "2014-07-14T05:56:47Z",
    "updated_at": "2014-12-29T04:25:10Z",
    "closed_at": null,
    "body": "Currently\r\n```abc_def_ghi@somewhere.com``` will autolink to ```_ghi@somewhere.com```\r\n\r\nAlso this is when escaping markdown of course, so ```abc\\_def\\_ghi@somewhere.com```\r\n\r\nany thoughts?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/399",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/399/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/399/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/399/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/399",
    "id": 36750209,
    "number": 399,
    "title": "Multi-line footnotes",
    "user": {
      "login": "olivierlacan",
      "id": 65950,
      "avatar_url": "https://avatars.githubusercontent.com/u/65950?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/olivierlacan",
      "html_url": "https://github.com/olivierlacan",
      "followers_url": "https://api.github.com/users/olivierlacan/followers",
      "following_url": "https://api.github.com/users/olivierlacan/following{/other_user}",
      "gists_url": "https://api.github.com/users/olivierlacan/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/olivierlacan/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/olivierlacan/subscriptions",
      "organizations_url": "https://api.github.com/users/olivierlacan/orgs",
      "repos_url": "https://api.github.com/users/olivierlacan/repos",
      "events_url": "https://api.github.com/users/olivierlacan/events{/privacy}",
      "received_events_url": "https://api.github.com/users/olivierlacan/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/enhancement",
        "name": "enhancement",
        "color": "c7def8"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 2,
    "created_at": "2014-06-29T17:11:39Z",
    "updated_at": "2014-10-11T05:06:53Z",
    "closed_at": null,
    "body": "I don't know how many of you have been using the great new footnotes feature but I've recently noticed (since I'm verbose as hell) that it was impossible to write footnotes with a new line. Everything has to be on a contiguous line. \r\n\r\nI wouldn't say it's a major issue, although that precludes having any paragraphs in footnotes, which seems a likely use case. \r\n\r\nI realize this may be tricky to implement without a close tag. Any thoughts?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/397",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/397/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/397/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/397/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/397",
    "id": 36304761,
    "number": 397,
    "title": "Markdown parsing error for Chinese Text",
    "user": {
      "login": "qiansen1386",
      "id": 1759658,
      "avatar_url": "https://avatars.githubusercontent.com/u/1759658?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/qiansen1386",
      "html_url": "https://github.com/qiansen1386",
      "followers_url": "https://api.github.com/users/qiansen1386/followers",
      "following_url": "https://api.github.com/users/qiansen1386/following{/other_user}",
      "gists_url": "https://api.github.com/users/qiansen1386/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/qiansen1386/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/qiansen1386/subscriptions",
      "organizations_url": "https://api.github.com/users/qiansen1386/orgs",
      "repos_url": "https://api.github.com/users/qiansen1386/repos",
      "events_url": "https://api.github.com/users/qiansen1386/events{/privacy}",
      "received_events_url": "https://api.github.com/users/qiansen1386/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/non-ASCII",
        "name": "non-ASCII",
        "color": "d4c5f9"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-06-23T15:59:48Z",
    "updated_at": "2014-09-16T07:15:38Z",
    "closed_at": null,
    "body": "If we break the line for each sentence, then the lib will add a white space after the sentence period, which should not happen for Chinese context, As the mark itself contains enough spaces by designed. However many people will break a line for each sentence in editor to make it more readable, just like what we do in English.\r\n\r\nFor example, there is some dummy text, each sentence a line, just to simulate how people usually type:\r\n\r\n```\r\n工拉根又这证性建干式进九离，强无北原得F书雨方适。\r\n片真我即积证导主打，总片性样千斗下公观，地3指辰文露茅。\r\n观前全听马周速它状张，题半素根话质难所压，复主L器强十你折。\r\n提支多果做下斯化精王照器更，办且间每员两虚雨包众。\r\n科称观者入原切何空机，转重干流广济将土生，林众1连红四学取。\r\n率是非的律热权构手反，运活整个全代给把型小，速土V护五属积准。\r\n增便养王太以参么，于非七本回导，代技7完战文。\r\n京族石派置技动战何，系战压反叫少应，度声2虚时起电。\r\n术听四想在信个基取，然去步律太转按都，究豆该吩以杨军。\r\n```\r\nAnd you ll get \r\n\r\n工拉根又这证性建干式进九离，强无北原得F书雨方适。 片真我即积证导主打，总片性样千斗下公观，地3指辰文露茅。 观前全听马周速它状张，题半素根话质难所压，复主L器强十你折。 提支多果做下斯化精王照器更，办且间每员两虚雨包众。 科称观者入原切何空机，转重干流广济将土生，林众1连红四学取。 率是非的律热权构手反，运活整个全代给把型小，速土V护五属积准。 增便养王太以参么，于非七本回导，代技7完战文。 京族石派置技动战何，系战压反叫少应，度声2虚时起电。 术听四想在信个基取，然去步律太转按都，究豆该吩以杨军。\r\n\r\nMaybe it is because Markdown is designed for Latin-characters.  We always add space between each words in this context. However that will not work for East Asia Languages\r\n\r\nHow about just recognize the symbols \"。\" and \"，\", they are period and comma in Chinese-style."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/396",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/396/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/396/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/396/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/396",
    "id": 36276751,
    "number": 396,
    "title": "Nested italic and bold not working properly.",
    "user": {
      "login": "madhurakhal",
      "id": 839882,
      "avatar_url": "https://avatars.githubusercontent.com/u/839882?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/madhurakhal",
      "html_url": "https://github.com/madhurakhal",
      "followers_url": "https://api.github.com/users/madhurakhal/followers",
      "following_url": "https://api.github.com/users/madhurakhal/following{/other_user}",
      "gists_url": "https://api.github.com/users/madhurakhal/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/madhurakhal/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/madhurakhal/subscriptions",
      "organizations_url": "https://api.github.com/users/madhurakhal/orgs",
      "repos_url": "https://api.github.com/users/madhurakhal/repos",
      "events_url": "https://api.github.com/users/madhurakhal/events{/privacy}",
      "received_events_url": "https://api.github.com/users/madhurakhal/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 3,
    "created_at": "2014-06-23T09:58:25Z",
    "updated_at": "2015-01-09T07:00:57Z",
    "closed_at": null,
    "body": "I am using this awesome gem in my current work but run into the problem while nesting bold text inside italic.\r\n\r\nHere is the scenario.\r\n\r\nThis is the code I use:\r\n\r\n~~~markdown\r\n*You **can** combine them*\r\n~~~\r\n\r\nThis is the code produced by the gem:\r\n\r\n~~~html\r\n<p><em>You *</em>can** combine them*</p>\r\n~~~\r\n\r\nI would except the following output:\r\n~~~html\r\n<p><em>You <strong>can<strong> combine them</em></p>\r\n~~~\r\n\r\nPlease see the feedback by clicking on the  edit button.\r\nThanks\r\nMadhu Rakhal Magar"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/393",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/393/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/393/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/393/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/393",
    "id": 35733234,
    "number": 393,
    "title": "Is the behavior of footnote link text correct?",
    "user": {
      "login": "namusyaka",
      "id": 309329,
      "avatar_url": "https://avatars.githubusercontent.com/u/309329?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/namusyaka",
      "html_url": "https://github.com/namusyaka",
      "followers_url": "https://api.github.com/users/namusyaka/followers",
      "following_url": "https://api.github.com/users/namusyaka/following{/other_user}",
      "gists_url": "https://api.github.com/users/namusyaka/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/namusyaka/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/namusyaka/subscriptions",
      "organizations_url": "https://api.github.com/users/namusyaka/orgs",
      "repos_url": "https://api.github.com/users/namusyaka/repos",
      "events_url": "https://api.github.com/users/namusyaka/events{/privacy}",
      "received_events_url": "https://api.github.com/users/namusyaka/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 5,
    "created_at": "2014-06-14T17:57:59Z",
    "updated_at": "2014-06-19T15:31:37Z",
    "closed_at": null,
    "body": "I tried out the following code.\r\n```ruby\r\n     markdown = <<-MD\r\n This is a footnote.[^7]\r\n \r\n [^7]: It provides additional information.\r\n     MD\r\n \r\n     html = <<-HTML\r\n <p>This is a footnote.<sup id=\"fnref7\"><a href=\"#fn7\" rel=\"footnote\">7</a></sup></p>\r\n \r\n <div class=\"footnotes\">\r\n <hr>\r\n <ol>\r\n \r\n <li id=\"fn7\">\r\n <p>It provides additional information.&nbsp;<a href=\"#fnref7\" rev=\"footnote\">&#8617;</a></p>\r\n </li>\r\n \r\n </ol>\r\n </div>\r\n     HTML\r\n     renderer = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :footnotes => true)\r\n     output = renderer.render(markdown)\r\n     assert_equal html, output # false. This result, all 7 will be 1.\r\n```\r\nIs this the correct behavior?\r\nIf not, I'm going to send the pull request about the issue."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/388",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/388/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/388/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/388/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/388",
    "id": 35408339,
    "number": 388,
    "title": "Character encoding issue with autolinking",
    "user": {
      "login": "whatupdave",
      "id": 7064,
      "avatar_url": "https://avatars.githubusercontent.com/u/7064?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/whatupdave",
      "html_url": "https://github.com/whatupdave",
      "followers_url": "https://api.github.com/users/whatupdave/followers",
      "following_url": "https://api.github.com/users/whatupdave/following{/other_user}",
      "gists_url": "https://api.github.com/users/whatupdave/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/whatupdave/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/whatupdave/subscriptions",
      "organizations_url": "https://api.github.com/users/whatupdave/orgs",
      "repos_url": "https://api.github.com/users/whatupdave/repos",
      "events_url": "https://api.github.com/users/whatupdave/events{/privacy}",
      "received_events_url": "https://api.github.com/users/whatupdave/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/non-ASCII",
        "name": "non-ASCII",
        "color": "d4c5f9"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2014-06-10T17:59:24Z",
    "updated_at": "2014-09-23T22:12:31Z",
    "closed_at": null,
    "body": "Not sure what's causing this:\r\n\r\n    > ruby -e \"require 'redcarpet'; puts Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render('d@example.coü')\"\r\n    <p><a href=\"mailto:d@example.co%C3\">d@example.co�</a>�</p>\r\n\r\n    › ruby -e \"require 'redcarpet'; puts Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true).render('d@example.coü').inspect\"\r\n    \"<p><a href=\\\"mailto:d@example.co%C3\\\">d@example.co\\xC3</a>\\xBC</p>\\n\"\r\n\r\nIt's fine without autolinking:\r\n\r\n    › ruby -e \"require 'redcarpet'; puts Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: false).render('d@example.coü')\"\r\n    <p>d@example.coü</p>\r\n"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/378",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/378/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/378/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/378/events",
    "html_url": "https://github.com/vmg/redcarpet/pull/378",
    "id": 34123785,
    "number": 378,
    "title": "Fix over-zealous backslash replacement",
    "user": {
      "login": "jcheatham",
      "id": 1170999,
      "avatar_url": "https://avatars.githubusercontent.com/u/1170999?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/jcheatham",
      "html_url": "https://github.com/jcheatham",
      "followers_url": "https://api.github.com/users/jcheatham/followers",
      "following_url": "https://api.github.com/users/jcheatham/following{/other_user}",
      "gists_url": "https://api.github.com/users/jcheatham/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/jcheatham/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/jcheatham/subscriptions",
      "organizations_url": "https://api.github.com/users/jcheatham/orgs",
      "repos_url": "https://api.github.com/users/jcheatham/repos",
      "events_url": "https://api.github.com/users/jcheatham/events{/privacy}",
      "received_events_url": "https://api.github.com/users/jcheatham/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 6,
    "created_at": "2014-05-22T21:29:21Z",
    "updated_at": "2014-07-12T16:03:12Z",
    "closed_at": null,
    "pull_request": {
      "url": "https://api.github.com/repos/vmg/redcarpet/pulls/378",
      "html_url": "https://github.com/vmg/redcarpet/pull/378",
      "diff_url": "https://github.com/vmg/redcarpet/pull/378.diff",
      "patch_url": "https://github.com/vmg/redcarpet/pull/378.patch"
    },
    "body": "Hi,\r\n\r\nTwo things, the [first](https://github.com/jcheatham/redcarpet/commit/24127e19c97887016f492bf80a7f906ab7f6b4f8) is to fix the [current travis breakage](https://travis-ci.org/vmg/redcarpet/builds/25455860).  I wasn't sure why it started with the last build, but it seems like it was broken since the original commit, so maybe some library or gem update?  Just looks like the test just needed a \\n though.\r\n\r\nSecond is for #214 ([specifically](https://github.com/vmg/redcarpet/issues/214#issuecomment-22977188)), didn't fix the original emphasis problem in that issue though, looks like that's in char_emphasis, which I'll try and take a look at that when I can.  I couldn't find any instances where the backslash needed to be escaped, but please let me know if there's some case I missed (example test would be awesome! :)\r\n\r\nAnd of course please let me know if this needs something else/more to get merged.\r\n\r\nCheers!"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/377",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/377/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/377/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/377/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/377",
    "id": 33778128,
    "number": 377,
    "title": ":no_intra_emphasis in russian text",
    "user": {
      "login": "IlnurG",
      "id": 2394506,
      "avatar_url": "https://avatars.githubusercontent.com/u/2394506?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/IlnurG",
      "html_url": "https://github.com/IlnurG",
      "followers_url": "https://api.github.com/users/IlnurG/followers",
      "following_url": "https://api.github.com/users/IlnurG/following{/other_user}",
      "gists_url": "https://api.github.com/users/IlnurG/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/IlnurG/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/IlnurG/subscriptions",
      "organizations_url": "https://api.github.com/users/IlnurG/orgs",
      "repos_url": "https://api.github.com/users/IlnurG/repos",
      "events_url": "https://api.github.com/users/IlnurG/events{/privacy}",
      "received_events_url": "https://api.github.com/users/IlnurG/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/non-ASCII",
        "name": "non-ASCII",
        "color": "d4c5f9"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2014-05-19T08:08:51Z",
    "updated_at": "2014-07-06T20:42:02Z",
    "closed_at": null,
    "body": "Hello, I have problems.\r\n\r\n` markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, no_intra_emphasis: true) `\r\n`markdown.render('foo_bar_baz') `\r\n`=> \"<p>foo_bar_baz</p>\\n\"`\r\n\r\nIt's works nice. But rendering russian text add `<em>` tags\r\n\r\n`markdown.render('фыв_фыв_фыв')`\r\n`=> \"<p>фыв<em>фыв</em>фыв</p>\\n\"`\r\n\r\nWhat i can do?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/365",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/365/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/365/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/365/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/365",
    "id": 30725138,
    "number": 365,
    "title": "{% highlight js %} followed by <div> enclosing <img> causing markdown between them not to be processed",
    "user": {
      "login": "aeoril",
      "id": 1267648,
      "avatar_url": "https://avatars.githubusercontent.com/u/1267648?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/aeoril",
      "html_url": "https://github.com/aeoril",
      "followers_url": "https://api.github.com/users/aeoril/followers",
      "following_url": "https://api.github.com/users/aeoril/following{/other_user}",
      "gists_url": "https://api.github.com/users/aeoril/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/aeoril/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/aeoril/subscriptions",
      "organizations_url": "https://api.github.com/users/aeoril/orgs",
      "repos_url": "https://api.github.com/users/aeoril/repos",
      "events_url": "https://api.github.com/users/aeoril/events{/privacy}",
      "received_events_url": "https://api.github.com/users/aeoril/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 6,
    "created_at": "2014-04-02T21:03:28Z",
    "updated_at": "2014-10-01T20:50:28Z",
    "closed_at": null,
    "body": "Here is my markdown, processed with redcarpet in Jekyll.  I am using Pygments as my syntax highlighter for code.  The markdown between the {% highlight js %} ... {% endhighlight %} and the &lt;div>&lt;img ...>&lt;/div> tag is not being processed - it just outputs it as if it were text.  If I get rid of the &lt;img> inside the &lt;div> it works just fine:\r\n\r\n```\r\n---\r\nlayout: post\r\ntitle:  \"RedCarpet Markdown Test\"\r\ndate:   2014-04-02 12:12:12\r\ncategories: test\r\n---\r\n\r\n{% highlight js %}\r\nfunction myfunc(x) {\r\n    x += 5;\r\n    return x;\r\n}\r\n{% endhighlight %}\r\n\r\n### This is a Markdown Header\r\n\r\nThis is some markdown text with an inline code block: `var v = myFunc(10)`.  This markdown *is not* properly processed.\r\n\r\n<div>\r\n    <img style=\"width: 640px;\" src=\"/images/delegate_based/constructor_simplified.png\" alt=\"Constructor Diagram\" />\r\n</div>\r\n\r\n### This is a Markdown Header\r\n\r\nThis is some markdown text with an inline code block: `var v = myFunc(10)`.  This markdown *is* properly processed.\r\n```"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/358",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/358/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/358/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/358/events",
    "html_url": "https://github.com/vmg/redcarpet/pull/358",
    "id": 29514544,
    "number": 358,
    "title": "Autolink URL that contains CJK letters will raise ArgumentError.",
    "user": {
      "login": "JuanitoFatas",
      "id": 1000669,
      "avatar_url": "https://avatars.githubusercontent.com/u/1000669?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/JuanitoFatas",
      "html_url": "https://github.com/JuanitoFatas",
      "followers_url": "https://api.github.com/users/JuanitoFatas/followers",
      "following_url": "https://api.github.com/users/JuanitoFatas/following{/other_user}",
      "gists_url": "https://api.github.com/users/JuanitoFatas/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/JuanitoFatas/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/JuanitoFatas/subscriptions",
      "organizations_url": "https://api.github.com/users/JuanitoFatas/orgs",
      "repos_url": "https://api.github.com/users/JuanitoFatas/repos",
      "events_url": "https://api.github.com/users/JuanitoFatas/events{/privacy}",
      "received_events_url": "https://api.github.com/users/JuanitoFatas/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/non-ASCII",
        "name": "non-ASCII",
        "color": "d4c5f9"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 3,
    "created_at": "2014-03-16T11:01:28Z",
    "updated_at": "2014-07-06T20:42:02Z",
    "closed_at": null,
    "pull_request": {
      "url": "https://api.github.com/repos/vmg/redcarpet/pulls/358",
      "html_url": "https://github.com/vmg/redcarpet/pull/358",
      "diff_url": "https://github.com/vmg/redcarpet/pull/358.diff",
      "patch_url": "https://github.com/vmg/redcarpet/pull/358.patch"
    },
    "body": "I'm using Ruby 2.1.1p76 on OS X 10.6.8. The follow is the test for this scenario.\r\n\r\nInput url: http://zh.wikipedia.org/wiki/码\r\n\r\nRender this url with `autolink` flag enabled will lead to `ArgumentError: invalid byte sequence in UTF-8`\r\n\r\n```ruby\r\n...\r\n\r\n  def test_auto_linked_argument_error\r\n    rd = render_with({ autolink: true }, \"http://zh.wikipedia.org/wiki/码\")\r\n    exp = %{<p><a href=\"http://zh.wikipedia.org/wiki/%E7%A0%81\">http://zh.wikipedia.org/wiki/码</a></p>\\n}\r\n    html_equal exp, rd\r\n  end\r\n\r\n...\r\n```\r\n\r\nWhen I Run: `ruby -Itest test/markdown_test.rb`\r\n\r\nI get:\r\n\r\n```\r\nError: test_auto_linked_argument_error(MarkdownTest)\r\n  ArgumentError: invalid byte sequence in UTF-8\r\n/Users/Mac/.rvm/gems/ruby-2.1.1/gems/nokogiri-1.6.1/lib/nokogiri/html/document_fragment.rb:27:in `initialize'\r\n/Users/Mac/.rvm/gems/ruby-2.1.1/gems/nokogiri-1.6.1/lib/nokogiri/html/document_fragment.rb:14:in `new'\r\n/Users/Mac/.rvm/gems/ruby-2.1.1/gems/nokogiri-1.6.1/lib/nokogiri/html/document_fragment.rb:14:in `parse'\r\n/Users/Mac/dev2/redcarpet/test/test_helper.rb:15:in `html_equal'\r\ntest/markdown_test.rb:132:in `test_auto_linked_argument_error'\r\n     129:   def test_auto_linked_argument_error\r\n     130:     rd = render_with({ autolink: true }, \"http://zh.wikipedia.org/wiki/码\")\r\n     131:     exp = %{<p><a href=\"http://zh.wikipedia.org/wiki/%E7%A0%81\">http://zh.wikipedia.org/wiki/码</a></p>\\n}\r\n  => 132:     html_equal exp, rd\r\n     133:   end\r\n     134:\r\n     135:   def test_memory_leak_when_parsing_char_links\r\n```"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/332",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/332/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/332/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/332/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/332",
    "id": 24289014,
    "number": 332,
    "title": "Add smarty pants for nbsp and shy",
    "user": {
      "login": "penibelst",
      "id": 3617307,
      "avatar_url": "https://avatars.githubusercontent.com/u/3617307?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/penibelst",
      "html_url": "https://github.com/penibelst",
      "followers_url": "https://api.github.com/users/penibelst/followers",
      "following_url": "https://api.github.com/users/penibelst/following{/other_user}",
      "gists_url": "https://api.github.com/users/penibelst/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/penibelst/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/penibelst/subscriptions",
      "organizations_url": "https://api.github.com/users/penibelst/orgs",
      "repos_url": "https://api.github.com/users/penibelst/repos",
      "events_url": "https://api.github.com/users/penibelst/events{/privacy}",
      "received_events_url": "https://api.github.com/users/penibelst/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/enhancement",
        "name": "enhancement",
        "color": "c7def8"
      },
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/SmartyPants",
        "name": "SmartyPants",
        "color": "bfe5bf"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 4,
    "created_at": "2013-12-14T10:02:06Z",
    "updated_at": "2014-02-14T19:12:02Z",
    "closed_at": null,
    "body": "Russian and German words are long comparing to English. That’s why I set a lot **no-break spaces** manually. And in Russian I set a lot of **soft hyphens** because of typography specifics. As I prefer markdown for prose, I found that\r\n\r\n* `·` for `&nbsp;`\r\n* `~` for `&shy;`\r\n\r\nis easy to reach *and* lets my source code readable. Checkout a little [Russian example](https://raw.github.com/penibelst/doktorbro.net/master/source/_posts/2010-10-23-sudya-na-burime.markdown). In Jekyll I’m able to to use a simple liquid replace filter over the whole page content to convert the characters to HTML entities.\r\n\r\nI would love to see that features native in Redcarpet. I was hacking in *html_smartypants.c* without success, because it’s too hard for me to guess how it works. Can @robin850 assist me again to implement that features?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/327",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/327/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/327/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/327/events",
    "html_url": "https://github.com/vmg/redcarpet/pull/327",
    "id": 23621197,
    "number": 327,
    "title": "Add --pygments command line option.",
    "user": {
      "login": "ananelson",
      "id": 14220,
      "avatar_url": "https://avatars.githubusercontent.com/u/14220?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/ananelson",
      "html_url": "https://github.com/ananelson",
      "followers_url": "https://api.github.com/users/ananelson/followers",
      "following_url": "https://api.github.com/users/ananelson/following{/other_user}",
      "gists_url": "https://api.github.com/users/ananelson/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/ananelson/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/ananelson/subscriptions",
      "organizations_url": "https://api.github.com/users/ananelson/orgs",
      "repos_url": "https://api.github.com/users/ananelson/repos",
      "events_url": "https://api.github.com/users/ananelson/events{/privacy}",
      "received_events_url": "https://api.github.com/users/ananelson/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": {
      "url": "https://api.github.com/repos/vmg/redcarpet/milestones/4",
      "labels_url": "https://api.github.com/repos/vmg/redcarpet/milestones/4/labels",
      "id": 725920,
      "number": 4,
      "title": "3.3.0",
      "description": "",
      "creator": {
        "login": "robin850",
        "id": 354185,
        "avatar_url": "https://avatars.githubusercontent.com/u/354185?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/robin850",
        "html_url": "https://github.com/robin850",
        "followers_url": "https://api.github.com/users/robin850/followers",
        "following_url": "https://api.github.com/users/robin850/following{/other_user}",
        "gists_url": "https://api.github.com/users/robin850/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/robin850/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/robin850/subscriptions",
        "organizations_url": "https://api.github.com/users/robin850/orgs",
        "repos_url": "https://api.github.com/users/robin850/repos",
        "events_url": "https://api.github.com/users/robin850/events{/privacy}",
        "received_events_url": "https://api.github.com/users/robin850/received_events",
        "type": "User",
        "site_admin": false
      },
      "open_issues": 4,
      "closed_issues": 5,
      "state": "open",
      "created_at": "2014-07-19T13:15:06Z",
      "updated_at": "2014-12-21T18:17:46Z",
      "due_on": null,
      "closed_at": null
    },
    "comments": 14,
    "created_at": "2013-12-03T04:49:19Z",
    "updated_at": "2014-07-27T09:20:26Z",
    "closed_at": null,
    "pull_request": {
      "url": "https://api.github.com/repos/vmg/redcarpet/pulls/327",
      "html_url": "https://github.com/vmg/redcarpet/pull/327",
      "diff_url": "https://github.com/vmg/redcarpet/pull/327.diff",
      "patch_url": "https://github.com/vmg/redcarpet/pull/327.patch"
    },
    "body": "I have added redcarpet as a supported filter in dexy (http://dexy.it). As dexy is a Python package I am using the command line interface. I would like to support pygments syntax highlighting so needed to expose this via the command line."
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/318",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/318/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/318/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/318/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/318",
    "id": 21235649,
    "number": 318,
    "title": "Raising errors in callbacks crashes a Markdown instance",
    "user": {
      "login": "adamflorin",
      "id": 15598,
      "avatar_url": "https://avatars.githubusercontent.com/u/15598?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/adamflorin",
      "html_url": "https://github.com/adamflorin",
      "followers_url": "https://api.github.com/users/adamflorin/followers",
      "following_url": "https://api.github.com/users/adamflorin/following{/other_user}",
      "gists_url": "https://api.github.com/users/adamflorin/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/adamflorin/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/adamflorin/subscriptions",
      "organizations_url": "https://api.github.com/users/adamflorin/orgs",
      "repos_url": "https://api.github.com/users/adamflorin/repos",
      "events_url": "https://api.github.com/users/adamflorin/events{/privacy}",
      "received_events_url": "https://api.github.com/users/adamflorin/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 0,
    "created_at": "2013-10-18T18:13:43Z",
    "updated_at": "2013-10-18T18:19:35Z",
    "closed_at": null,
    "body": "Please see reproducible case:\r\n\r\nhttps://gist.github.com/adamflorin/7045640\r\n\r\nIf I use a Markdown instance repeatedly to render text, and raise an error within a custom formatting callback, eventually Redcarpet (or Sundown?) will crash, bringing down Ruby with it, with the error:\r\n\r\n    Assertion failed: (md->work_bufs[BUFFER_BLOCK].size == 0), function sd_markdown_render, file markdown.c, line 2544.\r\n    Abort trap: 6\r\n\r\nIn my case, I can just instantiate a new Redcarpet instance each time I render, so this is not pressing for me. But perhaps of interest to you?"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/312",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/312/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/312/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/312/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/312",
    "id": 20069249,
    "number": 312,
    "title": "Consider using Hoedown",
    "user": {
      "login": "devinus",
      "id": 4836,
      "avatar_url": "https://avatars.githubusercontent.com/u/4836?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/devinus",
      "html_url": "https://github.com/devinus",
      "followers_url": "https://api.github.com/users/devinus/followers",
      "following_url": "https://api.github.com/users/devinus/following{/other_user}",
      "gists_url": "https://api.github.com/users/devinus/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/devinus/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/devinus/subscriptions",
      "organizations_url": "https://api.github.com/users/devinus/orgs",
      "repos_url": "https://api.github.com/users/devinus/repos",
      "events_url": "https://api.github.com/users/devinus/events{/privacy}",
      "received_events_url": "https://api.github.com/users/devinus/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [

    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 8,
    "created_at": "2013-09-25T20:53:35Z",
    "updated_at": "2014-09-04T00:14:14Z",
    "closed_at": null,
    "body": "I have revived Sundown into an improved library called Hoedown!\r\n\r\nhttps://github.com/hoedown/hoedown\r\n\r\nHere, I merged long languishing pull requests from Sundown, merged almost every improvement from Redcarpet[^1], merged improvements from Rinku and Houdini, greatly improved and standardized the API, and fixed [many potential bugs](https://gist.github.com/devinus/30b6df78d96eb9f06d33).\r\n\r\nFull list of changes: https://github.com/hoedown/hoedown/compare/vmg:master...master\r\n\r\nSundown had a rich [collection of bindings](https://github.com/vmg/sundown#bindings) and it would truly be a shame if we couldn't all benefit from a single library in the future.\r\n\r\n[^1]: The *only* improvement from Redcarpet I couldn't accept was the GitHub style TOC links. While I'd love to add it, Redcarpet uses \"ruby.h\" to accomplish this.\r\n\r\n"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/307",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/307/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/307/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/307/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/307",
    "id": 18750671,
    "number": 307,
    "title": "Duplicate anchor names",
    "user": {
      "login": "Tuckie",
      "id": 248653,
      "avatar_url": "https://avatars.githubusercontent.com/u/248653?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Tuckie",
      "html_url": "https://github.com/Tuckie",
      "followers_url": "https://api.github.com/users/Tuckie/followers",
      "following_url": "https://api.github.com/users/Tuckie/following{/other_user}",
      "gists_url": "https://api.github.com/users/Tuckie/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Tuckie/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Tuckie/subscriptions",
      "organizations_url": "https://api.github.com/users/Tuckie/orgs",
      "repos_url": "https://api.github.com/users/Tuckie/repos",
      "events_url": "https://api.github.com/users/Tuckie/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Tuckie/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": {
      "login": "robin850",
      "id": 354185,
      "avatar_url": "https://avatars.githubusercontent.com/u/354185?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/robin850",
      "html_url": "https://github.com/robin850",
      "followers_url": "https://api.github.com/users/robin850/followers",
      "following_url": "https://api.github.com/users/robin850/following{/other_user}",
      "gists_url": "https://api.github.com/users/robin850/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/robin850/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/robin850/subscriptions",
      "organizations_url": "https://api.github.com/users/robin850/orgs",
      "repos_url": "https://api.github.com/users/robin850/repos",
      "events_url": "https://api.github.com/users/robin850/events{/privacy}",
      "received_events_url": "https://api.github.com/users/robin850/received_events",
      "type": "User",
      "site_admin": false
    },
    "milestone": {
      "url": "https://api.github.com/repos/vmg/redcarpet/milestones/4",
      "labels_url": "https://api.github.com/repos/vmg/redcarpet/milestones/4/labels",
      "id": 725920,
      "number": 4,
      "title": "3.3.0",
      "description": "",
      "creator": {
        "login": "robin850",
        "id": 354185,
        "avatar_url": "https://avatars.githubusercontent.com/u/354185?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/robin850",
        "html_url": "https://github.com/robin850",
        "followers_url": "https://api.github.com/users/robin850/followers",
        "following_url": "https://api.github.com/users/robin850/following{/other_user}",
        "gists_url": "https://api.github.com/users/robin850/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/robin850/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/robin850/subscriptions",
        "organizations_url": "https://api.github.com/users/robin850/orgs",
        "repos_url": "https://api.github.com/users/robin850/repos",
        "events_url": "https://api.github.com/users/robin850/events{/privacy}",
        "received_events_url": "https://api.github.com/users/robin850/received_events",
        "type": "User",
        "site_admin": false
      },
      "open_issues": 4,
      "closed_issues": 5,
      "state": "open",
      "created_at": "2014-07-19T13:15:06Z",
      "updated_at": "2014-12-21T18:17:46Z",
      "due_on": null,
      "closed_at": null
    },
    "comments": 3,
    "created_at": "2013-08-29T19:01:25Z",
    "updated_at": "2014-07-19T13:16:26Z",
    "closed_at": null,
    "body": "When you have a headers with the same names, duplicate anchors are created.\r\n\r\n```\r\n# a section\r\n## a subsection\r\n# another section\r\n## a subsection\r\n# another section\r\n```\r\n=\r\n```\r\nid=\"a-section\"\r\nid=\"a-subsection\"\r\nid=\"another-section\"\r\nid=\"a-subsection\"\r\nid=\"another-section\"\r\n```\r\n\r\nOne fix would be to append -2, -3, -4... when an anchor with the same name as a prior anchor is found.\r\n```\r\nid=\"a-section\"\r\nid=\"a-subsection\"\r\nid=\"another-section\"\r\nid=\"a-subsection-2\"\r\nid=\"another-section-2\"\r\n```\r\nAnother interesting option (that wouldn't cut down on all collisions, so the first idea would have to be a fallback) would be to always prepend the section it is located in.\r\n```\r\nid=\"a-section\"\r\nid=\"a-section--a-subsection\"\r\nid=\"another-section\"\r\nid=\"another-section--a-subsection\"\r\nid=\"another-section-2\"\r\n```"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/306",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/306/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/306/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/306/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/306",
    "id": 18727905,
    "number": 306,
    "title": "Is there a way to add css classes to markdown?",
    "user": {
      "login": "firedev",
      "id": 115612,
      "avatar_url": "https://avatars.githubusercontent.com/u/115612?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/firedev",
      "html_url": "https://github.com/firedev",
      "followers_url": "https://api.github.com/users/firedev/followers",
      "following_url": "https://api.github.com/users/firedev/following{/other_user}",
      "gists_url": "https://api.github.com/users/firedev/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/firedev/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/firedev/subscriptions",
      "organizations_url": "https://api.github.com/users/firedev/orgs",
      "repos_url": "https://api.github.com/users/firedev/repos",
      "events_url": "https://api.github.com/users/firedev/events{/privacy}",
      "received_events_url": "https://api.github.com/users/firedev/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/enhancement",
        "name": "enhancement",
        "color": "c7def8"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 7,
    "created_at": "2013-08-29T12:33:24Z",
    "updated_at": "2014-05-10T19:13:20Z",
    "closed_at": null,
    "body": "Is there a way to add css classes to redcarpet markdown? Something like this would work:\r\n\r\n```\r\n![](/image.jpg){.callout}\r\n```"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/305",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/305/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/305/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/305/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/305",
    "id": 18707847,
    "number": 305,
    "title": "`ー@0.0` is wrongly autolinked on Windows.",
    "user": {
      "login": "msr1k",
      "id": 726067,
      "avatar_url": "https://avatars.githubusercontent.com/u/726067?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/msr1k",
      "html_url": "https://github.com/msr1k",
      "followers_url": "https://api.github.com/users/msr1k/followers",
      "following_url": "https://api.github.com/users/msr1k/following{/other_user}",
      "gists_url": "https://api.github.com/users/msr1k/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/msr1k/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/msr1k/subscriptions",
      "organizations_url": "https://api.github.com/users/msr1k/orgs",
      "repos_url": "https://api.github.com/users/msr1k/repos",
      "events_url": "https://api.github.com/users/msr1k/events{/privacy}",
      "received_events_url": "https://api.github.com/users/msr1k/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      },
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/Windows",
        "name": "Windows",
        "color": "fad8c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 1,
    "created_at": "2013-08-29T02:02:22Z",
    "updated_at": "2014-08-23T11:03:41Z",
    "closed_at": null,
    "body": "Following code becomes\r\n\r\n```ruby\r\n# encoding: utf-8\r\n\r\nrequire 'redcarpet'\r\n\r\nmd = Redcarpet::Markdown.new(\r\n  Redcarpet::Render::HTML,\r\n  :autolink => true\r\n)\r\n\r\nputs md.render( \"ー@0.0\" )\r\n```\r\n\r\n- On linux\r\n\r\n        <p>ー@0.0</p>\r\n\r\n    - OS: Ubuntu 13.04 32bit\r\n    - Ruby: 1.9.3p448\r\n    - redcarpet: 3.0.0\r\n\r\n- But on Windows\r\n\r\n        <p>a?<a href=\"mailto:%BC@0.0\">?@0.0</a></p>\r\n\r\n    - OS: Windows XP 32bit SP3\r\n    - Ruby: 1.9.3p385 (MinGW)\r\n    - redcarpet: 3.0.0\r\n"
  },
  {
    "url": "https://api.github.com/repos/vmg/redcarpet/issues/268",
    "labels_url": "https://api.github.com/repos/vmg/redcarpet/issues/268/labels{/name}",
    "comments_url": "https://api.github.com/repos/vmg/redcarpet/issues/268/comments",
    "events_url": "https://api.github.com/repos/vmg/redcarpet/issues/268/events",
    "html_url": "https://github.com/vmg/redcarpet/issues/268",
    "id": 15519380,
    "number": 268,
    "title": "Inline HTML comments are not properly ignored, and instead is treated and escaped as text.",
    "user": {
      "login": "jimhester",
      "id": 205275,
      "avatar_url": "https://avatars.githubusercontent.com/u/205275?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/jimhester",
      "html_url": "https://github.com/jimhester",
      "followers_url": "https://api.github.com/users/jimhester/followers",
      "following_url": "https://api.github.com/users/jimhester/following{/other_user}",
      "gists_url": "https://api.github.com/users/jimhester/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/jimhester/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/jimhester/subscriptions",
      "organizations_url": "https://api.github.com/users/jimhester/orgs",
      "repos_url": "https://api.github.com/users/jimhester/repos",
      "events_url": "https://api.github.com/users/jimhester/events{/privacy}",
      "received_events_url": "https://api.github.com/users/jimhester/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "url": "https://api.github.com/repos/vmg/redcarpet/labels/bug",
        "name": "bug",
        "color": "f7c6c7"
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "milestone": null,
    "comments": 4,
    "created_at": "2013-06-13T17:52:49Z",
    "updated_at": "2014-10-26T20:36:14Z",
    "closed_at": null,
    "body": "Input:\r\n```\r\n<div></div><!-- comment -->\r\n# A Header #\r\n```\r\nCurrent output:\r\n```\r\n<p><div></div>&lt;!-- comment --&gt;</p>\r\n\r\n<h1>A Header<h1>\r\n```\r\nDesired output:\r\n```\r\n<div></div><!-- comment -->\r\n\r\n<h1>A Header<h1>\r\n```\r\n\r\nThe comments are parsed correctly as long as they are on their own line, but when they are inline with other tags they are treated as text.\r\n"
  }
]
