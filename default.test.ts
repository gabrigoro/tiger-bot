import { describe, it, expect } from 'vitest'
import { processMessage } from './actions'
import * as db from './database'

describe('Inicio', () => {
    it('Trenes', async () => {
        processMessage('Trenes', (response) => {
            expect(response).to.include('Tan todos cortados')
        })
    })
})

describe.concurrent('Pagos', () => {
    it('Pago 100 empanadas', async () => {
        processMessage('Pago 100 empanadas', () => {})
        processMessage('Pago 100 empanadas', () => {})
        processMessage('Pago 100 empanadas', (response) => {
            expect(response).to.include('Llevas gastando $300')
        })
    })
})

describe.concurrent('Deudas', () => {
    it('Debo 100 fulano x3', async () => {
        processMessage('Debo 100 fulano', () => {})
        processMessage('Debo 100 fulano', () => {})
        processMessage('Debo 100 fulano', (response) => {
            expect(response).to.include('Debes $300')
        })
    })
})

describe.concurrent('Deben', () => {
    it('Deben 100 juan x3', async () => {
        processMessage('Deben 100 juan', () => {})
        processMessage('Deben 100 juan', () => {})
        processMessage('Deben 100 juan', (response) => {
            expect(response).to.include('Te deben $300')
        })
    })
})

describe('Database', () => {
    it('store', async () => {
        expect(db.getTotalPayments()).to.equal(300)
        expect(db.getDebtsToPerson('fulano')).to.equal(300)
        expect(db.getDebtsFromPerson('juan')).to.equal(300)
    })
})