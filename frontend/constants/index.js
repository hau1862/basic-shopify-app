export const AllPlanData = Object.freeze({
	0: {
		id: 0,
		code: "v1-free",
		name: "Free Plan"
	},
	1: {
		id: 1,
		code: "v1-starter",
		name: "Starter Plan"
	},
	2: {
		id: 2,
		code: "v1-advanced",
		name: "Advanced Plan"
	},
	3: {
		id: 3,
		code: "v1-premium",
		name: "Premium Plan"
	}
});

export const AllModuleData = Object.freeze({
	0: {
		id: 0,
		code: "request-quote",
		name: "Request Quote",
		description: "Allow customer to place a quote on your products",
		planIds: [0, 1, 2, 3]
	},
	1: {
		id: 1,
		code: "pay-later",
		name: "Pay Later",
		description: "Allow customers to make net payment term orders",
		planIds: [0, 1, 2, 3]
	},
	2: {
		id: 2,
		code: "quick-order",
		name: "Quick Order",
		description: "Create a product catalog for easy bulk ordering",
		planIds: [0, 1, 2, 3]
	},
	3: {
		id: 3,
		code: "company-account",
		name: "Company Account",
		description: "Allow customer to register and manage companies",
		planIds: [0, 1, 2, 3]
	},
	4: {
		id: 4,
		code: "sales-rep",
		name: "Sales Rep",
		description: "Sales reps help take care of customers right from your store",
		planIds: [0, 1, 2, 3]
	}
});
