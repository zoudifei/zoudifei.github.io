---
layout: tags
title: Tags
icon: fas fa-tags
order: 3
---

{% for tag in site.tags %}
  {% assign tag_url = tag[0] | slugify | url_encode | prepend: site.tag_path | append: '/' | relative_url %}
  <a href="{{ tag_url }}" class="tag-item">{{ tag[0] }} ({{ tag[1].size }})</a>
{% endfor %}