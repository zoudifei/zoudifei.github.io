---
layout: page       # 必须：使用「页面布局」（主题自带，不要改）
title: "文章列表"   # 页面标题（显示在页面顶部）
permalink: /posts/ # 关键！指定页面路径为 /posts（访问时用这个路径）
---

{% for post in site.posts %}
  - {{ post.date | date: "%Y-%m-%d" }} → [{{ post.title }}]({{ post.url }})
{% endfor %}