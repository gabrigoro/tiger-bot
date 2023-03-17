import { Context, NarrowedContext } from 'telegraf'
import { Message, Update } from 'typegram'

export type ContextParameter = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>

export type CommandsStepsList = {
	[key in NewOperationType]: SimpleOperation[]
}

export type CommandType = {
    name: string
    invocator: string
    description: string
    procedure: (ctx:ContextParameter) => any
}

/** Tipos de operaciones */
export type NewOperationType = 'payment' | 'feedback' | 'subscribe' | 'broadcast' | 'income' | 'null'
export type SimpleOperation = (ctx:ContextParameter) => void

export type OperatorStruct = {
	command: NewOperationType
	isActive: boolean
	step: number
	start: (ctx: ContextParameter, command:NewOperationType) => void
	nextStep: SimpleOperation
	end: (ctx: ContextParameter) => void
}