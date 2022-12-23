export enum OperationType {
	Payment = 'pago',
	Debt = 'deuda',
	Owe = 'debo',
	Plan = 'plan'
}

export interface Transaction {
	type: OperationType
	amount: number
	category: string
	from: string
	to: string
	resolved: boolean
	date: string
}

export const MINUTE = 60000
