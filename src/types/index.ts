import type {
	ContextConfigDefault,
	FastifyBaseLogger,
	FastifySchema,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
	RouteGenericInterface,
	RouteShorthandOptions,
} from "fastify";
import type { ValibotTypeProvider } from "fastify-type-provider-valibot";

export type ValibotRouteShorthandOptions = RouteShorthandOptions<
	RawServerDefault,
	RawRequestDefaultExpression<RawServerDefault>,
	RawReplyDefaultExpression<RawServerDefault>,
	RouteGenericInterface,
	ContextConfigDefault,
	FastifySchema,
	ValibotTypeProvider,
	FastifyBaseLogger
>;
