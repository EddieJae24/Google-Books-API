import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
       // We have to set up our Vite client-side development server to proxy API requests to our server-side Node server at port 3001 in order to hit our GraphQL application.
      '/graphql': {
        target: 'https://google-books-api-backend1.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/graphql': {
//         target: 'http://localhost:3001',
//         secure: false,
//         changeOrigin: true
//       }
//     }
//   }
// })
