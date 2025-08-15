import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './services/graphql'
import App from './App'
import './index.css'
import './styles/markdown.css'
// 引入 Highlight.js 的基础样式
import 'highlight.js/styles/github-dark.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
