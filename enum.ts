export enum OperationType {
	Payment = 'pago',
	Debt = 'deuda',
	Owe = 'debo',
	Plan = 'plan'
}

export interface Transaction {
	amount: number
	from: string
	to: string
	debt: boolean
	date: string
}

export const MINUTE = 60000
