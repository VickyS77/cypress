import {
  Client,
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
} from '@urql/core'
import { cacheExchange as graphCacheExchange } from '@urql/exchange-graphcache'

// import { initGraphQLIPC } from './graphqlIpc'
import { urqlSchema } from '../generated/urql-introspection.gen'

export function makeCacheExchange () {
  return graphCacheExchange({
    // @ts-ignore
    schema: urqlSchema,
    keys: {
      NavigationMenu: (data) => data.__typename,
      App: (data) => data.__typename,
      Wizard: (data) => data.__typename,
    },
  })
}

export function makeUrqlClient (): Client {
  // initGraphQLIPC()

  // TODO: investigate creating ipcExchange
  return createClient({
    url: 'http://localhost:52159/graphql',
    requestPolicy: 'cache-and-network',
    exchanges: [
      dedupExchange,
      errorExchange({
        onError (error) {
          // eslint-disable-next-line
          console.error(error)
        },
      }),
      makeCacheExchange(),
      fetchExchange,
    ],
  })
}
