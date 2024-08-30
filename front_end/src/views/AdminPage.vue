<template>
    <div class="admin-page">
      <h1>Create a New Blog</h1>
      <form @submit.prevent="createBlog">
        <div>
          <label for="title">Title:</label>
          <input type="text" v-model="title" id="title" required>
        </div>
        <div>
          <label for="content">Content:</label>
          <textarea v-model="content" id="content" required></textarea>
        </div>
        <button type="submit">Create Blog</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        title: '',
        content: '',
        errorMessage: ''
      };
    },
    methods: {
      getCsrfToken() {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        return token;
      },
  
      async createBlog() {
        const csrfToken = this.getCsrfToken();
  
        try {
          const response = await axios.post('127.0.0.1:8000/api/blogs', {
            title: this.title,
            content: this.content
          }, {
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            }
          });
  
          console.log('Blog created successfully:', response.data);
          this.title = '';
          this.content = '';
          this.errorMessage = '';
        } catch (error) {
          console.error('Error creating blog:', error);
          this.errorMessage = 'Failed to create blog. Please try again.';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .error {
    color: red;
  }
  </style>
  