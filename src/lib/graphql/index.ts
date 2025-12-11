/**
 * Export centralisé du module GraphQL.
 */

// Client
export { 
  profileClient, 
  createServiceClient, 
  createProfileClientWithAuth,
  type ServiceConfig,
  type GraphQLServices,
} from './client';

// Types
export * from './types';

// Opérations Profile
export * from './profile-operations';
