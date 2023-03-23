import { Context, NarrowedContext } from 'telegraf'
import { Message, Update } from 'typegram'
import { Operation } from './operation';

export type ContextParameter = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>

export type CommandsStepsList = {
	[key in OperationName]: SimpleOperation[]
}

export type CommandType = {
    name: string
    invocator: string
    description: string
    procedure: (ctx:ContextParameter) => any
}

/** Tipos de operaciones */
export type OperationName = 'payment' | 'feedback' | 'subscribe' | 'broadcast' | 'income'
export type SimpleOperation = (ctx:ContextParameter) => Promise<unknown>

export type OperatorStruct = {
	buffer: {
		[key in string]: Operation
	}
	start: (ctx: ContextParameter, command:OperationName) => void
	nextStep: SimpleOperation
	end: (ctx: ContextParameter) => void
}
