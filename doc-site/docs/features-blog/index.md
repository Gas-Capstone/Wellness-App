# Development blog

This will include writeups on each of the features of UpKeep, as well as some developer insight.

<script setup>
    import { data as posts } from './posts.data.ts'
    import { withBase } from 'vitepress'
</script>

<ul>
    <li v-for="post in posts" :key="post.url">
        <a :href="withBase(post.url)">{{ post.title }}</a>
        <span> - {{ post.date }}</span>
        <p v-if="post.description">{{ post.description }}</p>
    </li>
</ul>
