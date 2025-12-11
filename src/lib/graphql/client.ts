/**
 * Client GraphQL modulaire et scalable avec urql.
 * Architecture permettant de gérer plusieurs services GraphQL.
 */
import { 
  Client, 
  cacheExchange, 
  fetchExchange,
  mapExchange,
  type Exchange,
  type Operation,
} from 'urql';
import { authExchange } from '@urql/exchange-auth';

// =============================================================================
// TYPES
// =============================================================================

export interface ServiceConfig {
  url: string;
  apiKey?: string;
  apiSecret?: string;
  getAuthToken?: () => Promise<string | null>;
}

export interface GraphQLServices {
  profile: ServiceConfig;
  // Ajouter d'autres services ici à l'avenir
  // listing: ServiceConfig;
  // notification: ServiceConfig;
}

// =============================================================================
// CONFIGURATION DES SERVICES
// =============================================================================

const services: GraphQLServices = {
  profile: {
    url: process.env.NEXT_PUBLIC_PROFILE_SERVICE_URL || 'http://localhost:8000/graphql',
    apiKey: process.env.NEXT_PUBLIC_PROFILE_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_PROFILE_API_SECRET,
  },
};

// =============================================================================
// EXCHANGES PERSONNALISÉS
// =============================================================================

/**
 * Exchange pour ajouter les headers d'authentification API
 */
const createApiKeyExchange = (config: ServiceConfig): Exchange => {
  return mapExchange({
    onOperation(operation: Operation) {
      const fetchOptions = typeof operation.context.fetchOptions === 'function'
        ? operation.context.fetchOptions()
        : operation.context.fetchOptions || {};

      return {
        ...operation,
        context: {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              ...((fetchOptions as RequestInit).headers || {}),
              ...(config.apiKey && { 'X-API-Key': config.apiKey }),
              ...(config.apiSecret && { 'X-API-Secret': config.apiSecret }),
            },
          },
        },
      };
    },
  });
};

/**
 * Exchange pour l'authentification utilisateur (JWT)
 */
const createUserAuthExchange = (getToken: () => Promise<string | null>): Exchange => {
  return authExchange(async (utils) => {
    let token = await getToken();

    return {
      addAuthToOperation(operation) {
        if (!token) return operation;
        return utils.appendHeaders(operation, {
          Authorization: `Bearer ${token}`,
        });
      },
      didAuthError(error) {
        return error.graphQLErrors.some(
          (e) => e.extensions?.code === 'UNAUTHORIZED'
        );
      },
      async refreshAuth() {
        token = await getToken();
      },
    };
  });
};

/**
 * Exchange pour le logging en développement
 */
const devLogExchange: Exchange = mapExchange({
  onOperation(operation) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphQL] Operation:', operation.kind, operation.query.definitions);
    }
    return operation;
  },
  onResult(result) {
    if (process.env.NODE_ENV === 'development') {
      if (result.error) {
        console.error('[GraphQL] Error:', result.error);
      }
    }
    return result;
  },
});

// =============================================================================
// CRÉATION DES CLIENTS
// =============================================================================

/**
 * Crée un client GraphQL pour un service spécifique
 */
export function createServiceClient(
  serviceName: keyof GraphQLServices,
  options?: {
    getAuthToken?: () => Promise<string | null>;
  }
): Client {
  const config = services[serviceName];
  
  if (!config) {
    throw new Error(`Service GraphQL "${serviceName}" non configuré`);
  }

  const exchanges: Exchange[] = [
    devLogExchange,
    cacheExchange,
  ];

  // Ajouter l'authentification API si configurée
  if (config.apiKey) {
    exchanges.push(createApiKeyExchange(config));
  }

  // Ajouter l'authentification utilisateur si fournie
  if (options?.getAuthToken) {
    exchanges.push(createUserAuthExchange(options.getAuthToken));
  }

  exchanges.push(fetchExchange);

  return new Client({
    url: config.url,
    exchanges,
    requestPolicy: 'cache-and-network',
  });
}

// =============================================================================
// CLIENTS PRÉ-CONFIGURÉS
// =============================================================================

/**
 * Client pour le service Profile
 * Utilisé côté client avec authentification utilisateur
 */
export const profileClient = createServiceClient('profile');

/**
 * Fonction pour créer un client Profile avec token utilisateur
 */
export function createProfileClientWithAuth(
  getAuthToken: () => Promise<string | null>
): Client {
  return createServiceClient('profile', { getAuthToken });
}
