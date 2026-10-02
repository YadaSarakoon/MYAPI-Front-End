import { randomToken } from '../sandboxLogic';
import type {
  ApiResponseState,
  Endpoint,
  SandboxCredentials,
} from '../types';

type CompletedSandboxResponse = Exclude<ApiResponseState, null | { loading: true }>;

export interface SandboxSimulationResult {
  response: CompletedSandboxResponse;
  issuedAccessToken?: string;
}

export interface SandboxSimulationInput {
  endpoint: Endpoint;
  bodyText: string;
  credentials: SandboxCredentials | null;
  token: string;
  issuedAccessToken: string | null;
}

export async function simulateSandboxRequest({
  endpoint,
  bodyText,
  credentials,
  token,
  issuedAccessToken,
}: SandboxSimulationInput): Promise<SandboxSimulationResult> {
  const delay = 500 + Math.random() * 400;
  await new Promise<void>((resolve) => window.setTimeout(resolve, delay));
  const responseTime = Math.round(delay);

  if (endpoint.id === 'generate-access-token') {
    let parsed: { client_id?: string; client_secret?: string };

    try {
      parsed = JSON.parse(bodyText || '{}');
    } catch {
      return {
        response: {
          status: 400,
          ms: responseTime,
          body: { status: 400, message: 'Invalid JSON body', name: 'BadRequestException' },
          demo: true,
        },
      };
    }

    const credentialsMatch =
      credentials !== null &&
      parsed.client_id === credentials.clientId &&
      parsed.client_secret === credentials.clientSecret;

    if (!credentialsMatch) {
      return {
        response: {
          status: 400,
          ms: responseTime,
          body:
            endpoint.errors[0]?.body ??
            { error: 'invalid_client', error_description: 'Invalid client authentication' },
          demo: true,
        },
      };
    }

    const accessToken = `demo_access_token_${randomToken(12)}`;
    return {
      issuedAccessToken: accessToken,
      response: {
        status: 200,
        ms: responseTime,
        body: { expires_in: 7200, token_type: 'bearer', access_token: accessToken },
        demo: true,
      },
    };
  }

  const typedToken = token.trim();
  if (endpoint.auth === 'bearer' && !typedToken) {
    return {
      response: {
        status: 401,
        ms: responseTime,
        body: {
          status: 401,
          message: 'Access token is missing or unauthorized',
          name: 'UnauthorizedException',
        },
        demo: true,
      },
    };
  }

  if (endpoint.auth === 'bearer' && typedToken !== issuedAccessToken) {
    return {
      response: {
        status: 401,
        ms: responseTime,
        body: {
          status: 401,
          message: 'Access token is invalid or expired',
          name: 'UnauthorizedException',
        },
        demo: true,
      },
    };
  }

  return {
    response: {
      status: endpoint.successCode,
      ms: responseTime,
      body: endpoint.successExample,
      demo: true,
    },
  };
}
