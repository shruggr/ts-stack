import type { Knex } from 'knex'
import type { SessionManager, WalletInterface } from '@bsv/sdk'
import type { Request } from 'express'

export interface MessageBoxContext {
  wallet: WalletInterface
  /**
   * Shared BRC-103 session store. When a host embeds messagebox and passes its
   * own SessionManager, a single /.well-known/auth handshake authenticates the
   * client across every surface that shares it. Omitted → the auth middleware
   * creates its own isolated store (standalone behaviour, unchanged).
   */
  sessionManager?: SessionManager
  knex: Knex
  routingPrefix: string
  enableWebSockets: boolean
  enableSwagger: boolean
  calculateRequestPrice: (req: Request) => Promise<number> | number
  logger: Console
}

export interface CreateMessageBoxContextOptions {
  wallet: WalletInterface
  /** Optional shared session store — see MessageBoxContext.sessionManager. */
  sessionManager?: SessionManager
  knex: Knex
  routingPrefix?: string
  enableWebSockets?: boolean
  enableSwagger?: boolean
  calculateRequestPrice?: (req: Request) => Promise<number> | number
  logger?: Console
}

export function createMessageBoxContext (
  deps: CreateMessageBoxContextOptions
): MessageBoxContext {
  if (deps.wallet == null) {
    throw new Error('createMessageBoxContext requires a wallet')
  }
  if (deps.knex == null) {
    throw new Error('createMessageBoxContext requires a knex instance')
  }

  return {
    wallet: deps.wallet,
    sessionManager: deps.sessionManager,
    knex: deps.knex,
    routingPrefix: deps.routingPrefix ?? '',
    enableWebSockets: deps.enableWebSockets ?? true,
    enableSwagger: deps.enableSwagger ?? true,
    calculateRequestPrice: deps.calculateRequestPrice ?? (async (req: Request) => {
      if (req.url.includes('/sendMessage')) {
        // configurable via deps.calculateRequestPrice
      }
      return 0
    }),
    logger: deps.logger ?? console
  }
}
